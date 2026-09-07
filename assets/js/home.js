/* Главная: выбор цели меняет содержание и все точки входа в заявку.
   Никакой проверки наличия: решение принимает администратор. */
(() => {
  const purposes = {
    family: {
      title: 'Отдых с семьёй',
      description: 'Баня, мангал, детская зона и зелёный двор — для нескольких дней вместе.',
      details: 'Подробнее об отдыхе и территории',
      href: 'territoriya.html',
      message: 'Здравствуйте! Хочу отдых с семьёй в «Сатисе». Подскажите свободные даты и стоимость.'
    },
    crew: {
      title: 'Размещение бригады',
      description: '36 мест, кухни, Wi-Fi, стиральные машины и парковка для рабочего транспорта.',
      details: 'Условия и цены для бригад',
      href: 'komandirovochnym.html',
      message: 'Здравствуйте! Нужно разместить бригаду в «Сатисе». Подскажите свободные места, стоимость и условия длительного проживания.'
    }
  };

  function initAudience() {
    const picker = document.querySelector('[data-audience-switch]');
    if (!picker || typeof whatsappLink !== 'function') return;
    const radios = [...picker.querySelectorAll('input[type="radio"]')];
    const select = document.querySelector('[data-audience-form]');
    const form = select?.closest('form');
    const baseHouse = form?.dataset.houseName || 'Гостевой дом «Сатис»';

    function choose(value) {
      const purpose = purposes[value] || purposes.family;
      radios.forEach(radio => { radio.checked = purposes[radio.value] === purpose; });
      if (select) select.value = value;
      if (form) form.dataset.houseName = `${baseHouse} — ${purpose.title}`;
      document.querySelector('[data-audience-description]').textContent = purpose.description;
      const details = document.querySelector('[data-audience-details]');
      details.textContent = purpose.details;
      details.href = purpose.href;
      document.querySelectorAll('[data-audience-cta]').forEach(link => {
        link.dataset.whatsappText = purpose.message;
        link.href = whatsappLink(purpose.message);
      });
      // Не меняем вручную заполненные даты, телефон или комментарий.
    }

    picker.hidden = false;
    radios.forEach(radio => radio.addEventListener('change', () => choose(radio.value)));
    select?.addEventListener('change', () => choose(select.value));
    // Общий обработчик очищает форму после открытия WhatsApp.
    // Сохраняем выбранную аудиторию, а не откатываем её к первой опции.
    form?.addEventListener('reset', () => {
      const selected = select.value;
      queueMicrotask(() => choose(selected));
    });
    choose(select?.value || 'family');
  }

  function initAccessibleMenu() {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.nav-toggle');
    if (!toggle) return;
    const sync = () => {
      const open = header.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };
    toggle.addEventListener('click', sync);
    header.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', sync));
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !header.classList.contains('nav-open')) return;
      header.classList.remove('nav-open');
      sync();
      toggle.focus();
    });
    sync();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAudience();
    initAccessibleMenu();
    const welcome = document.querySelector('.welcome');
    if (welcome && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        document.body.classList.toggle('show-mobile-contact', !entry.isIntersecting);
      }).observe(welcome);
    }
  }, { once: true });
})();
