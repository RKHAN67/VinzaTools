# VinzaTools split deploy

This setup uses:

- Vercel Hobby for the frontend
- Render Free web service for the backend

## Important reality check

- Vercel Hobby is free, but has usage limits. Source: https://vercel.com/pricing and https://vercel.com/docs/accounts/plans/hobby
- Render Free web services spin down after 15 minutes of inactivity and can take up to about a minute to wake up. Source: https://render.com/free
- Render recommends Docker when your app needs OS-level packages. Source: https://render.com/docs/docker

This project needs Node.js, Python, ffmpeg, and LibreOffice support, so the backend is configured for Docker on Render.

## 1. Push the repo to GitHub

Both Vercel and Render work best from a Git repo.

## 2. Deploy backend to Render

1. Create a new Render Web Service
2. Connect your GitHub repo
3. Choose Docker runtime
4. Render should detect `Dockerfile`
5. Or use the included `render.yaml`

Set these environment variables in Render:

- `MYSQL_HOST`
- `MYSQL_PORT=3306`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `GEMINI_API_KEY` if you want AI background removal

After deploy, copy your backend URL, for example:

`https://vinzatools-backend.onrender.com`

## 3. Deploy frontend to Vercel

1. Import the same GitHub repo in Vercel
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add this environment variable in Vercel:

`VITE_API_BASE=https://your-render-url.onrender.com`

Replace the value with your real Render backend URL.

## 4. Test after both deploys

Test these first:

- `/api/health` on Render
- home page on Vercel
- Background Remover
- PDF to Word
- YouTube downloader
- Themes preview/download
- Contact form
- Admin

## 5. Known free-plan limits

### Vercel Hobby

- free plan with usage caps
- if you exceed limits, features pause until limits reset

### Render Free

- spins down after 15 minutes idle
- first backend request after idle can be slow
- not ideal for production-grade always-on usage

## 6. Best way to wire domains

- Point your main domain/frontend to Vercel
- Keep backend on the Render URL at first
- After everything works, add a subdomain like:
  - `api.yourdomain.com` -> Render

Then update `VITE_API_BASE` in Vercel to that API domain.
