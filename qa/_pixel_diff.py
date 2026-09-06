from pathlib import Path

from PIL import Image, ImageChops, ImageStat

OUT = Path(__file__).resolve().parent / "screenshots"
pairs = [
    "home375",
    "home1280",
    "programs1280",
    "contact1280",
    "about1280",
    "program1280",
    "homeCream",
    "homeEn",
    "about375",
]


def compare(a_path: Path, b_path: Path):
    a = Image.open(a_path).convert("RGB")
    b = Image.open(b_path).convert("RGB")
    if a.size != b.size:
        b = b.resize(a.size)
    diff = ImageChops.difference(a, b)
    stat = ImageStat.Stat(diff)
    mean = sum(stat.mean) / 3
    # percentage of pixels with noticeable difference
    hist = diff.convert("L").histogram()
    changed = sum(hist[20:])  # ignore tiny noise
    total = a.size[0] * a.size[1]
    return mean, changed / total, a.size


def main():
    for name in pairs:
        r = OUT / f"final_react_{name}.png"
        v = OUT / f"final_vanilla_{name}.png"
        if not r.exists() or not v.exists():
            print("MISSING", name)
            continue
        mean, pct, size = compare(r, v)
        print(f"{name:16} mean={mean:6.2f} changed={pct:6.1%} size={size}")


if __name__ == "__main__":
    main()
