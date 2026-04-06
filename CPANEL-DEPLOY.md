# VinzaTools cPanel Deploy

## Best cPanel setup

You need these cPanel features enabled:

- `Setup Node.js App` or `Application Manager`
- Python 3 access
- `ffmpeg` available on the server
- `libreoffice` available on the server for Office-to-PDF routes

If your host does not provide Node.js app support, File Manager upload alone will not run the backend.

## If you cannot find "Setup Node.js App" or "Application Manager"

That usually means your hosting package does **not** have Passenger/Node.js enabled for your cPanel account.

Ask hosting support to enable these packages/features for your account:

- `ea-apache24-mod-passenger`
- one of:
  - `ea-nodejs20`
  - `ea-nodejs22`
- cPanel `Application Manager` feature

If your server uses CloudLinux, ask whether `Setup Node.js App` / `Node.js Selector` is enabled for your package.

## One-command package prep

Run this locally:

```bash
npm run prepare:cpanel
```

It creates:

```text
cpanel-package/
```

Upload the contents of `cpanel-package` to your cPanel app folder.

## Recommended cPanel app settings

- Application root: `/home/bluevinza/vinzatools`
- Application URL: your domain/subdomain
- Application startup file: `app.js`
- Node.js version: `20` or `22`

## Install dependencies on cPanel

Inside the app folder, run:

```bash
npm install
pip3 install --user -r requirements.txt
```

If your host requires a specific Python path, use it in the app environment:

- `PYTHON_BIN=/usr/bin/python3`
- `FFMPEG_BIN=/usr/bin/ffmpeg`
- `LIBREOFFICE_BIN=/usr/bin/libreoffice`

## Required environment variables

- `NODE_ENV=production`
- `PORT` set by cPanel or app manager
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `GEMINI_API_KEY` if AI background removal is needed

## Important runtime notes

- `uploads/` must be writable
- Office/PDF fidelity routes on Linux depend on `libreoffice`
- Media conversion/download routes depend on `ffmpeg` and Python packages
- If MySQL is unavailable, the app falls back to SQLite automatically

## Deploy flow

1. Run `npm run prepare:cpanel` locally
2. Upload `cpanel-package` contents to `/home/bluevinza/vinzatools`
3. Create the Node.js app in cPanel
4. Set startup file to `app.js`
5. Install dependencies
6. Set environment variables
7. Restart the app from cPanel
