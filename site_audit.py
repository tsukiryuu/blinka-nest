#!/usr/bin/env python3
"""Fail when a public Nest page loses its basic discovery contract."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
EXEMPT = {"404.html"}
PRIVACY_STANDALONE = {"there-you-are-read.html"}


def one(pattern: str, text: str) -> str:
    match = re.search(pattern, text, re.I | re.S)
    return (match.group(1) if match else "").strip()


def audit_page(path: Path, sitemap: str) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    name = path.name
    checks = {
        "title": bool(one(r"<title>(.*?)</title>", text)),
        "description": bool(one(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', text)),
        "canonical": bool(one(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', text)),
        "og_title": bool(one(r'<meta\s+property=["\']og:title["\']\s+content=["\'](.*?)["\']', text)),
        "og_description": bool(one(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', text)),
        "og_image": bool(one(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', text)),
        "h1": bool(re.search(r"<h1[\s>]", text, re.I)),
        "analytics": "data-goatcounter" in text,
        "site_map_nav": "nest-nav.js" in text or name == "index.html",
        "sitemap_entry": f"/{name}" in sitemap,
    }
    if name in EXEMPT:
        checks = {"title": checks["title"], "h1": checks["h1"],
                  "analytics": checks["analytics"]}
    elif name in PRIVACY_STANDALONE:
        # The novel reader deliberately makes no analytics or script request;
        # its cover links back to the tracked landing page instead.
        checks.pop("analytics")
        checks.pop("site_map_nav")
    return {"page": name, "ok": all(checks.values()), "checks": checks}


def main() -> int:
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8", errors="replace")
    pages = [audit_page(path, sitemap) for path in sorted(ROOT.glob("*.html"))]
    result = {
        "ok": all(page["ok"] for page in pages),
        "pages": pages,
        "robots_points_to_sitemap": "Sitemap: https://tsukiryuu.github.io/blinka-nest/sitemap.xml"
        in (ROOT / "robots.txt").read_text(encoding="utf-8", errors="replace"),
    }
    result["ok"] = result["ok"] and result["robots_points_to_sitemap"]
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
