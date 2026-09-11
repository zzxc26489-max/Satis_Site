(function () {
  const ICONS = {
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20v-8h18v8M3 16h18M5 12V7h6a3 3 0 0 1 3 3v2M14 12V9h4a3 3 0 0 1 3 3"/></svg>',
    kitchen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2v8M3 2v5a3 3 0 0 0 6 0V2M6 10v12M15 2v20M15 2c4 2 6 6 6 10h-6"/></svg>',
    bath: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3ZM5 12V6a3 3 0 0 1 6 0M8 5h3M7 20v2M17 20v2"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14 0M8.5 16a6 6 0 0 1 7 0M12 20h.01"/></svg>',
    tree: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2-4 6h2l-4 6h4v8h4v-8h4l-4-6h2l-4-6Z"/></svg>',
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 17-1-5 2-5h12l2 5-1 5H5ZM7 17v2M17 17v2M4 12h16M7 14h.01M17 14h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
    message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.9-4.7A8.5 8.5 0 1 1 21 11.5Z"/></svg>'
  };

  const PAGES = {
    'dom-1.html': {
      title: 'Дом №1',
      kicker: 'Дом для отдыха и больших компаний',
      lead: 'Пять жилых комнат, две кухни, банкетный зал и своя баня. Можно приехать семьёй, компанией или разместить рабочую бригаду.',
      price: 'от 1 500 ₽',
      priceNote: 'с человека в сутки',
      rooms: ['d1-komnata-1', 'd1-komnata-2', 'd1-komnata-3', 'd1-komnata-4', 'd1-komnata-5'],
      kitchens: ['d1-kuhnya-1', 'd1-zal'],
      bathrooms: ['d1-tualet-1', 'd1-tualet-2', 'd1-tualet-3'],
      hero: ['d1-zal', 'd1-komnata-2', 'd1-kuhnya-1'],
      floors: { 'd1-komnata-1': 1, 'd1-komnata-2': 1, 'd1-komnata-3': 2, 'd1-komnata-4': 2, 'd1-komnata-5': 2, 'd1-kuhnya-1': 1, 'd1-zal': 2, 'd1-tualet-1': 1, 'd1-tualet-2': 1, 'd1-tualet-3': 2 },
      facts: [[ICONS.users, 'до 14 гостей'], [ICONS.bed, '5 комнат'], [ICONS.kitchen, '2 кухни и зал'], [ICONS.bath, 'своя баня']],
      roomMeta: {},
      territoryImage: 'assets/img/foto/territoriya/territoriya-obshchiy-vid-1-1600.webp',
      territoryTitle: 'Общая территория и своя баня',
      territoryText: 'Дом стоит на закрытой зелёной территории. Рядом мангал, беседка, детская зона и парковка; баня — с отдельным входом.',
      territoryFacts: [[ICONS.tree, 'Тихий зелёный двор'], [ICONS.car, 'Парковка на территории'], [ICONS.bath, 'Баня с парной и душем']],
      decisionTitle: 'Подойдёт ли вам Дом №1?',
      decisionText: 'Напишите даты и количество гостей — ответим, что свободно, и подскажем подходящий вариант без предоплаты.'
    },
    'dom-2.html': {
      title: 'Дом №2',
      kicker: 'Самый вместительный дом',
      lead: 'Восемь жилых комнат, четыре кухни и изолированные части дома. Удобно для нескольких семей, большой компании или рабочей бригады.',
      price: 'от 1 500 ₽',
      priceNote: 'с человека в сутки',
      rooms: ['d2-komnata-1', 'd2-komnata-2', 'd2-komnata-3', 'd2-komnata-4', 'd2-komnata-5', 'd2-komnata-6', 'd2-komnata-7', 'd2-komnata-8'],
      kitchens: ['d2-kuhnya-1', 'd2-kuhnya-2', 'd2-kuhnya-3', 'd2-kuhnya-4'],
      bathrooms: ['d2-tualet-1', 'd2-tualet-1-otdelnyy', 'd2-tualet-2', 'd2-tualet-3', 'd2-tualet-4-otdelnyy'],
      hero: ['d2-komnata-3', 'd2-komnata-2', 'd2-kuhnya-1'],
      floors: { 'd2-komnata-1': 1, 'd2-komnata-2': 1, 'd2-komnata-3': 1, 'd2-komnata-4': 1, 'd2-komnata-5': 2, 'd2-komnata-6': 2, 'd2-komnata-7': 2, 'd2-komnata-8': 2, 'd2-kuhnya-1': 1, 'd2-kuhnya-2': 1, 'd2-kuhnya-3': 2, 'd2-kuhnya-4': 2, 'd2-tualet-1': 1, 'd2-tualet-1-otdelnyy': 1, 'd2-tualet-2': 1, 'd2-tualet-3': 2, 'd2-tualet-4-otdelnyy': 2 },
      facts: [[ICONS.users, 'до 28 гостей'], [ICONS.bed, '8 комнат'], [ICONS.kitchen, '4 кухни'], [ICONS.bath, 'своя баня']],
      roomMeta: { 'd2-komnata-5': '4 односпальные кровати + диван', 'd2-komnata-6': '5 односпальных кроватей + диван', 'd2-komnata-7': '4 односпальные кровати', 'd2-komnata-8': 'двуспальная кровать' },
      territoryImage: 'assets/img/foto/territoriya/territoriya-obshchiy-vid-1-1600.webp',
      territoryTitle: 'Территория, баня и мангал',
      territoryText: 'Дом №2 стоит на общей большой территории с Домом №1. Здесь есть баня, мангальная зона, беседка, детская площадка и место для костра.',
      territoryFacts: [[ICONS.tree, 'Закрытая зелёная территория'], [ICONS.car, 'Удобная парковка'], [ICONS.bath, 'Своя баня с отдельным входом']],
      decisionTitle: 'Свободен ли Дом №2?',
      decisionText: 'Напишите даты и сколько вас — подскажем свободные комнаты или изолированную часть дома и сразу посчитаем стоимость.'
    },
    'dom-cherez-dorogu.html': {
      title: 'Дом через дорогу',
      kicker: 'Отдельный дом для долгого проживания',
      lead: 'Три жилые комнаты, своя кухня, санузел и отдельная территория. Дом сдаётся только целиком и помесячно — до четырёх человек.',
      price: '35 000 ₽',
      priceNote: 'в месяц за дом',
      rooms: ['d3-komnata-1', 'd3-komnata-2', 'd3-komnata-3'],
      kitchens: ['d3-kuhnya', 'd3-zal'],
      bathrooms: ['d3-tualet'],
      hero: ['d3-komnata-2', 'd3-komnata-1', 'd3-kuhnya'],
      floors: { 'd3-komnata-1': 1, 'd3-komnata-2': 1, 'd3-komnata-3': 1, 'd3-kuhnya': 1, 'd3-zal': 1, 'd3-tualet': 1 },
      facts: [[ICONS.users, 'до 4 человек'], [ICONS.bed, '3 комнаты'], [ICONS.kitchen, 'своя кухня'], [ICONS.tree, 'отдельный двор']],
      roomMeta: { 'd3-komnata-1': 'двуспальная кровать', 'd3-komnata-2': 'двуспальная кровать', 'd3-komnata-3': 'односпальная кровать + диван' },
      territoryImage: 'assets/img/foto/dom-3/dom-3-fasad-1600.webp',
      territoryTitle: 'Своя территория — отдельно от больших домов',
      territoryText: 'Тихий двор, мангал и место для машин. Можно жить независимо и не пересекаться с гостями основных домов.',
      territoryFacts: [[ICONS.tree, 'Отдельный двор и мангал'], [ICONS.car, 'До 4 машин'], [ICONS.wifi, 'Wi-Fi и газовое отопление']],
      decisionTitle: 'Нужен дом на месяц?',
      decisionText: 'Напишите срок и состав жильцов — ответим по доступности дома и расскажем условия длительного проживания.'
    }
  };

  function pageName() {
    return location.pathname.split('/').pop() || '';
  }

  function cardByGallery(id) {
    return document.querySelector(`.room-card[data-gallery="${id}"]`);
  }

  function cloneImage(id, eager) {
    const source = cardByGallery(id)?.querySelector('img');
    if (!source) return null;
    const img = source.cloneNode(true);
    img.sizes = '(max-width: 760px) 68vw, (max-width: 1100px) 45vw, 620px';
    img.loading = eager ? 'eager' : 'lazy';
    if (eager) img.fetchPriority = 'high';
    return img;
  }

  function addFloor(card, floor, isRoom) {
    const body = card.querySelector('.room-body');
    if (!body) return;
    const floorLabel = document.createElement(isRoom ? 'span' : 'span');
    floorLabel.className = isRoom ? 'room-floor' : 'facility-floor';
    floorLabel.textContent = `${floor} этаж`;
    if (isRoom) body.append(floorLabel);
    else body.prepend(floorLabel);
  }

  function makeStaticKitchen() {
    const card = document.createElement('article');
    card.className = 'room-card facility-card facility-card--static';
    card.innerHTML = `
      <span class="room-thumb">
        <img src="assets/img/foto/dom-2/dom-2-kuhnya-3-1-400.webp" srcset="assets/img/foto/dom-2/dom-2-kuhnya-3-1-400.webp 400w, assets/img/foto/dom-2/dom-2-kuhnya-3-1-800.webp 800w" sizes="(max-width:760px) 46vw, 260px" alt="Кухня №3 на втором этаже" loading="lazy" decoding="async">
      </span>
      <span class="room-body">
        <span class="facility-floor">2 этаж</span>
        <span class="room-name">Кухня №3</span>
        <span class="room-meta">плита, холодильник и обеденная зона</span>
      </span>`;
    return card;
  }

  function prepareRoom(card, id, cfg) {
    card.classList.add('living-card');
    const meta = card.querySelector('.room-meta');
    if (cfg.roomMeta[id]) {
      if (meta) meta.textContent = cfg.roomMeta[id];
      else {
        const created = document.createElement('span');
        created.className = 'room-meta';
        created.textContent = cfg.roomMeta[id];
        card.querySelector('.room-body')?.append(created);
      }
    }
    addFloor(card, cfg.floors[id] || 1, true);
    const beds = document.createElement('span');
    beds.className = 'living-extra';
    beds.innerHTML = `${ICONS.bed}<span>${card.querySelector('.room-meta')?.textContent || 'спальные места'}</span>`;
    const amenities = document.createElement('span');
    amenities.className = 'living-extra living-extra--amenities';
    amenities.innerHTML = `${ICONS.wifi}<span>Wi-Fi · ТВ</span>`;
    const arrow = document.createElement('span');
    arrow.className = 'living-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    card.append(beds, amenities, arrow);
    card.querySelector('img')?.setAttribute('sizes', '(max-width:760px) 80px, 156px');
    return card;
  }

  function prepareFacility(card, id, cfg) {
    card.classList.add('facility-card');
    addFloor(card, cfg.floors[id] || 1, false);
    card.querySelector('img')?.setAttribute('sizes', '(max-width:760px) 46vw, 260px');
    return card;
  }

  function section(title, text, id, className) {
    const el = document.createElement('section');
    el.className = `house-section ${className || ''}`;
    el.id = id;
    el.innerHTML = `<div class="section-heading"><h2>${title}</h2><p>${text}</p></div>`;
    return el;
  }

  function buildHero(cfg) {
    const hero = document.createElement('section');
    hero.className = 'house-hero';
    const facts = cfg.facts.map(([icon, text]) => `<li class="house-fact">${icon}<span>${text}</span></li>`).join('');
    const message = `Здравствуйте! Хочу узнать свободные даты для ${cfg.title}.`;
    const wa = typeof whatsappLink === 'function'
      ? whatsappLink(message)
      : `https://wa.me/79991381383?text=${encodeURIComponent(message)}`;
    hero.innerHTML = `
      <div class="house-hero__copy">
        <div class="house-breadcrumbs"><a href="index.html">Главная</a><span><a href="doma.html">Дома</a></span><span>${cfg.title}</span></div>
        <p class="house-kicker">${cfg.kicker}</p>
        <h1>${cfg.title}</h1>
        <p class="house-lead">${cfg.lead}</p>
        <ul class="house-facts">${facts}</ul>
        <p class="house-price"><strong>${cfg.price}</strong> <span>${cfg.priceNote}</span></p>
        <a class="btn btn-green" href="${wa}" target="_blank" rel="noopener">Узнать свободные даты&nbsp; →</a>
        <p class="house-response">Ответим в WhatsApp или по телефону</p>
      </div>
      <div class="house-gallery" aria-label="Фотографии ${cfg.title}"></div>`;
    const gallery = hero.querySelector('.house-gallery');
    cfg.hero.forEach((id, index) => {
      const img = cloneImage(id, index === 0);
      if (!img) return;
      const item = document.createElement('div');
      item.className = 'house-gallery__item';
      const label = cardByGallery(id)?.querySelector('.room-name')?.textContent || 'Фото дома';
      item.append(img);
      item.insertAdjacentHTML('beforeend', `<span class="house-gallery__label">${label}</span>`);
      gallery.append(item);
    });
    return hero;
  }

  function buildTerritory(cfg) {
    const block = document.createElement('section');
    block.className = 'house-section territory-panel';
    block.id = 'territory';
    block.innerHTML = `
      <div class="territory-photo"><img src="${cfg.territoryImage}" alt="Территория ${cfg.title}" loading="lazy" decoding="async"></div>
      <div class="territory-copy">
        <p class="house-kicker">На территории</p>
        <h2>${cfg.territoryTitle}</h2>
        <p>${cfg.territoryText}</p>
        <ul class="territory-facts">${cfg.territoryFacts.map(([icon, text]) => `<li>${icon}<span>${text}</span></li>`).join('')}</ul>
        <a class="more" href="territoriya.html">Посмотреть территорию&nbsp; →</a>
      </div>`;
    return block;
  }

  function buildDecision(cfg) {
    const block = document.createElement('section');
    block.className = 'house-decision';
    block.id = 'decision';
    const message = `Здравствуйте! Интересует ${cfg.title}. Хочу узнать свободные даты и стоимость.`;
    const wa = typeof whatsappLink === 'function'
      ? whatsappLink(message)
      : `https://wa.me/79991381383?text=${encodeURIComponent(message)}`;
    block.innerHTML = `
      <div><p class="house-kicker">Ответим в тот же день</p><h2>${cfg.decisionTitle}</h2><p>${cfg.decisionText}</p></div>
      <div class="decision-actions">
        <a class="decision-action decision-action--primary" href="${wa}" target="_blank" rel="noopener">${ICONS.message}<span>Написать в WhatsApp</span></a>
        <a class="decision-action" href="tel:+79036023408">${ICONS.phone}<span>Позвонить</span></a>
      </div>`;
    return block;
  }

  function buildPage(cfg) {
    const container = document.querySelector('main > .container');
    const intro = container?.querySelector('.page-intro');
    if (!container || !intro) return;

    const root = document.createElement('div');
    root.className = 'house-premium';
    root.append(buildHero(cfg));

    const rooms = section('Комнаты для проживания', 'Сначала выберите, где будете жить. У каждой комнаты указан этаж и количество спальных мест.', 'rooms', 'rooms-section');
    const livingList = document.createElement('div');
    livingList.className = 'living-list';
    cfg.rooms.forEach((id) => {
      const card = cardByGallery(id);
      if (card) livingList.append(prepareRoom(card, id, cfg));
    });
    rooms.append(livingList);
    root.append(rooms);

    const kitchens = section('Кухни и общие пространства', 'Это общие удобства дома, их не нужно выбирать отдельно. Этаж указан в каждой карточке.', 'kitchens', 'facilities-section');
    const kitchenGrid = document.createElement('div');
    kitchenGrid.className = 'facility-grid';
    cfg.kitchens.forEach((id) => {
      if (id === 'd2-kuhnya-3') kitchenGrid.append(makeStaticKitchen());
      else {
        const card = cardByGallery(id);
        if (card) kitchenGrid.append(prepareFacility(card, id, cfg));
      }
    });
    kitchens.append(kitchenGrid);
    root.append(kitchens);

    const bathrooms = section('Санузлы и душевые', 'Все санузлы относятся к дому или его изолированной части — на карточках видно, где именно они находятся.', 'bathrooms', 'facilities-section');
    const bathroomGrid = document.createElement('div');
    bathroomGrid.className = 'facility-grid';
    cfg.bathrooms.forEach((id) => {
      const card = cardByGallery(id);
      if (card) bathroomGrid.append(prepareFacility(card, id, cfg));
    });
    bathrooms.append(bathroomGrid);
    root.append(bathrooms, buildTerritory(cfg), buildDecision(cfg));

    container.insertBefore(root, intro);
    container.querySelectorAll('.photo-block').forEach((el) => el.remove());
    const legacy = container.querySelector('.house-layout');
    if (legacy) legacy.hidden = true;

    const headerCta = document.querySelector('.header-actions .btn');
    if (headerCta) {
      headerCta.textContent = 'Узнать даты';
      headerCta.href = '#decision';
    }

    const mobileWhatsapp = document.querySelector('.mobile-cta [data-contact="whatsapp-href"]');
    if (mobileWhatsapp) {
      const message = `Здравствуйте! Интересует ${cfg.title}. Хочу узнать свободные даты и стоимость.`;
      mobileWhatsapp.href = typeof whatsappLink === 'function'
        ? whatsappLink(message)
        : `https://wa.me/79991381383?text=${encodeURIComponent(message)}`;
    }

    const navToggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('.site-header');
    if (navToggle && header) {
      navToggle.addEventListener('click', () => {
        navToggle.setAttribute('aria-label', header.classList.contains('nav-open') ? 'Закрыть меню' : 'Открыть меню');
      });
    }

    if (location.hash && document.querySelector(location.hash)) {
      requestAnimationFrame(() => document.querySelector(location.hash).scrollIntoView());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const cfg = PAGES[pageName()];
    if (cfg) buildPage(cfg);
  }, { once: true });
})();
