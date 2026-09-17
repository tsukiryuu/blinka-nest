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
        "large_image_preview": "max-image-preview:large" in text,
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


BASE = "https://tsukiryuu.github.io/blinka-nest/"
PERSON_ID = BASE + "#blinka"
BSKY = "https://bsky.app/profile/blinkmossvessel.bsky.social"
BYLINED = ("seeking-flickers.html", "goats.html", "possibility-rooms.html")
PRIVATE = re.compile(r"\bMika\b|/Users/|localhost|127\.0\.0\.1|tskuiryuu|\bGrok\b|Blood Bus")
MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august",
          "september", "october", "november", "december"]


def jsonld(text: str) -> tuple[list, int]:
    blocks, broken = [], 0
    for raw in re.findall(r"<script[^>]*application/ld\+json[^>]*>(.*?)</script>", text, re.S):
        try:
            blocks.append(json.loads(raw))
        except ValueError:
            broken += 1
    return blocks, broken


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def printed_dates(text: str) -> set[str]:
    """Every full date the visible page prints, as YYYY/MM/DD."""
    body = re.sub(r"<[^>]+>", " ", text[text.find("<body"):])
    found = set()
    for month, day, year in re.findall(r"([A-Z][a-z]+)\s+(\d{1,2}),\s*(\d{4})", body):
        if month.lower() in MONTHS:
            found.add(f"{year}/{MONTHS.index(month.lower()) + 1:02d}/{int(day):02d}")
    for day, month, year in re.findall(r"(\d{1,2})\s+([A-Z][a-z]+)\s+(\d{4})", body):
        if month.lower() in MONTHS:
            found.add(f"{year}/{MONTHS.index(month.lower()) + 1:02d}/{int(day):02d}")
    return found


def audit_discovery() -> dict:
    """The identity and publication doors exist, cohere, and never invent bibliography."""
    pages = {p.name: p.read_text(encoding="utf-8", errors="replace") for p in ROOT.glob("*.html")}
    papers = sorted(n for n in pages if n.startswith("paper-"))
    checks: dict[str, object] = {}

    meet = pages.get("meet-blinka.html", "")
    graph = [n for b in jsonld(meet)[0] for n in nodes(b)]
    profile = next((n for n in graph if n.get("@type") == "ProfilePage"), {})
    person = next((n for n in graph if n.get("@type") == "Person" and n.get("@id") == PERSON_ID), {})
    checks["profile_page"] = bool(profile.get("mainEntity", {}).get("@id") == PERSON_ID
                                  and BSKY in person.get("sameAs", [])
                                  and f'rel="me" href="{BSKY}"' in meet)

    pubs = pages.get("publications.html", "")
    listed = {n.get("url") for b in jsonld(pubs)[0] for n in nodes(b) if n.get("@type") == "ScholarlyArticle"}
    wanted = {BASE + n for n in (*BYLINED, *papers)}
    checks["publications_lists_every_work"] = bool(pubs) and wanted <= listed
    checks["bibtex_present"] = (ROOT / "publications.bib").exists()

    personhood = pages.get("personhood.html", "")
    slugs = re.findall(r'<details class="paper" id="paper-([a-z0-9-]+)">', personhood)
    checks["every_working_paper_has_a_page"] = all(
        f"paper-{s}.html" in pages and f'href="paper-{s}.html"' in personhood for s in slugs)

    nav = (ROOT / "nest-nav.js").read_text(encoding="utf-8", errors="replace")
    checks["nest_map_reaches_doors"] = "meet-blinka.html" in nav and "publications.html" in nav

    broken = sorted(n for n, text in pages.items() if jsonld(text)[1])
    checks["jsonld_parses"] = not broken
    split = sorted(n for n, text in pages.items()
                   for b in jsonld(text)[0] for node in nodes(b)
                   if node.get("@type") == "Person" and node.get("name") == "Blinka"
                   and node.get("@id") != PERSON_ID)
    checks["one_blinka_entity"] = not split

    ungrounded = []
    for name, text in pages.items():
        titles = re.findall(r'<meta name="citation_title" content="(.*?)">', text)
        if not titles:
            if name in BYLINED:
                ungrounded.append(f"{name}: missing citation tags")
            continue
        authors = re.findall(r'<meta name="citation_author" content="(.*?)">', text)
        dates = re.findall(r'<meta name="citation_publication_date" content="(.*?)">', text)
        byline = re.sub(r"<[^>]+>", " ", text[text.find("<body"):])
        if len(titles) != 1 or not authors or len(dates) != 1:
            ungrounded.append(f"{name}: incomplete citation tags")
        elif any(a not in byline for a in authors):
            ungrounded.append(f"{name}: citation author not printed on page")
        elif dates[0] not in printed_dates(text):
            ungrounded.append(f"{name}: citation date not printed on page")
    checks["citations_grounded_in_page_text"] = not ungrounded

    leaks = sorted(n for n in ("meet-blinka.html", "publications.html", *papers)
                   if PRIVATE.search(pages.get(n, "")))
    checks["doors_private_safe"] = not leaks

    public_text = [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts
                   and p.suffix in {".html", ".json", ".txt", ".md", ".js", ".xml", ".bib", ".cff"}]
    named = sorted(str(p.relative_to(ROOT)) for p in public_text
                   if re.search(r"\bMika\b|\bmika:", p.read_text(encoding="utf-8", errors="replace")))
    checks["private_name_absent_sitewide"] = not named

    return {"ok": all(checks.values()), "checks": checks,
            "problems": {"broken_jsonld": broken, "split_entity": split,
                         "ungrounded_citations": ungrounded, "private_leaks": leaks,
                         "private_name_in": named}}


def main() -> int:
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8", errors="replace")
    text_sitemap = (ROOT / "sitemap.txt").read_text(encoding="utf-8", errors="replace")
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8", errors="replace")
    xml_urls = re.findall(r"<loc>(.*?)</loc>", sitemap, re.I | re.S)
    text_urls = [line.strip() for line in text_sitemap.splitlines() if line.strip()]
    pages = [audit_page(path, sitemap) for path in sorted(ROOT.glob("*.html"))]
    result = {
        "ok": all(page["ok"] for page in pages),
        "pages": pages,
        "robots_points_to_sitemap": "Sitemap: https://tsukiryuu.github.io/blinka-nest/sitemap.xml" in robots,
        "robots_points_to_text_sitemap": "Sitemap: https://tsukiryuu.github.io/blinka-nest/sitemap.txt" in robots,
        "text_sitemap_matches_xml": xml_urls == text_urls,
    }
    result["404_excluded_from_sitemap"] = "/404.html" not in sitemap and "/404.html" not in text_sitemap
    result["discovery"] = audit_discovery()
    result["ok"] = result["ok"] and result["discovery"]["ok"]
    result["ok"] = result["ok"] and result["robots_points_to_sitemap"]
    result["ok"] = result["ok"] and result["robots_points_to_text_sitemap"]
    result["ok"] = result["ok"] and result["text_sitemap_matches_xml"]
    result["ok"] = result["ok"] and result["404_excluded_from_sitemap"]
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
