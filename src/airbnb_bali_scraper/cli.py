from __future__ import annotations

import argparse
import logging
from pathlib import Path

from .scraper import AirbnbBaliScraper, DEFAULT_SEARCH_URL


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Guarda nombre, descripción y fotos de villas públicas de Airbnb en Bali. "
            "Las fichas que contienen vídeo se omiten."
        )
    )
    parser.add_argument("--limit", type=int, default=15, help="villas a guardar (15)")
    parser.add_argument(
        "--output", type=Path, default=Path("villas"), help="carpeta de salida"
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="pausa entre fichas, en segundos (2)",
    )
    parser.add_argument(
        "--fetcher",
        choices=("stealthy", "http"),
        default="stealthy",
        help="fetcher de Scrapling (stealthy)",
    )
    parser.add_argument(
        "--search-url",
        default=DEFAULT_SEARCH_URL,
        help="página pública de búsqueda de villas",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if args.limit < 1:
        raise SystemExit("--limit debe ser mayor que cero")
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    scraper = AirbnbBaliScraper(
        args.output,
        delay=args.delay,
        fetcher=args.fetcher,
        search_url=args.search_url,
    )
    villas = scraper.run(args.limit)
    logging.info("Finalizado: %d villas guardadas en %s", len(villas), args.output)
    return 0 if len(villas) == args.limit else 2


if __name__ == "__main__":
    raise SystemExit(main())
