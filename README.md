# TOING — Jharsuguda Food PWA

A mobile-first installable food discovery web app. Customers browse restaurant menus and use a `tel:` link to call a restaurant directly.

## Files
- `index.html` — customer app
- `admin.html` — local demo admin
- `app.js` — customer logic
- `data.js` — starter restaurant data
- `style.css` — UI
- `manifest.json` — PWA manifest
- `sw.js` — service worker
- `icon.svg` — app icon

## Run locally
Use any static server. For example:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## GitHub + Vercel
Upload the files to a GitHub repository and import that repository into Vercel. No build command is required.

## Important production note
The included admin is a **local-device demo**, not secure multi-user authentication. Data is stored in the browser's `localStorage`. Before using it as a real public marketplace, use a backend/database and server-side authentication, and only publish restaurant contact numbers/menu content that is public or authorized.

## Adding real restaurants
Edit `data.js`, or use the Admin page after unlocking it with the demo PIN `1234`. Export/import JSON can be used for backups.

## Direct calling
The Order button uses `tel:`. On supported phones it opens the phone dialer with the restaurant's listed number. It does not place a call silently or process payments.

## Suggested production upgrades
1. Supabase/Firebase database
2. Real admin authentication
3. Restaurant-owner accounts
4. Image storage
5. Search/filter by locality
6. Menu availability
7. Order/request logging
8. Terms, privacy policy and restaurant consent workflow
