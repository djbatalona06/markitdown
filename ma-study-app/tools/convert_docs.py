#!/usr/bin/env python3
"""
convert_docs.py — convert the raw docs fetched by fetch_docs.py into clean Markdown
using markitdown, writing them to library/*.md and building library/index.json so the
app's Library tab lists them automatically (works in the installed PWA / served app).

Usage:
    python3 tools/convert_docs.py

Dependencies:
    pip install 'markitdown[all]'     # the markitdown repo this app ships inside
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
LIB = os.path.join(APP, "library")
RAW = os.path.join(LIB, "_raw")


def main():
    manifest_path = os.path.join(RAW, "_manifest.json")
    if not os.path.exists(manifest_path):
        sys.exit("No _manifest.json found. Run tools/fetch_docs.py first.")

    try:
        from markitdown import MarkItDown  # type: ignore
    except ImportError:
        sys.exit("Please install markitdown:  pip install 'markitdown[all]'")

    md = MarkItDown()
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    docs = []
    for item in manifest:
        raw = os.path.join(APP, item["raw"])
        if not os.path.exists(raw):
            continue
        try:
            result = md.convert(raw)
            text = result.text_content.strip()
        except Exception as e:
            print(f"  convert failed for {item['id']}: {e}")
            continue

        # prepend a small header with attribution + source link
        header = (
            f"# {item['title']}\n\n"
            f"> Source: [{item['url']}]({item['url']})  \n"
            f"> {item.get('license','')}\n\n---\n\n"
        )
        out_name = item["id"] + ".md"
        with open(os.path.join(LIB, out_name), "w", encoding="utf-8") as f:
            f.write(header + text)
        docs.append({
            "id": item["id"], "title": item["title"],
            "source": item.get("category", "Reference"), "file": out_name,
            "url": item["url"], "license": item.get("license", ""),
        })
        print(f"  wrote library/{out_name}")

    with open(os.path.join(LIB, "index.json"), "w", encoding="utf-8") as f:
        json.dump({"docs": docs}, f, indent=2)
    print(f"\nDone: {len(docs)} docs. They now appear under Library → Imported documents.")


if __name__ == "__main__":
    main()
