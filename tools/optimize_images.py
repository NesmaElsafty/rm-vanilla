"""Generate WebP production variants. Originals are kept."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "images"
REPORT = Path(__file__).resolve().parents[1] / "tools" / "webp-report.json"
QUALITY = 82
HERO_QUALITY = 84

SKIP_NAMES = {"dr_rana_portrait_1782037591229.jpg"}


def save_webp(im: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    has_alpha = im.mode in {"RGBA", "LA"} or (im.mode == "P" and "transparency" in im.info)
    if has_alpha:
        converted = im.convert("RGBA")
    else:
        converted = im.convert("RGB")
    converted.save(dest, "WEBP", quality=quality, method=6)


def resize_to_width(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im
    height = round(im.height * (width / im.width))
    return im.resize((width, height), Image.Resampling.LANCZOS)


def emit(src: Path, dest: Path, width: int | None, quality: int, rows: list[dict]) -> None:
    with Image.open(src) as im:
        work = resize_to_width(im, width) if width else im
        save_webp(work, dest, quality)
    rows.append(
        {
            "src": str(src.relative_to(ROOT.parent.parent)).replace("\\", "/"),
            "src_bytes": src.stat().st_size,
            "dest": str(dest.relative_to(ROOT.parent.parent)).replace("\\", "/"),
            "dest_bytes": dest.stat().st_size,
            "width": width,
        }
    )


def main() -> None:
    rows: list[dict] = []

    emit(ROOT / "dr_rana_portrait.png", ROOT / "dr_rana_portrait.webp", None, HERO_QUALITY, rows)
    emit(ROOT / "dr_rana_portrait.png", ROOT / "dr_rana_portrait-480.webp", 480, HERO_QUALITY, rows)
    emit(ROOT / "dr_rana_portrait.png", ROOT / "dr_rana_portrait-720.webp", 680, HERO_QUALITY, rows)

    emit(ROOT / "about.png", ROOT / "about.webp", 1362, QUALITY, rows)
    emit(ROOT / "about.png", ROOT / "about-800.webp", 800, QUALITY, rows)
    emit(ROOT / "about.png", ROOT / "about-1400.webp", 1362, QUALITY, rows)

    if (ROOT / "about-hero-portrait.png").exists():
        emit(ROOT / "about-hero-portrait.png", ROOT / "about-hero-portrait.webp", 800, QUALITY, rows)

    emit(ROOT / "rana-about.jpg", ROOT / "rana-about.webp", 800, QUALITY, rows)
    emit(ROOT / "philosophy-tall.png", ROOT / "philosophy-tall.webp", None, QUALITY, rows)
    if (ROOT / "philosophy.jpg").exists():
        emit(ROOT / "philosophy.jpg", ROOT / "philosophy.webp", None, QUALITY, rows)

    emit(ROOT / "rana-logo.png", ROOT / "rana-logo.webp", 256, 86, rows)

    for folder, max_w, extra_card in (
        ("programs", 900, True),
        ("sessions", 900, True),
        ("floating", 512, True),
        ("gallery", 1000, False),
        ("testimonials", 800, False),
    ):
        base = ROOT / folder
        if not base.exists():
            continue
        for src in base.rglob("*"):
            if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
                continue
            if src.name in SKIP_NAMES:
                continue
            dest = src.with_suffix(".webp")
            emit(src, dest, max_w, QUALITY, rows)
            if extra_card:
                card = src.with_name(f"{src.stem}-304.webp")
                emit(src, card, 304, QUALITY, rows)

    REPORT.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    total_src = sum(r["src_bytes"] for r in rows)
    total_dest = sum(r["dest_bytes"] for r in rows)
    print(f"wrote {len(rows)} webp files")
    print(f"source bytes referenced: {total_src}")
    print(f"webp bytes: {total_dest}")


if __name__ == "__main__":
    main()
