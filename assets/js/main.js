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

  /* Главная: шапка лежит поверх первого экрана и белеет, когда он уехал вверх. */
  function initFloatingHeader() {
    if (!document.body.classList.contains('home')) return;
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero-home');
    if (!header || !hero) return;

    document.body.classList.add('floating-header');

    let headerH = 0;
    let switchAt = 0;

    function measure() {
      headerH = header.offsetHeight;
      switchAt = Math.max(hero.offsetHeight - headerH, 0);
      document.documentElement.style.setProperty('--header-h', headerH + 'px');
    }

    function update() {
      header.classList.toggle('is-solid', window.scrollY > switchAt);
    }

    measure();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { measure(); update(); });
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

  /* Быстрая форма в первом экране переносит даты и число гостей
     в основную заявку и подводит к ней — без второй точки отправки. */
  function initHeroBooking() {
    const form = document.querySelector('[data-hero-book]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const target = document.querySelector('form[data-booking-form]');
      const dates = form.querySelector('[name="dates"]');
      const guests = form.querySelector('[name="guests"]');
      if (target) {
        const targetDates = target.querySelector('[name="dates"]');
        const targetGuests = target.querySelector('[name="guests"]');
        if (targetDates && dates.value) targetDates.value = dates.value;
        if (targetGuests && guests.value) targetGuests.value = guests.value;
      }
      const section = document.getElementById('zayavka');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const phone = document.getElementById('h-phone');
      if (phone) setTimeout(() => phone.focus({ preventScroll: true }), 600);
    });
  }

  document.addEventListener('DOMContentLoaded', patchRoom5, { once: true });
  document.addEventListener('DOMContentLoaded', initSliders, { once: true });
  document.addEventListener('DOMContentLoaded', initParallax, { once: true });
  document.addEventListener('DOMContentLoaded', initHeroBooking, { once: true });
  document.addEventListener('DOMContentLoaded', initFloatingHeader, { once: true });
  document.addEventListener('DOMContentLoaded', initReveal, { once: true });
  document.write('<script src="assets/js/main-original.js"></' + 'script>');
})();
