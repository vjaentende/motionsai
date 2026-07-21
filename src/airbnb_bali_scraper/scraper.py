from __future__ import annotations

import json
import logging
import mimetypes
import os
import re
import shutil
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict
from pathlib import Path
from typing import Any, Callable
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .models import Villa
from .parser import extract_listing_urls, parse_villa

LOGGER = logging.getLogger(__name__)
DEFAULT_SEARCH_URL = "https://www.airbnb.com/bali-indonesia/stays/villas"
IMAGE_EXTENSIONS = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def safe_folder_name(name: str, listing_id: str) -> str:
    cleaned = re.sub(r"[^\w .-]", "", name, flags=re.UNICODE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" .-_")[:90]
    return f"{cleaned or 'villa'} [{listing_id}]"


def _search_action(browser_page: Any) -> None:
    for _ in range(5):
        browser_page.mouse.wheel(0, 1800)
        browser_page.wait_for_timeout(500)


def _listing_action(browser_page: Any) -> None:
    for selector in (
        'button:has-text("Show all photos")',
        'button:has-text("Mostrar todas las fotos")',
        '[data-testid="photo-viewer-section"] button',
    ):
        try:
            button = browser_page.locator(selector).first
            if button.is_visible(timeout=800):
                button.click(timeout=2_000)
                browser_page.wait_for_timeout(800)
                break
        except Exception:  # La galería y su texto cambian según mercado/idioma.
            continue
    for _ in range(12):
        browser_page.mouse.wheel(0, 1600)
        browser_page.wait_for_timeout(250)


def _page_setup(browser_page: Any) -> None:
    """Evita descargar o reproducir audio/vídeo durante la navegación."""

    def handle(route: Any) -> None:
        if route.request.resource_type == "media":
            route.abort()
        else:
            route.continue_()

    browser_page.route("**/*", handle)


class AirbnbBaliScraper:
    def __init__(
        self,
        output_dir: Path,
        *,
        delay: float = 2.0,
        fetcher: str = "stealthy",
        search_url: str = DEFAULT_SEARCH_URL,
        request_timeout: int = 45,
    ) -> None:
        self.output_dir = output_dir
        self.delay = max(delay, 0)
        self.fetcher = fetcher
        self.search_url = search_url
        self.request_timeout = request_timeout

    def _fetch(self, url: str, action: Callable[[Any], None]) -> Any:
        if self.fetcher == "http":
            from scrapling.fetchers import Fetcher

            return Fetcher.fetch(
                url,
                timeout=self.request_timeout,
                headers={"Accept-Language": "en-US,en;q=0.9"},
            )

        from scrapling.fetchers import StealthyFetcher

        return StealthyFetcher.fetch(
            url,
            headless=True,
            locale="en-US",
            network_idle=True,
            timeout=self.request_timeout * 1_000,
            page_setup=_page_setup,
            page_action=action,
        )

    def discover(self, candidate_limit: int) -> list[str]:
        LOGGER.info("Buscando fichas públicas en %s", self.search_url)
        page = self._fetch(self.search_url, _search_action)
        urls = extract_listing_urls(page)
        if not urls:
            raise RuntimeError(
                "Airbnb no devolvió enlaces. Puede haber presentado un captcha o "
                "cambiado el marcado; no se intentará eludir un desafío interactivo."
            )
        return urls[:candidate_limit]

    def run(self, limit: int = 15) -> list[Villa]:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        villas: list[Villa] = []
        for url in self.discover(max(limit * 4, limit)):
            if len(villas) >= limit:
                break
            if villas or self.delay:
                time.sleep(self.delay)
            LOGGER.info("Procesando %s", url)
            try:
                villa = parse_villa(self._fetch(url, _listing_action), url)
            except Exception as exc:
                LOGGER.warning("No se pudo procesar %s: %s", url, exc)
                continue
            if villa.has_video:
                LOGGER.info("Omitida %s porque su ficha contiene vídeo", villa.listing_id)
                continue
            if not villa.photo_urls:
                LOGGER.warning("Omitida %s: no se encontraron fotos", villa.listing_id)
                continue
            self._save_villa(villa)
            villas.append(villa)

        self._write_manifest(villas)
        if len(villas) < limit:
            LOGGER.warning("Se guardaron %d de las %d villas solicitadas", len(villas), limit)
        return villas

    def _save_villa(self, villa: Villa) -> None:
        folder = self.output_dir / safe_folder_name(villa.name, villa.listing_id)
        photos_dir = folder / "photos"
        if photos_dir.exists():
            shutil.rmtree(photos_dir)
        photos_dir.mkdir(parents=True, exist_ok=True)
        (folder / "description.txt").write_text(
            f"{villa.name}\n\n{villa.description}\n\nFuente: {villa.source_url}\n",
            encoding="utf-8",
        )

        downloaded: list[str] = []
        workers = min(6, len(villa.photo_urls))
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {
                executor.submit(self._download_photo, url, photos_dir, index): url
                for index, url in enumerate(villa.photo_urls, start=1)
            }
            for future in as_completed(futures):
                try:
                    filename = future.result()
                except (HTTPError, URLError, OSError, ValueError) as exc:
                    LOGGER.warning("Foto omitida (%s): %s", futures[future], exc)
                else:
                    downloaded.append(filename)

        metadata = asdict(villa)
        metadata["downloaded_photos"] = sorted(downloaded)
        metadata["photo_count"] = len(downloaded)
        (folder / "metadata.json").write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    def _download_photo(self, url: str, directory: Path, index: int) -> str:
        request = Request(
            url,
            headers={
                "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.5",
                "Referer": "https://www.airbnb.com/",
                "User-Agent": "Mozilla/5.0 (compatible; BaliVillaArchiver/1.0)",
            },
        )
        with urlopen(request, timeout=self.request_timeout) as response:
            content_type = response.headers.get_content_type().lower()
            if not content_type.startswith("image/") or content_type not in IMAGE_EXTENSIONS:
                raise ValueError(f"contenido rechazado: {content_type}")
            extension = IMAGE_EXTENSIONS.get(content_type) or mimetypes.guess_extension(
                content_type
            )
            if not extension:
                raise ValueError(f"formato de imagen desconocido: {content_type}")
            filename = f"{index:03d}{extension}"
            target = directory / filename
            temporary = target.with_suffix(target.suffix + ".part")
            with temporary.open("wb") as output:
                while chunk := response.read(1024 * 256):
                    output.write(chunk)
            os.replace(temporary, target)
            return filename

    def _write_manifest(self, villas: list[Villa]) -> None:
        manifest = [
            {
                "listing_id": villa.listing_id,
                "name": villa.name,
                "source_url": villa.source_url,
                "folder": safe_folder_name(villa.name, villa.listing_id),
            }
            for villa in villas
        ]
        (self.output_dir / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
