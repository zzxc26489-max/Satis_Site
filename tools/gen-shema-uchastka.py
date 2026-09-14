# -*- coding: utf-8 -*-
"""Схема участка гостевого дома «Сатис».
Координаты сняты со спутникового снимка с пометками хозяев:
imgX*0.70 - 5, imgY*0.70 + 15 -> координаты SVG."""

INK   = "#1a2b23"   # хвойный графит
GOLD  = "#d4a373"   # дома
SAND  = "#efece3"   # дороги
BG    = "#f7f6f2"
GRASS = "#e9ece1"
TREE  = "#c3ccb6"
MUTED = "#5f6560"

W, H = 600, 950

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def label(x, y, text, size=14, weight=700, fill=INK, anchor="middle"):
    """Подпись с обводкой цветом фона — читается поверх любой заливки."""
    return (f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" paint-order="stroke" '
            f'stroke="{BG}" stroke-width="3.6" stroke-linejoin="round">{esc(text)}</text>')

ICONS = {
    # зонт
    "umbrella": '<path d="M-8 1a8 8 0 0 1 16 0Z"/><path d="M0 1v8"/><path d="M0 9q0 3-3 3"/>',
    # домик с лазом
    "cathouse": '<path d="M-7 1 0-6l7 7v7h-14Z"/><circle cx="0" cy="4" r="2.2"/>',
    # беседка
    "gazebo":   '<path d="M-10 0 0-6.5 10 0Z"/><path d="M0-6.5v-2.5"/>'
                '<path d="M-6.5 0v7.5M6.5 0v7.5"/><path d="M-9 7.5h18"/>',
    # костёр
    "fire":     '<path d="M0-8c4 5 6 7 4 11-1 2-3 3-4 3s-3-1-4-3c-2-4 0-6 4-11Z"/>'
                '<path d="M-8 8 8 4M-8 4 8 8"/>',
    # качели
    "bear":     '<circle cx="-5.2" cy="-5" r="3.2"/><circle cx="5.2" cy="-5" r="3.2"/>'
                '<circle cx="0" cy="1.5" r="7.2"/><circle cx="0" cy="4.2" r="2.6"/>',
}

def badge(x, y, icon, scale=0.92):
    g = [f'<circle cx="{x}" cy="{y}" r="17" fill="#fff" stroke="{INK}" stroke-width="1.8"/>']
    if icon == "parking":
        g.append(f'<text x="{x}" y="{y + 6.5}" font-size="18" font-weight="800" fill="{INK}" '
                 f'text-anchor="middle">P</text>')
    else:
        g.append(f'<g transform="translate({x} {y}) scale({scale})" fill="none" stroke="{INK}" '
                 f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
                 f'{ICONS[icon]}</g>')
    return "".join(g)

out = []
A = out.append

A(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
  f'role="img" aria-labelledby="planTitle planDesc" '
  f'font-family="Manrope, &quot;Segoe UI&quot;, system-ui, -apple-system, sans-serif">')
A('<title id="planTitle">Схема участка гостевого дома «Сатис»</title>')
A('<desc id="planDesc">Два больших дома на общей огороженной территории между улицей Красной Армии '
  'и улицей Гоголя. За домами — площадка для мероприятий с зонтами, рядом кошкин дом. '
  'У Дома №1 беседка и костровое место с лежаками, у Дома №2 своя беседка. '
  'Детская зона с качелями и песочницей у Дома №1. Парковка вдоль улицы Гоголя. '
  'Дом через дорогу стоит на своей отдельной территории за улицей Гоголя.</desc>')

A(f'<rect width="{W}" height="{H}" fill="{BG}"/>')

# ---------- дороги ----------
A(f'<rect x="0" y="6" width="{W}" height="42" fill="{SAND}"/>')
A(f'<line x1="0" y1="27" x2="{W}" y2="27" stroke="#fff" stroke-width="2" stroke-dasharray="14 12"/>')
A(label(W / 2, 32, "ул. Красной Армии", 13, 600, MUTED))

A(f'<rect x="0" y="806" width="{W}" height="42" fill="{SAND}"/>')
A(f'<line x1="0" y1="827" x2="{W}" y2="827" stroke="#fff" stroke-width="2" stroke-dasharray="14 12"/>')
A(label(W / 2, 832, "ул. Гоголя", 13, 600, MUTED))

# ---------- участок ----------
PLOT = "21,53 551,53 561,799 88,799 48,505 21,113"
A(f'<polygon points="{PLOT}" fill="{GRASS}" stroke="{INK}" stroke-width="2.4" '
  f'stroke-dasharray="9 7" stroke-linejoin="round" opacity=".92"/>')

