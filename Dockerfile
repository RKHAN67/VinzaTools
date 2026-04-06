FROM node:22-bookworm

WORKDIR /app

# Runtime tools used by the backend for media/PDF conversion on Linux hosts.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY dist ./dist
COPY themes ./themes
COPY scripts ./scripts
COPY uploads ./uploads
COPY server.mjs ./server.mjs
COPY app.js ./app.js

ENV NODE_ENV=production
EXPOSE 3015

CMD ["node", "app.js"]
