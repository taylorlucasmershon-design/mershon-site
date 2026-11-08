#!/usr/bin/env python3
"""Make web images for the site. Usage: build_images.py JOBS.json SRC_ROOT OUT_DIR
Each job: [name, ["img", path] | ["pdf", path, page] | ["spread", path, p1, p2]]
Writes OUT_DIR/full/name.jpg (max 2000px) and OUT_DIR/thumb/name.jpg (900px wide)."""
import json, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
jobs = json.load(open(sys.argv[1])); root = sys.argv[2]; out = sys.argv[3]
os.makedirs(f"{out}/full", exist_ok=True); os.makedirs(f"{out}/thumb", exist_ok=True)
def run(*a): subprocess.run(a, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=150)
def pdfpage(path, p, dst):
    run("pdftoppm", "-f", str(p), "-l", str(p), "-r", "150", "-jpeg", "-singlefile", f"{root}/{path}", dst[:-4])
def one(job):
    name, spec = job
    full, thumb = f"{out}/full/{name}.jpg", f"{out}/thumb/{name}.jpg"
    if os.path.exists(full) and os.path.exists(thumb) and os.environ.get("FORCE") != "1": return name, "skip"
    try:
        with tempfile.TemporaryDirectory() as t:
            if spec[0] == "img": s = f"{root}/{spec[1]}[0]"
            elif spec[0] == "pdf": s = f"{t}/p.jpg"; pdfpage(spec[1], spec[2], s)
            else:
                pdfpage(spec[1], spec[2], f"{t}/a.jpg"); pdfpage(spec[1], spec[3], f"{t}/b.jpg")
                s = f"{t}/s.jpg"; run("convert", f"{t}/a.jpg", f"{t}/b.jpg", "+append", s)
            run("convert", s, "-auto-orient", "-colorspace", "sRGB", "-background", "white", "-flatten",
                "-resize", "2000x2000>", "-strip", "-interlace", "Plane", "-quality", "82", full)
            run("convert", full, "-resize", "900x>", "-strip", "-quality", "78", thumb)
        return name, "ok"
    except Exception as e:
        return name, f"FAIL {e}"
with ThreadPoolExecutor(4) as ex:
    for n, r in ex.map(one, jobs):
        if r != "skip": print(r, n, flush=True)
