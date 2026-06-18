#!/usr/bin/env python3
"""
fetch_docs.py — pull curated public medical docs listed in sources.yaml into
library/_raw/ for later conversion to Markdown by convert_docs.py.

Run this on a machine with normal internet access (e.g. your laptop). It tries a
plain HTTP request first and, if a site blocks it, optionally falls back to
CloakBrowser (a stealth headless browser) when installed.

Usage:
    python3 tools/fetch_docs.py
    python3 tools/fetch_docs.py --no-cloak     # disable the CloakBrowser fallback

Dependencies (install as needed):
    pip install pyyaml requests
    pip install cloakbrowser        # optional, only for sites that block requests
"""
import argparse
import hashlib
import os
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
RAW = os.path.join(APP, "library", "_raw")


def load_sources():
    path = os.path.join(HERE, "sources.yaml")
    try:
        import yaml  # type: ignore
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    except ImportError:
        sys.exit("Please `pip install pyyaml` to read sources.yaml")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "doc"


def fetch_http(url, ua, timeout=30):
    import requests  # type: ignore
    r = requests.get(url, headers={"User-Agent": ua}, timeout=timeout)
    r.raise_for_status()
    return r.text


def fetch_cloak(url, ua):
    """Fallback for bot-protected sites. Requires `pip install cloakbrowser`."""
    from cloakbrowser import launch  # type: ignore
    browser = launch(headless=True, humanize=True)
    try:
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        return page.content()
    finally:
        browser.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-cloak", action="store_true", help="disable CloakBrowser fallback")
    args = ap.parse_args()

    cfg = load_sources()
    sources = cfg.get("sources", [])
    ua = cfg.get("user_agent", "MAStudyApp/1.0")
    delay = float(cfg.get("delay_seconds", 2))
    allow_cloak = cfg.get("cloak_if_blocked", True) and not args.no_cloak

    os.makedirs(RAW, exist_ok=True)
    manifest = []
    ok = 0

    for src in sources:
        url, title = src["url"], src["title"]
        name = slug(title)
        print(f"→ {title}\n  {url}")
        html = None
        try:
            html = fetch_http(url, ua)
        except Exception as e:
            print(f"  http failed: {e}")
            if allow_cloak:
                try:
                    print("  retrying with CloakBrowser…")
                    html = fetch_cloak(url, ua)
                except Exception as e2:
                    print(f"  cloak failed: {e2}")
        if html:
            out = os.path.join(RAW, name + ".html")
            with open(out, "w", encoding="utf-8") as f:
                f.write(html)
            manifest.append({
                "id": name, "title": title, "url": url,
                "category": src.get("category", "Reference"),
                "license": src.get("license", ""), "raw": os.path.relpath(out, APP),
            })
            ok += 1
            print(f"  saved {os.path.relpath(out, APP)}")
        time.sleep(delay)

    # write a manifest convert_docs.py can read
    import json
    with open(os.path.join(RAW, "_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"\nDone: {ok}/{len(sources)} fetched. Next: python3 tools/convert_docs.py")


if __name__ == "__main__":
    main()
