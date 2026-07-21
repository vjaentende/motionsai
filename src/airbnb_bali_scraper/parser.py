from __future__ import annotations

import html
import json
import re
from base64 import urlsafe_b64decode
from collections.abc import Iterable, Iterator
from typing import Any
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from .models import Villa

AIRBNB_ORIGIN = "https://www.airbnb.com"
ROOM_RE = re.compile(r"(?:https?://(?:www\.)?airbnb\.[^/]+)?/rooms/(\d+)")
URL_RE = re.compile(r"https?://[^\s\"'<>\\]+", re.IGNORECASE)
VIDEO_RE = re.compile(
    r"(?:\.m3u8|\.mp4|\.mov|\.webm|/video(?:s)?/)(?:[?&#/\s\"']|$)",
    re.IGNORECASE,
)
PHOTO_HOSTS = ("muscache.com", "airbnb.com")
PHOTO_PATH_MARKERS = ("/im/pictures/", "/pictures/", "/picture/")
NON_LISTING_PATHS = (
    "/airbnbplatformassets",
    "/airbnb-platform-assets/",
    "/mediaverse/",
    "/user/",
)
DESCRIPTION_KEYS = {
    "description",
    "listingdescription",
    "spacedescription",
    "summary",
}
NAME_KEYS = {"name", "title", "listingname"}


def _values(page: Any, selector: str) -> list[str]:
    """Adapta la API CSS de Scrapling y facilita pruebas sin navegador."""
    result = page.css(selector)
    return [str(value) for value in result.getall() if value]


def _first(page: Any, selector: str) -> str:
    values = _values(page, selector)
    return values[0].strip() if values else ""


def _decode_embedded(value: str) -> str:
    return html.unescape(
        value.replace("\\u002F", "/")
        .replace("\\u002f", "/")
        .replace("\\/", "/")
        .replace("\\u0026", "&")
    )


def _walk(value: Any) -> Iterator[tuple[str, Any]]:
    if isinstance(value, dict):
        for key, child in value.items():
            yield str(key), child
            yield from _walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk(child)


def _json_documents(scripts: Iterable[str]) -> Iterator[Any]:
    for script in scripts:
        try:
            yield json.loads(script)
        except (json.JSONDecodeError, TypeError):
            continue


def _clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def _canonical_photo_url(raw_url: str) -> str | None:
    url = _decode_embedded(raw_url).rstrip("),.;]")
    try:
        parts = urlsplit(url)
    except ValueError:
        return None
    host = (parts.hostname or "").lower()
    path = parts.path.lower()
    if (
        parts.scheme not in {"http", "https"}
        or not any(host.endswith(domain) for domain in PHOTO_HOSTS)
        or not any(marker in path for marker in PHOTO_PATH_MARKERS)
        or VIDEO_RE.search(url)
        or any(marker in path for marker in NON_LISTING_PATHS)
    ):
        return None

    # Conserva parámetros no relacionados con el redimensionado de Airbnb.
    query = urlencode(
        [
            (key, value)
            for key, value in parse_qsl(parts.query)
            if key not in {"im_w", "im_h", "im_q", "im_format"}
        ]
    )
    return urlunsplit(("https", parts.netloc, parts.path, query, ""))


def _belongs_to_listing(url: str, listing_id: str) -> bool:
    if listing_id in url:
        return True
    match = re.search(r"/Hosting-([^/]+)/original/", url, re.IGNORECASE)
    if not match:
        return False
    encoded = match.group(1)
    try:
        padding = "=" * (-len(encoded) % 4)
        decoded = urlsafe_b64decode(encoded + padding).decode("utf-8")
    except (ValueError, UnicodeDecodeError):
        return False
    return listing_id in decoded


def extract_listing_urls(page: Any, base_url: str = AIRBNB_ORIGIN) -> list[str]:
    candidates = _values(page, 'a[href*="/rooms/"]::attr(href)')
    scripts = _values(page, "script::text")
    for script in scripts:
        candidates.extend(match.group(0) for match in ROOM_RE.finditer(_decode_embedded(script)))

    urls: list[str] = []
    seen: set[str] = set()
    for candidate in candidates:
        match = ROOM_RE.search(candidate)
        if not match or match.group(1) in seen:
            continue
        seen.add(match.group(1))
        urls.append(urljoin(base_url, f"/rooms/{match.group(1)}"))
    return urls


def parse_villa(page: Any, source_url: str) -> Villa:
    scripts = _values(page, "script::text")
    json_scripts = _values(page, 'script[type="application/ld+json"]::text')
    documents = list(_json_documents(json_scripts))

    name_candidates = [
        _first(page, 'meta[property="og:title"]::attr(content)'),
        _first(page, "h1::text"),
        _first(page, "title::text"),
    ]
    description_candidates = [
        _first(page, 'meta[property="og:description"]::attr(content)')
    ]
    photo_candidates = [
        *_values(page, 'meta[property="og:image"]::attr(content)'),
        *_values(page, "img::attr(src)"),
    ]
    for srcset in _values(page, "img::attr(srcset)"):
        photo_candidates.extend(item.strip().split(" ", 1)[0] for item in srcset.split(","))

    for document in documents:
        for key, value in _walk(document):
            normalized_key = key.lower().replace("_", "")
            if isinstance(value, str):
                if normalized_key in NAME_KEYS:
                    name_candidates.append(value)
                if normalized_key in DESCRIPTION_KEYS:
                    description_candidates.append(value)
                if normalized_key in {"image", "imageurl", "contenturl", "url"}:
                    photo_candidates.append(value)
            elif normalized_key == "image" and isinstance(value, list):
                photo_candidates.extend(item for item in value if isinstance(item, str))

    decoded_scripts = [_decode_embedded(script) for script in scripts]
    for script in decoded_scripts:
        photo_candidates.extend(URL_RE.findall(script))

    photos: list[str] = []
    seen_photos: set[str] = set()
    for candidate in photo_candidates:
        photo = _canonical_photo_url(candidate)
        if photo and photo not in seen_photos:
            seen_photos.add(photo)
            photos.append(photo)

    names = [_clean_text(item) for item in name_candidates if _clean_text(item)]
    descriptions = [
        _clean_text(item)
        for item in description_candidates
        if len(_clean_text(item)) >= 40
    ]
    room_match = ROOM_RE.search(source_url)
    listing_id = room_match.group(1) if room_match else "unknown"
    listing_photos = [
        photo for photo in photos if _belongs_to_listing(photo, listing_id)
    ]
    if listing_photos:
        photos = listing_photos
    combined_markup = "\n".join([*_values(page, "video::attr(src)"), *decoded_scripts])

    return Villa(
        listing_id=listing_id,
        source_url=source_url,
        name=names[0] if names else f"Villa Airbnb {listing_id}",
        description=max(descriptions, key=len, default="Descripción no disponible."),
        photo_urls=photos,
        has_video=bool(VIDEO_RE.search(combined_markup)),
    )
