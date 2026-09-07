/* Дополнительные эффекты сайта. Галереи берутся из HTML без подмены фото. */
(function () {
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

  document.addEventListener('DOMContentLoaded', initSliders, { once: true });
  document.addEventListener('DOMContentLoaded', initParallax, { once: true });
  document.addEventListener('DOMContentLoaded', initHeroBooking, { once: true });
  document.addEventListener('DOMContentLoaded', initFloatingHeader, { once: true });
  document.addEventListener('DOMContentLoaded', initReveal, { once: true });
  document.write('<script src="assets/js/main-original.js"></' + 'script>');
})();
