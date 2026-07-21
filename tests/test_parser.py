from airbnb_bali_scraper.parser import extract_listing_urls, parse_villa
from airbnb_bali_scraper.scraper import safe_folder_name


class Result:
    def __init__(self, values):
        self.values = values

    def getall(self):
        return self.values


class Page:
    def __init__(self, selectors):
        self.selectors = selectors

    def css(self, selector):
        return Result(self.selectors.get(selector, []))


def test_extract_listing_urls_deduplicates_and_normalizes():
    page = Page(
        {
            'a[href*="/rooms/"]::attr(href)': [
                "/rooms/123?adults=2",
                "https://www.airbnb.com/rooms/123",
            ],
            "script::text": ['{"url":"https:\\/\\/www.airbnb.com\\/rooms\\/456"}'],
        }
    )

    assert extract_listing_urls(page) == [
        "https://www.airbnb.com/rooms/123",
        "https://www.airbnb.com/rooms/456",
    ]


def test_parse_villa_uses_structured_data_and_only_photo_media():
    structured = """
    {
      "@type": "VacationRental",
      "name": "Villa Sol",
      "description": "Una villa tranquila frente al mar con piscina privada y jardín tropical.",
      "image": [
        "https://a0.muscache.com/im/pictures/abc/one.jpeg?im_w=720",
        "https://a0.muscache.com/im/pictures/abc/two.webp?im_w=1200"
      ]
    }
    """
    page = Page(
        {
            "script::text": [structured],
            'script[type="application/ld+json"]::text': [structured],
            'meta[property="og:title"]::attr(content)': ["Villa Sol - Airbnb"],
            'meta[property="og:description"]::attr(content)': [
                "Una villa tranquila frente al mar con piscina privada y jardín tropical."
            ],
            'meta[property="og:image"]::attr(content)': [
                "https://a0.muscache.com/im/pictures/abc/one.jpeg?im_w=320"
            ],
            "img::attr(src)": [
                "https://a0.muscache.com/im/pictures/abc/two.webp?im_w=320"
            ],
            "img::attr(srcset)": [],
            "video::attr(src)": [],
            "h1::text": ["Villa Sol"],
            "title::text": ["Airbnb"],
        }
    )

    villa = parse_villa(page, "https://www.airbnb.com/rooms/987")

    assert villa.listing_id == "987"
    assert villa.name == "Villa Sol - Airbnb"
    assert villa.description.startswith("Una villa tranquila")
    assert villa.photo_urls == [
        "https://a0.muscache.com/im/pictures/abc/one.jpeg",
        "https://a0.muscache.com/im/pictures/abc/two.webp",
    ]
    assert villa.has_video is False


def test_parse_villa_detects_video_and_safe_folder_removes_symbols():
    page = Page(
        {
            "script::text": ['{"videoUrl":"https://cdn.example/video/tour.mp4"}'],
            'script[type="application/ld+json"]::text': [],
            "video::attr(src)": ["https://cdn.example/video/tour.mp4"],
        }
    )

    villa = parse_villa(page, "https://www.airbnb.com/rooms/42")

    assert villa.has_video is True
    assert safe_folder_name("Villa / Mar 🌊", "42") == "Villa Mar [42]"
