# GIRO — Decision Roulette

Interactive roulette you can run locally. Add your own options, click **SPIN**, and the wheel chooses one.

## Run on localhost

From the repo root:

```bash
python3 -m http.server 4173 --directory roulette
```

Then open [http://localhost:4173](http://localhost:4173).

## Publish with Cloudflare

### Quick public link (temporary)

With the local server running:

```bash
cloudflared tunnel --url http://127.0.0.1:4173
```

Cloudflare prints a `https://*.trycloudflare.com` URL you can open from any device.

### Permanent site (Cloudflare Pages)

Needs a Cloudflare API token with Pages edit permission:

```bash
npx wrangler pages deploy roulette --project-name giro-roulette --branch main
```

Your site will be at `https://giro-roulette.pages.dev`.

## Features

- Add / remove custom options (2–24)
- Spinning wheel with easing animation
- Shuffle and clear controls
- Works on desktop and mobile
