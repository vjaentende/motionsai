from dataclasses import dataclass, field


@dataclass(slots=True)
class Villa:
    """Datos públicos extraídos de una ficha."""

    listing_id: str
    source_url: str
    name: str
    description: str
    photo_urls: list[str] = field(default_factory=list)
    has_video: bool = False