# деревья — фон, за постройками
TREES = [(70,150),(120,110),(300,95),(360,140),(470,110),(520,160),(95,250),(430,240),
         (520,270),(80,340),(510,380),(70,430),(545,450),(120,700),(60,600),(545,560),
         (430,760),(300,760),(200,290),(330,210),(480,600),(120,780),(555,700),(350,330)]
A(f'<g fill="{TREE}">')
for tx, ty in TREES:
    A(f'<circle cx="{tx}" cy="{ty}" r="9"/>')
A('</g>')

# ---------- дома ----------
def house(x, y, w, h, name, sub, banya_y):
    s = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{GOLD}" '
         f'stroke="{INK}" stroke-width="2.4"/>']
    cx = x + w / 2
    s.append(f'<text x="{cx}" y="{y + h / 2 - 14}" font-size="20" font-weight="800" fill="{INK}" '
             f'text-anchor="middle">{esc(name)}</text>')
    s.append(f'<text x="{cx}" y="{y + h / 2 + 6}" font-size="13" font-weight="600" fill="{INK}" '
             f'text-anchor="middle" opacity=".82">{esc(sub)}</text>')
    # баня внутри дома
    s.append(f'<rect x="{x + 8}" y="{banya_y}" width="{w - 16}" height="30" rx="4" '
             f'fill="#fff" fill-opacity=".55" stroke="{INK}" stroke-width="1.6" '
             f'stroke-dasharray="5 4"/>')
    s.append(f'<text x="{cx}" y="{banya_y + 20}" font-size="13" font-weight="700" fill="{INK}" '
             f'text-anchor="middle">баня</text>')
    return "".join(s)

A(house(96, 479, 104, 189, "Дом №1", "12 кроватей", 626))
A(house(298, 428, 145, 226, "Дом №2", "24 кровати", 612))

# ---------- зоны ----------
ZONES = [
    (221, 300, "umbrella", ["Площадка для", "мероприятий"]),
    (429, 354, "cathouse", ["Кошкин дом"]),
    (152, 438, "gazebo",   ["Беседка"], -1),
    (243, 468, "fire",     ["Костёр", "и лежаки"]),
    (252, 638, "bear",    ["Детская зона"]),
    (497, 666, "gazebo",   ["Беседка"]),
    (147, 735, "parking",  ["Парковка"]),
    (364, 730, "parking",  ["Парковка"]),
]
for zone in ZONES:
    zx, zy, icon, lines = zone[:4]
    above = len(zone) > 4 and zone[4] == -1
    A(badge(zx, zy, icon))
    for i, ln in enumerate(lines):
        ly = zy - 28 - (len(lines) - 1 - i) * 17 if above else zy + 36 + i * 17
        A(label(zx, ly, ln, 14, 700))

# ---------- задняя часть участка ----------
A(label(286, 178, "Лес и место", 14, 700, MUTED))
A(label(286, 197, "для прогулок", 14, 700, MUTED))

# ---------- компас ----------
A(f'<g transform="translate(521 96)">'
  f'<circle r="19" fill="#fff" stroke="{INK}" stroke-width="1.6"/>'
  f'<path d="M0-12 4 2 0-1-4 2Z" fill="{INK}"/>'
  f'<text y="13" font-size="11" font-weight="800" fill="{INK}" text-anchor="middle">С</text></g>')

# ---------- дом через дорогу ----------
A(f'<path d="M470 799 V870" stroke="{INK}" stroke-width="2" stroke-dasharray="6 6" opacity=".5"/>')
A(f'<rect x="150" y="866" width="300" height="66" rx="14" fill="#fff" stroke="{INK}" stroke-width="2"/>')
A(f'<g transform="translate(186 899)" fill="none" stroke="{INK}" stroke-width="1.9" '
  f'stroke-linecap="round" stroke-linejoin="round">'
  f'<path d="M-10 2 0-7l10 9v9h-20Z"/><path d="M-3.5 11V5h7v6"/></g>')
A(f'<text x="212" y="895" font-size="14" font-weight="800" fill="{INK}">Дом через дорогу</text>')
A(f'<text x="212" y="914" font-size="12.5" font-weight="600" fill="{MUTED}">своя территория, помесячно</text>')

A('</svg>')

svg = "\n".join(out)
open("/home/user/Satis_Site/assets/img/shema-uchastka.svg", "w", encoding="utf-8").write(svg)
print("готово,", len(svg.encode()), "байт")
