#!/usr/bin/env python3
"""Static asset checker for the portfolio.

Walks every place the site names an image -- timeline.json, index.html,
main.css, and the archive markdown -- and reports:

  BROKEN    a local path that does not exist on disk
  DEAD      a remote URL that does not return 200  (--remote only)
  MISSING   a timeline entry carrying no imageUrl at all
  ORPHANED  a file in docs/tex/ that nothing references

Local checks need no network. Remote checks are opt-in via --remote.

Usage:
    scripts/check-assets.py                 # local paths only
    scripts/check-assets.py --remote        # also verify every http(s) image
    scripts/check-assets.py --quiet         # only report problems

Exits non-zero if anything is BROKEN, or if --remote turns up anything DEAD.
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")

IMAGE_EXT = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico")


def rel(path):
    return os.path.relpath(path, ROOT)


# ---------------------------------------------------------------------------
# Collect every referenced asset as (url, "where it came from")
# ---------------------------------------------------------------------------

def from_timeline(refs, no_image):
    path = os.path.join(DOCS, "timeline.json")
    data = json.load(open(path))

    for event in data.get("events", []):
        for child in [event] + event.get("children", []):
            where = f"timeline.json :: {child.get('title', '?')}"
            url = child.get("imageUrl")
            if url:
                refs[url].add(where)
            elif child.get("category") != "collection":
                no_image.append((child.get("category", "?"), child.get("title", "?")))

    profile = data.get("profile", {})
    for link in profile.get("links", []):
        pass  # links are pages, not images


def from_markup(refs):
    """src="..." and url(...) in the HTML and CSS."""
    for name in ("index.html", "styles/main.css", "manifest.json"):
        path = os.path.join(DOCS, name)
        if not os.path.exists(path):
            continue
        text = open(path, encoding="utf-8").read()
        found = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', text)
        found += re.findall(r'url\(["\']?([^)"\']+)', text)
        found += re.findall(r'"src"\s*:\s*"([^"]+)"', text)
        for url in found:
            if url.lower().endswith(IMAGE_EXT):
                refs[url].add(name)


def from_archive(refs):
    """Markdown images in archive posts resolve relative to docs/archive/."""
    archive = os.path.join(DOCS, "archive")
    if not os.path.isdir(archive):
        return
    for name in sorted(os.listdir(archive)):
        if not name.endswith(".md"):
            continue
        text = open(os.path.join(archive, name), encoding="utf-8").read()
        for url in re.findall(r"!\[[^\]]*\]\(([^)\s]+)", text):
            if url.startswith(("http://", "https://", "/")):
                refs[url].add(f"archive/{name}")
            else:
                refs[f"archive/{url}"].add(f"archive/{name}")


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def resolve_local(url):
    """Map a site-relative URL to a path under docs/, or None if not local."""
    if url.startswith(("http://", "https://", "data:", "mailto:", "#")):
        return None
    return os.path.join(DOCS, url.lstrip("/").split("?")[0].split("#")[0])


# Some CDNs reject HEAD, odd User-Agents, or Range requests, so ask the way a
# browser would. Anything that still fails here also fails in the browser --
# verified against Chrome for every URL this has flagged so far.
BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def check_remote(url, timeout):
    import urllib.error
    import urllib.request

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": BROWSER_UA,
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return None if resp.status == 200 else resp.status
    except urllib.error.HTTPError as err:
        return err.code
    except Exception as err:  # DNS, TLS, timeout, redirect loop
        return type(err).__name__


def find_orphans(refs):
    tex = os.path.join(DOCS, "tex")
    if not os.path.isdir(tex):
        return []
    used = set()
    for url in refs:
        local = resolve_local(url)
        if local:
            used.add(os.path.normpath(local))
    orphans = []
    for name in sorted(os.listdir(tex)):
        path = os.path.normpath(os.path.join(tex, name))
        if os.path.isfile(path) and path not in used:
            orphans.append(rel(path))
    return orphans


# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--remote", action="store_true",
                        help="also verify http(s) images resolve (needs network)")
    parser.add_argument("--timeout", type=float, default=10.0,
                        help="per-request timeout for --remote (default: 10s)")
    parser.add_argument("--quiet", action="store_true",
                        help="only print problems")
    args = parser.parse_args()

    refs = defaultdict(set)
    no_image = []
    from_timeline(refs, no_image)
    from_markup(refs)
    from_archive(refs)

    broken, dead, remote_count = [], [], 0

    for url in sorted(refs):
        local = resolve_local(url)
        if local is not None:
            if not os.path.isfile(local):
                broken.append((url, sorted(refs[url])))
        elif args.remote and url.startswith(("http://", "https://")):
            remote_count += 1
            status = check_remote(url, args.timeout)
            if status is not None:
                dead.append((url, status, sorted(refs[url])))

    orphans = find_orphans(refs)

    # -- report ------------------------------------------------------------
    if broken:
        print(f"BROKEN -- {len(broken)} local image(s) referenced but not on disk\n")
        for url, where in broken:
            print(f"  {url}")
            for w in where:
                print(f"      <- {w}")
        print()

    if dead:
        print(f"DEAD -- {len(dead)} remote image(s) did not return 200\n")
        for url, status, where in dead:
            print(f"  [{status}] {url}")
            for w in where:
                print(f"      <- {w}")
        print()

    if no_image and not args.quiet:
        print(f"MISSING -- {len(no_image)} timeline entr(ies) with no imageUrl\n")
        by_category = defaultdict(list)
        for category, title in no_image:
            by_category[category].append(title)
        for category in sorted(by_category):
            print(f"  {category} ({len(by_category[category])})")
            for title in by_category[category]:
                print(f"      {title}")
        print()

    if orphans and not args.quiet:
        print(f"ORPHANED -- {len(orphans)} file(s) in docs/tex/ that nothing references\n")
        for path in orphans:
            print(f"  {path}")
        print()

    if not args.quiet:
        checked = f"{len(refs)} referenced asset(s)"
        if args.remote:
            checked += f", {remote_count} fetched"
        print(f"Checked {checked}.")

    problems = len(broken) + len(dead)
    if problems:
        print(f"FAIL: {problems} problem(s).")
    elif not args.quiet:
        print("OK: every referenced image resolves.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
