# Scraper de villas de Airbnb en Bali

Herramienta en Python basada en
[Scrapling](https://github.com/D4Vinci/Scrapling) para recopilar hasta 15 fichas
públicas de villas en Bali. Cada villa se guarda en una carpeta propia con:

- `description.txt`: nombre, descripción y URL de origen.
- `metadata.json`: identificador, URLs de fotos y archivos descargados.
- `photos/`: todas las imágenes detectadas y validadas por `Content-Type`.

El scraper bloquea recursos audiovisuales durante la navegación, nunca descarga
vídeos y omite por completo cualquier ficha en cuyo marcado detecte uno.

## Instalación

Requiere Python 3.10 o posterior:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -e ".[dev]"
scrapling install
```

`scrapling install` descarga el navegador necesario para `StealthyFetcher`.

## Uso

```bash
scrape-bali-villas --limit 15 --output villas
```

Alternativamente:

```bash
python3 -m airbnb_bali_scraper.cli --limit 15 --output villas
```

La salida tiene esta estructura:

```text
villas/
├── manifest.json
└── Nombre de la villa [ID]/
    ├── description.txt
    ├── metadata.json
    └── photos/
        ├── 001.jpg
        └── ...
```

Opciones útiles:

```text
--delay 2.0       pausa respetuosa entre fichas
--fetcher http    usa HTTP sin navegador (menos fiable en páginas dinámicas)
--search-url URL  cambia la página pública de búsqueda
```

Si Airbnb presenta un captcha o no publica enlaces en el HTML, el proceso se
detiene sin intentar resolver desafíos interactivos.

## Pruebas

```bash
pytest
```

## Uso responsable

Airbnb puede cambiar su marcado y sus condiciones de uso. Utiliza esta
herramienta únicamente cuando tengas derecho a recopilar y reutilizar el
contenido, conserva la atribución y respeta la normativa aplicable. Las fotos
descargadas se excluyen de Git porque pueden ser grandes y sus derechos
pertenecen a sus autores.