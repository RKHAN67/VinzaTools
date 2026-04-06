from __future__ import annotations

import json
import os
from pathlib import Path

import requests


API_BASE = os.environ.get("MEDIA_SMOKE_API_BASE", "http://127.0.0.1:3000")
TESTING_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = TESTING_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

YOUTUBE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"


def main() -> None:
    health = requests.get(f"{API_BASE}/api/health", timeout=30)
    health.raise_for_status()

    info_res = requests.get(
        f"{API_BASE}/api/youtube/info",
        params={"url": YOUTUBE_URL},
        timeout=300,
    )
    info_payload = info_res.json()

    result = {
        "health": health.json(),
        "youtube_info_status": info_res.status_code,
        "youtube_title": info_payload.get("title"),
        "video_format_count": len(info_payload.get("formats") or []),
        "audio_format_count": len(info_payload.get("audioFormats") or []),
        "download_status": None,
        "download_size": 0,
        "download_file": "",
    }

    if info_res.ok and info_payload.get("formats"):
        formats = info_payload["formats"]
        first_format = next(
            (item for item in formats if str(item.get("url", "")).startswith("/")),
            formats[0],
        )
        download_url = first_format["url"]
        if download_url.startswith("/"):
            download_url = f"{API_BASE}{download_url}"
        elif "googlevideo.com" in download_url or "youtube.com" in download_url:
            download_url = (
                f"{API_BASE}/api/media/download?url={requests.utils.quote(YOUTUBE_URL, safe='')}"
                "&mode=video&title=media-smoke"
            )
        out_file = OUTPUT_DIR / "youtube-smoke-download.bin"
        with requests.get(download_url, stream=True, timeout=600) as download_res:
            result["download_status"] = download_res.status_code
            download_res.raise_for_status()
            with out_file.open("wb") as handle:
                for chunk in download_res.iter_content(chunk_size=1024 * 256):
                    if chunk:
                        handle.write(chunk)
                        if handle.tell() >= 1024 * 1024:
                            break
        result["download_size"] = out_file.stat().st_size
        result["download_file"] = str(out_file)

    report_path = TESTING_DIR / "media-test-results.json"
    report_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
