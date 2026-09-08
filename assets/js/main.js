/* Wrapper: preserves the original site script and upgrades Dom #2 / room 5 gallery. */
(function () {
  function patchRoom5() {
    const card = document.querySelector('.room-card[data-gallery="d2-komnata-5"]');
    const gallery = document.getElementById('d2-komnata-5');
    if (!card || !gallery) return;

    card.innerHTML = `
      <span class="room-thumb">
        <img src="assets/img/foto/dom-2/dom-2-komnata-5-1.webp" width="320" height="240" alt="Комната 5 — 4 односпальные кровати и диван" loading="lazy" decoding="async">
        <span class="room-count">4 фото</span>
      </span>
      <span class="room-body">
        <span class="room-name">Комната 5</span>
        <span class="room-meta">4 односпальные кровати + диван</span>
      </span>`;

    gallery.innerHTML = `
      <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-1.webp" width="320" height="240" alt="Дом №2 — комната №5, общий вид" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-2.webp" width="320" height="427" alt="Дом №2 — комната №5, кровати, диван и телевизор" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-3.webp" width="320" height="427" alt="Дом №2 — комната №5, спальные места" loading="lazy" decoding="async"></div>
      <div class="ph"><img src="assets/img/foto/dom-2/dom-2-komnata-5-4.webp" width="320" height="427" alt="Дом №2 — комната №5, стол у окна" loading="lazy" decoding="async"></div>`;
  }

  /* Плавное появление блоков. Класс на body ставится только здесь,
     поэтому без JS страница видна целиком и ничего не прячется. */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('reveal-on');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '240px 0px 0px 0px', threshold: 0 });

    items.forEach((el) => io.observe(el));
  }

  /* Микро-слайдер фото в карточках домов.
     Листание — обычная горизонтальная прокрутка с примагничиванием,
     скрипт только рисует точки и подсвечивает активную. */
  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach((slider) => {
      const track = slider.querySelector('.slider__track');
      const dotsBox = slider.querySelector('[data-slider-dots]');
      if (!track || !dotsBox) return;
      const slides = [...track.children];
      if (slides.length < 2) return;

      const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Фото ${i + 1} из ${slides.length}`);
        dot.addEventListener('click', () => {
          track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
        });
        dotsBox.append(dot);
        return dot;
      });

      let frame;
      track.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const current = Math.round(track.scrollLeft / track.clientWidth);
          dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
        });
      }, { passive: true });
    });
  }

  /* Параллакс фотополос: кадр смещается медленнее страницы.
     Считаем в requestAnimationFrame и двигаем только transform,
     поэтому браузер не пересчитывает раскладку — кадры не проседают. */
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layers = [...document.querySelectorAll('[data-parallax]')];
    if (!layers.length) return;

    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      layers.forEach((layer) => {
        const box = layer.parentElement.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        const progress = (box.top + box.height / 2 - vh / 2) / vh;
        const shift = Math.max(-48, Math.min(48, progress * 48));
        layer.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.12)`;
      });
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* Переключатель «Отдых с семьёй / Размещение бригад» в первом экране.
     Это не декорация: у каждого сегмента своя цель у кнопки (форма на
     этой же странице для отдыха, отдельная страница с условиями для
     бригад) и свой текст сообщения в WhatsApp. */
  const HERO_SEGMENTS = {
    stay: {
      href: '#zayavka',
      label: 'Узнать свободные даты',
      wa: 'Здравствуйте! Хочу узнать про свободные даты для отдыха с семьёй в гостевом доме «Сатис».',
    },
    brigade: {
      href: 'komandirovochnym.html',
      label: 'Условия для бригад',
      wa: 'Здравствуйте! Интересует размещение бригады в гостевом доме «Сатис».',
    },
  };

  function initHeroSegment() {
    const group = document.querySelector('[data-hero-segment]');
    const cta = document.querySelector('[data-hero-cta]');
    if (!group || !cta) return;
    const label = cta.querySelector('[data-hero-cta-label]');
    const waLink = document.querySelector('[data-hero-wa]');

    function apply(segment) {
      const cfg = HERO_SEGMENTS[segment] || HERO_SEGMENTS.stay;
      group.classList.toggle('is-brigade', segment === 'brigade');
      group.classList.toggle('is-stay', segment !== 'brigade');
      group.querySelectorAll('.hero-segment__btn').forEach((btn) => {
        const active = btn.dataset.segment === segment;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      cta.href = cfg.href;
      if (label) label.textContent = cfg.label;
      if (waLink) {
        waLink.dataset.whatsappText = cfg.wa;
        // whatsappLink() определена в main-original.js: этот файл уже
        // подключён к моменту DOMContentLoaded (см. document.write ниже).
        if (typeof whatsappLink === 'function') waLink.href = whatsappLink(cfg.wa);
      }
    }

    group.querySelectorAll('.hero-segment__btn').forEach((btn) => {
      btn.addEventListener('click', () => apply(btn.dataset.segment));
    });
    // Без этого вызова текст WhatsApp для сегмента «Отдых» подставлялся бы
    // только после клика — до него ссылка использовала общий текст-заглушку.
    apply('stay');
  }

  document.addEventListener('DOMContentLoaded', patchRoom5, { once: true });
  document.addEventListener('DOMContentLoaded', initSliders, { once: true });
  document.addEventListener('DOMContentLoaded', initParallax, { once: true });
  document.addEventListener('DOMContentLoaded', initHeroSegment, { once: true });
  document.addEventListener('DOMContentLoaded', initReveal, { once: true });
  document.write('<script src="assets/js/main-original.js"></' + 'script>');
})();
