# Промты для генерации картинок и иконок

Общая палитра сайта (передавать в каждом промте):
`#F7F6F2` тёплый off-white фон · `#1A2B23` хвойный графит · `#D4A373` тёплое золото ·
`#E9D8A6` светлое золото · `#8C6239` тёмное золото · `#E6E2D8` линии/границы.

Общие правила: **без текста и без букв** (модели портят кириллицу — подписи
добавим в коде), плоская графика без градиентных «пластиковых» бликов,
без фотореализма там, где просят вектор.

---

## 1. Логотип-иконка (favicon, иконка на домашний экран)

**Нужно:** PNG 1024×1024, квадрат, поле по краям ~12 %.

> Flat vector emblem for a countryside guest house. A simple geometric house
> silhouette with a steep gable roof, standing between two stylised pine
> trees, enclosed in a soft rounded square. Extremely minimal: 4–6 shapes
> total, thick even strokes, no small details, no windows smaller than 1/8 of
> the house. Warm gold `#D4A373` house, deep pine-green `#1A2B23` trees and
> outline, warm off-white `#F7F6F2` background. Absolutely no text, no
> letters, no numbers. Centered, symmetrical, generous padding. Flat design,
> clean edges, readable at 32×32 pixels. Square 1:1.

Проверка: уменьшить до 32×32 — дом и ёлки должны читаться. Если в кашу —
просить «even more simplified, only 3 shapes».

**Вариант с монограммой** (если хочется буквы «С»):

> Flat vector monogram emblem: a single Cyrillic letter "С" formed by the
> curve of a stylised roofline, deep pine-green `#1A2B23` on warm off-white
> `#F7F6F2`, one gold `#D4A373` accent dot. Geometric, thick strokes, minimal,
> square 1:1, no other letters or text.

---

## 2. Превью ссылки для страницы бригад (og:image)

**Нужно:** 1200×630, JPG. Уходит в WhatsApp, когда кидают ссылку
`komandirovochnym.html`.

> Interior photograph of a large shared kitchen-dining room in a Russian
> countryside guest house, prepared for a long-staying work crew. A long
> wooden table with benches, several chairs, a plain kitchen counter with a
> kettle and an electric stove, a washing machine visible at the side.
> Simple, clean, honest — not a luxury interior, not a hotel: lived-in,
> practical, well-kept. Warm daylight from a large window on the left, soft
> shadows, neutral white balance. Muted warm palette: off-white walls,
> natural wood, deep green accents. Wide horizontal composition with empty
> space in the left third for a caption overlay. Realistic documentary
> photography, 35 mm, f/4, eye level, no people, no text, no logos,
> no fisheye distortion. Aspect ratio 1.91:1.

⚠️ Честно: **лучше реальное фото вашей кухни** в Доме №2, кадрированное
1200×630. Сгенерированная кухня — это не ваш дом, а бригадир, который приедет,
увидит другое. Генерацию имеет смысл брать, только если подходящего кадра нет.

---

## 3. Схема участка

**Нужно:** вид сверху — Дом №1, Дом №2, баня при каждом, беседка,
мангальная зона, зона костра, детская зона (качели, песочница), парковка
на 3–4 машины, ворота, дорога, за дорогой — Дом через дорогу со своей
территорией.

> Top-down isometric illustration of a small countryside guest house
> property, architectural site plan style. Two large wooden houses with
> gabled roofs standing side by side inside a fenced yard, a gazebo with a
> long table, a barbecue area, a round fire pit, a children's area with a
> swing set and a sandbox, a parking area with three cars, a gate in the
> fence, pine and birch trees scattered around, mown grass. A road crosses
> the bottom of the frame; on the far side of the road a smaller single
> house with its own fenced plot. Flat vector illustration, clean geometric
> shapes, no outlines thinner than 2 px, soft long shadows. Strictly limited
> palette: warm off-white `#F7F6F2` background, deep pine-green `#1A2B23`
> roofs and trees, warm gold `#D4A373` wooden walls and paths, light gold
> `#E9D8A6` grass highlights. No text, no labels, no numbers, no people.
> Even top-down lighting, 30° isometric. Aspect ratio 4:3.

⚠️ Честно: генератор нарисует **красивый, но неправильный** участок — он не
знает, где у вас что стоит. Мой вариант: **нарисую схему кодом (SVG)** по
вашему описанию — тогда дома, баня и парковка будут стоять там, где стоят,
подписи будут нормальной кириллицей, файл весит 8 КБ и масштабируется без
пикселей. Мне нужно от вас: набросок от руки на листке (фото) или
скриншот участка со спутника в Яндекс Картах.

---

## 4. Планировки домов

**Нужно:** по одной схеме на Дом №1 (5 комнат, 2 этажа), Дом №2 (8 комнат),
Дом через дорогу (3 комнаты).

> Clean architectural floor plan of a two-storey wooden guest house, top-down
> orthographic view. Thick walls as solid dark `#1A2B23` lines on warm
> off-white `#F7F6F2` background, rooms filled with light gold `#E9D8A6`,
> simple furniture symbols: beds, a dining table, a kitchen counter, a
> shower, a toilet. Doors shown as quarter-circle arcs, windows as double
> lines in the walls. Flat, technical, minimal, no shadows, no perspective,
> no gradients, no dimensions, no text, no room labels, no numbers.
> Aspect ratio 4:3.

⚠️ То же самое: планировку модель выдумает. **Тоже сделаю кодом**, если
пришлёте, какая комната с какой граничит и сколько в ней кроватей — хватит
списка вроде «1 этаж: кухня — зал — комната 1 (2 кровати) — душевая».

---

## Что сгенерировать реально стоит

| Картинка | Генерировать | Почему |
|---|---|---|
| Логотип-иконка | **да** | абстрактная форма, точность не нужна |
| og-превью для бригад | только если нет фото | иначе гость увидит чужой интерьер |
| Схема участка | **нет** — SVG кодом | должна совпадать с реальностью |
| Планировки | **нет** — SVG кодом | то же |

## Куда класть готовое

```
assets/img/logo-512.png       иконка (и 192, 512 для домашнего экрана)
assets/img/og-brigady.jpg     превью 1200×630
assets/img/shema-uchastka.svg схема участка
assets/img/plan-dom-1.svg     планировки
```

Пришлите файлы или ссылки — подключу, пропишу размеры, alt и теги.
