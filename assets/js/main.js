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

  document.addEventListener('DOMContentLoaded', patchRoom5, { once: true });
  document.addEventListener('DOMContentLoaded', initFloatingHeader, { once: true });
  document.addEventListener('DOMContentLoaded', initReveal, { once: true });
  document.write('<script src="assets/js/main-original.js"></' + 'script>');
})();
