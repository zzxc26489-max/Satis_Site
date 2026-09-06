from pathlib import Path
import re

p = Path("dom-2.html")
text = p.read_text(encoding="utf-8")

card_re = re.compile(r'          <button class="room-card" type="button" data-gallery="d2-komnata-5">.*?          </button>', re.S)
card = '''          <button class="room-card" type="button" data-gallery="d2-komnata-5">
            <span class="room-thumb">
              <img src="assets/img/foto/dom-2/dom-2-komnata-5-1.webp" width="320" height="240" alt="Комната 5 — 4 односпальные кровати и диван" loading="lazy" decoding="async">
              <span class="room-count">4 фото</span>
            </span>
            <span class="room-body">
              <span class="room-name">Комната 5</span>
              <span class="room-meta">4 односпальные кровати + диван</span>
            </span>
          </button>'''
text, n = card_re.subn(card, text, count=1)
if n != 1:
    raise SystemExit(f"room card replacement count: {n}")

start_marker = '        <div class="room-photos" id="d2-komnata-5" hidden>'
next_marker = '        <div class="room-photos" id="d2-komnata-6" hidden>'
s = text.index(start_marker)
e = text.index(next_marker, s)
gallery = '''        <div class="room-photos" id="d2-komnata-5" hidden>
          <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-1.webp" width="320" height="240" alt="Дом №2 — комната №5, общий вид" loading="lazy" decoding="async"></div>
          <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-2.webp" width="320" height="427" alt="Дом №2 — комната №5, кровати, диван и телевизор" loading="lazy" decoding="async"></div>
          <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-3.webp" width="320" height="427" alt="Дом №2 — комната №5, спальные места" loading="lazy" decoding="async"></div>
          <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-4.webp" width="320" height="427" alt="Дом №2 — комната №5, стол у окна" loading="lazy" decoding="async"></div>
        </div>
'''
text = text[:s] + gallery + text[e:]
p.write_text(text, encoding="utf-8")

f = Path("FOTO-SPISOK.md")
if f.exists():
    t = f.read_text(encoding="utf-8")
    t = t.replace("- Комната 5 (4 односпальные + диван) — 1 фото, нужно ещё 1–2", "- Комната 5 (4 односпальные + диван) — снято, 4 разных кадра", 1)
    f.write_text(t, encoding="utf-8")
