#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Добавляет фотографии комнаты на сайт: переводит в WebP, обновляет
манифест и перерисовывает карточку комнаты с её скрытой галереей.

Зачем: раньше это делалось руками и каждый раз одинаково — конвертация в
три размера, средний цвет для заглушки, запись в photos.json, правка
разметки. Скрипт делает всё разом и не даёт разъехаться данным.

Пример:

    python3 tools/room-photos.py dom-1.html d1-komnata-3 \
        --group dom-1 --prefix dom-1-komnata-3 \
        --title "Комната 3" --meta "4 односпальные кровати" \
        --photo /путь/кадр1.jpg "Дом №1, комната №3 — общий вид" \
        --photo /путь/кадр2.jpg "Дом №1, комната №3 — окно и стол" \
        --crop 0.22,0,1,1

Порядок кадров = порядок в галерее, первый становится обложкой.
--crop применяется ко ВСЕМ кадрам вызова (доли от ширины и высоты:
left,top,right,bottom) — обычно нужен одному кадру, тогда запускайте
скрипт отдельно для него.
"""
import argparse, html, json, os, re, sys
from PIL import Image, ImageOps

SIZES = [400, 800, 1600]
QUALITY = 80
CARD_SIZES = ('sizes="(max-width: 560px) 92vw, (max-width: 980px) 45vw, '
              '(max-width: 1200px) 30vw, 250px"')
FULL_SIZES = ('sizes="(max-width: 430px) 92vw, (max-width: 760px) 45vw, '
              '(max-width: 1200px) 30vw, 370px"')
MANIFEST = "assets/data/photos.json"


def avg_color(im):
    r, g, b = im.convert("RGB").resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    return "#%02x%02x%02x" % (r, g, b)


def convert(src, out_dir, name, crop=None):
    """Кадр -> три WebP. Разворачиваем по EXIF, иначе телефонные снимки
    лежат на боку."""
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if crop:
        W, H = im.size
        im = im.crop((int(W * crop[0]), int(H * crop[1]),
                      int(W * crop[2]), int(H * crop[3])))
    w, h = im.size
    for s in SIZES:
        c = im.copy()
        c.thumbnail((s, s), Image.LANCZOS)
        c.save(f"{out_dir}/{name}-{s}.webp", "WEBP", quality=QUALITY, method=6)
    return w, h, avg_color(im)


def srcset(group, key, sizes):
    base = f"assets/img/foto/{group}/{key}"
    return ", ".join(f"{base}-{s}.webp {s}w" for s in sizes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page")
    ap.add_argument("gallery_id", help="например d1-komnata-3")
    ap.add_argument("--group", required=True, help="папка: dom-1, dom-2, dom-3, banya-1…")
    ap.add_argument("--prefix", required=True, help="имя файлов без номера")
    ap.add_argument("--title", required=True)
    ap.add_argument("--meta", default="")
    ap.add_argument("--photo", nargs=2, action="append", metavar=("ФАЙЛ", "ПОДПИСЬ"), required=True)
    ap.add_argument("--crop", help="left,top,right,bottom в долях")
    args = ap.parse_args()

    crop = tuple(float(x) for x in args.crop.split(",")) if args.crop else None
    out_dir = f"assets/img/foto/{args.group}"
    os.makedirs(out_dir, exist_ok=True)
    man = json.load(open(MANIFEST, encoding="utf-8"))

    # старые кадры этой комнаты убираем — и файлы, и записи
    old = [k for k in man if re.fullmatch(rf"{args.group}/{re.escape(args.prefix)}(-\d+)?", k)]
    for k in old:
        for s in man[k]["sizes"]:
            f = f"assets/img/foto/{k.split('/')[1]}"
            f = f"{out_dir}/{k.split('/')[1]}-{s}.webp"
            if os.path.exists(f):
                os.remove(f)
        del man[k]

    keys = []
    for i, (src, alt) in enumerate(args.photo, 1):
        name = f"{args.prefix}-{i}"
        w, h, color = convert(src, out_dir, name, crop)
        man[f"{args.group}/{name}"] = {
            "alt": alt, "w": w, "h": h, "color": color,
            "sizes": SIZES, "group": args.group, "ratio": round(w / h, 4),
        }
        keys.append(name)
        print(f"  {name}: {w}x{h}")

    json.dump(man, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    text = open(args.page, encoding="utf-8").read()

    # обложка карточки
    cover = man[f"{args.group}/{keys[0]}"]
    base = f"assets/img/foto/{args.group}/{keys[0]}"
    alt = f"{args.title} — {args.meta}" if args.meta else args.title
    card_img = (f'<img src="{base}-400.webp" srcset="{srcset(args.group, keys[0], SIZES)}" '
                f'{CARD_SIZES} width="{cover["w"]}" height="{cover["h"]}" '
                f'alt="{html.escape(alt)}" loading="lazy" decoding="async">')
    pat = re.compile(rf'(data-gallery="{re.escape(args.gallery_id)}">\s*<span class="room-thumb">\s*)'
                     r'<img [^>]*>(\s*<span class="room-count">)\d+ фото', re.S)
    if not pat.search(text):
        sys.exit(f"не нашёл карточку {args.gallery_id} в {args.page}")
    text = pat.sub(lambda m: m.group(1) + card_img + m.group(2) + f"{len(keys)} фото", text)

    # скрытая галерея
    rows = []
    for k in keys:
        m = man[f"{args.group}/{k}"]
        b = f"assets/img/foto/{args.group}/{k}"
        rows.append(f'        <div class="ph"><img src="{b}-800.webp" '
                    f'srcset="{srcset(args.group, k, SIZES)}" {FULL_SIZES} '
                    f'width="{m["w"]}" height="{m["h"]}" alt="{html.escape(m["alt"])}" '
                    f'loading="lazy" decoding="async"></div>')
    start_tag = f'      <div class="room-photos" id="{args.gallery_id}" hidden>'
    start = text.index(start_tag)
    end = text.index("      </div>", start) + len("      </div>")
    text = text[:start] + start_tag + "\n" + "\n".join(rows) + "\n      </div>" + text[end:]

    open(args.page, "w", encoding="utf-8").write(text)
    print(f"{args.page}: карточка {args.gallery_id} — {len(keys)} фото")


if __name__ == "__main__":
    main()
