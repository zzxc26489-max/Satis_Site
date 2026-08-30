/* =========================================================
   Гостевой дом «Сатис» — общий скрипт сайта
   -----------------------------------------------------------
   ВСЕ КОНТАКТЫ ПРАВЯТСЯ ОДИН РАЗ ЗДЕСЬ, В ОБЪЕКТЕ CONTACTS.
   После правки этого блока номера и ссылки обновятся сразу на
   всех страницах сайта — искать что-то по HTML не нужно.
   ========================================================= */

const CONTACTS = {
  // Основной телефон — приём гостей
  phoneDisplay: "+7 903 602-34-08",
  phoneHref: "tel:+79036023408",
  phoneName: "Ирина Николаевна",

  // Второй телефон — бронирование и мероприятия
  phone2Display: "+7 999 138-13-83",
  phone2Href: "tel:+79991381383",
  phone2Name: "Дмитрий",

  // WhatsApp: только цифры, с кодом страны, без + и пробелов
  whatsappNumber: "79991381383",

  // Telegram: username без @. Пустая строка — ссылки на Telegram скроются
  telegramUsername: "",

  address: "ул. Гоголя, 7, рп Сатис, городской округ город Первомайск, Нижегородская область",

  // Ссылка на точку в Яндекс Картах (для страницы отзывов и карты)
  mapUrl: "",

  // Ссылка на профиль/объявления на Авито
  avitoUrl: "",
};

function whatsappLink(prefilledText) {
  const text = encodeURIComponent(
    prefilledText || "Здравствуйте! Хочу узнать про бронирование в гостевом доме «Сатис»."
  );
  return `https://wa.me/${CONTACTS.whatsappNumber}?text=${text}`;
}

function telegramLink(prefilledText) {
  if (!CONTACTS.telegramUsername) return "";
  const base = `https://t.me/${CONTACTS.telegramUsername}`;
  if (!prefilledText) return base;
  return `${base}?text=${encodeURIComponent(prefilledText)}`;
}

function setText(attr, value) {
  document.querySelectorAll(`[data-contact='${attr}']`).forEach((el) => {
    el.textContent = value;
  });
}

function setHref(attr, value) {
  document.querySelectorAll(`[data-contact='${attr}']`).forEach((el) => {
    el.href = value;
  });
}

/** Скрывает ссылку вместе с её пунктом списка, если адрес не задан. */
function hideLink(el) {
  const li = el.closest("li");
  (li || el).hidden = true;
}

function applyContacts() {
  setText("phone-text", CONTACTS.phoneDisplay);
  setText("phone-name", CONTACTS.phoneName);
  setHref("phone-href", CONTACTS.phoneHref);

  setText("phone2-text", CONTACTS.phone2Display);
  setText("phone2-name", CONTACTS.phone2Name);
  setHref("phone2-href", CONTACTS.phone2Href);

  setText("address-text", CONTACTS.address);

  document.querySelectorAll("[data-contact='whatsapp-href']").forEach((el) => {
    el.href = whatsappLink(el.dataset.whatsappText);
  });

  document.querySelectorAll("[data-contact='telegram-href']").forEach((el) => {
    const link = telegramLink();
    if (link) el.href = link;
    else hideLink(el);
  });

  document.querySelectorAll("[data-contact='map-href']").forEach((el) => {
    if (CONTACTS.mapUrl) el.href = CONTACTS.mapUrl;
    else hideLink(el);
  });

  document.querySelectorAll("[data-contact='avito-href']").forEach((el) => {
    if (CONTACTS.avitoUrl) el.href = CONTACTS.avitoUrl;
    else hideLink(el);
  });
}

function initNavToggle() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (!header || !toggle) return;
  toggle.addEventListener("click", () => header.classList.toggle("nav-open"));
  header.querySelectorAll(".main-nav a").forEach((a) => {
    a.addEventListener("click", () => header.classList.remove("nav-open"));
  });
}

/** Собирает текст заявки из полей формы. */
function buildRequestText(form) {
  const value = (name) => form.querySelector(`[name='${name}']`)?.value.trim() || "";
  const houseName = value("house") || form.dataset.houseName || "Гостевой дом «Сатис»";

  const lines = [`Заявка на бронирование: ${houseName}.`];
  const name = value("name");
  const dates = value("dates");
  const guests = value("guests");
  const comment = value("comment");

  if (name) lines.push(`Имя: ${name}`);
  if (dates) lines.push(`Даты: ${dates}`);
  if (guests) lines.push(`Гостей: ${guests}`);
  lines.push(`Телефон для связи: ${value("phone")}`);
  if (comment) lines.push(`Комментарий: ${comment}`);

  return lines.join("\n");
}

function initBookingForms() {
  document.querySelectorAll("form[data-booking-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = buildRequestText(form);
      const successEl = form.parentElement.querySelector(".form-success");

      if (successEl) {
        successEl.classList.add("show");
        successEl.textContent =
          "Заявка готова — открываем мессенджер. Останется нажать «отправить», и мы ответим.";
      }

      window.open(whatsappLink(message), "_blank", "noopener");
      form.reset();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyContacts();
  initNavToggle();
  initBookingForms();
});

/* =========================================================
   Загрузка фотографий
   -----------------------------------------------------------
   Порядок такой:
   1. Фото первого экрана грузится сразу и с высоким приоритетом.
   2. Всё остальное — браузерным loading="lazy": подгружается,
      когда пользователь до него доскроллил (браузер начинает
      заранее, за несколько экранов).
   3. Когда страница догрузилась и браузер простаивает, фоном
      подтягиваются фото соседних страниц — те, куда посетитель
      скорее всего пойдёт дальше. Это и есть «загрузка за
      пользователем».
   4. При наведении (или касании) на ссылку дома его галерея
      начинает грузиться до перехода — страница открывается
      уже с картинками.

   Всё фоновое отключается при экономии трафика и на медленной
   связи: там лишние мегабайты вредят, а не помогают.
   ========================================================= */

function connectionAllowsPrefetch() {
  const c = navigator.connection;
  if (!c) return true;
  if (c.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(c.effectiveType);
}

// Плавное проявление: фото становится видимым, когда загрузилось.
function initPhotoFadeIn() {
  document.querySelectorAll(".ph img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
      img.addEventListener("error", () => img.classList.add("no-fade"), { once: true });
    }
  });
}

// Тихо просим браузер положить картинку в кэш.
function warmUp(url) {
  if (warmUp.done.has(url)) return;
  warmUp.done.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}
warmUp.done = new Set();

// Фото, которые стоит подтянуть заранее с каждой страницы.
const NEXT_PAGE_PHOTOS = {
  "index.html": [
    "assets/img/foto/dom-1/dom-1-fasad-1-800.webp",
    "assets/img/foto/dom-2/dom-2-fasad-2-800.webp",
    "assets/img/foto/dom-3/dom-3-fasad-800.webp",
  ],
  "doma.html": [
    "assets/img/foto/dom-1/dom-1-kuhnya-2-3-800.webp",
    "assets/img/foto/dom-2/dom-2-kuhnya-3-3-800.webp",
    "assets/img/foto/dom-3/dom-3-zal-1-800.webp",
  ],
};

// Галерея, которую подтягиваем при наведении на ссылку дома.
const HOVER_PHOTOS = {
  "dom-1.html": "assets/img/foto/dom-1/dom-1-fasad-1-800.webp",
  "dom-2.html": "assets/img/foto/dom-2/dom-2-fasad-2-800.webp",
  "dom-cherez-dorogu.html": "assets/img/foto/dom-3/dom-3-fasad-800.webp",
  "territoriya.html": "assets/img/foto/territoriya/territoriya-besedka-1-800.webp",
};

function initPhotoPrefetch() {
  if (!connectionAllowsPrefetch()) return;

  // 1. Фоном — фото страниц, куда посетитель пойдёт дальше.
  const page = location.pathname.split("/").pop() || "index.html";
  const queue = NEXT_PAGE_PHOTOS[page] || [];
  const startBackground = () => queue.forEach(warmUp);
  if ("requestIdleCallback" in window) {
    requestIdleCallback(startBackground, { timeout: 4000 });
  } else {
    setTimeout(startBackground, 2500);
  }

  // 2. При наведении или касании ссылки — грузим её главное фото заранее.
  const hoverHandler = (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href").split("#")[0].split("/").pop();
    if (HOVER_PHOTOS[href]) warmUp(HOVER_PHOTOS[href]);
  };
  document.addEventListener("pointerover", hoverHandler, { passive: true });
  document.addEventListener("touchstart", hoverHandler, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initPhotoFadeIn();
  initPhotoPrefetch();
});

/* =========================================================
   Просмотр фото во весь экран
   -----------------------------------------------------------
   Клик по фото в галерее открывает крупную версию поверх
   страницы. Листать можно стрелками, свайпом и кнопками,
   закрыть — крестиком, клавишей Esc, свайпом вниз или щелчком
   по фону. Пока грузится крупный файл, показывается тот же
   кадр в мелком размере, поэтому окно не бывает пустым.
   ========================================================= */

function initLightbox() {
  const items = [...document.querySelectorAll(".photo-grid .ph")];
  if (!items.length) return;

  // Собираем данные один раз: крупная версия, подпись, мелкая версия
  const photos = items.map((el) => {
    const img = el.querySelector("img");
    const srcset = img.getAttribute("srcset") || "";
    const widths = [...srcset.matchAll(/(\S+)\s+(\d+)w/g)]
      .map((m) => ({ url: m[1], w: +m[2] }))
      .sort((a, b) => b.w - a.w);
    return {
      full: widths.length ? widths[0].url : img.src,
      small: img.currentSrc || img.src,
      alt: img.alt || "",
    };
  });

  items.forEach((el, i) => {
    el.classList.add("ph--zoom");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", `Открыть фото: ${photos[i].alt}`);
  });

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = `
    <div class="lightbox-stage">
      <div class="lightbox-bar">
        <span class="lightbox-count"></span>
        <button class="lightbox-btn lightbox-close" aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <button class="lightbox-btn lightbox-nav prev" aria-label="Предыдущее фото">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
      <div class="lightbox-spinner"></div>
      <button class="lightbox-btn lightbox-nav next" aria-label="Следующее фото">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
    <p class="lightbox-caption"></p>`;
  document.body.appendChild(box);

  const stage = box.querySelector(".lightbox-stage");
  const nextBtn = box.querySelector(".lightbox-nav.next");
  let bigImg = null;

  function ensureImg() {
    if (bigImg) return bigImg;
    bigImg = document.createElement("img");
    bigImg.alt = "";
    stage.insertBefore(bigImg, nextBtn);
    return bigImg;
  }
  const caption = box.querySelector(".lightbox-caption");
  const counter = box.querySelector(".lightbox-count");
  let current = 0;
  let lastFocused = null;

  function show(i) {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    ensureImg();
    box.classList.remove("is-ready");
    bigImg.classList.remove("is-loaded");
    // сперва показываем уже загруженный мелкий кадр — окно не пустует
    bigImg.src = p.small;
    bigImg.alt = p.alt;
    caption.textContent = p.alt;
    counter.textContent = `${current + 1} из ${photos.length}`;

    const full = new Image();
    full.onload = () => {
      if (photos[current] !== p) return;      // пока грузилось, уже пролистали
      bigImg.src = p.full;
      bigImg.classList.add("is-loaded");
      box.classList.add("is-ready");
    };
    full.onerror = () => { bigImg.classList.add("is-loaded"); box.classList.add("is-ready"); };
    full.src = p.full;
    bigImg.classList.add("is-loaded");

    // соседние кадры подгружаем заранее — листается без пауз
    [current + 1, current - 1].forEach((n) => {
      const nb = photos[(n + photos.length) % photos.length];
      if (nb !== p) warmUp(nb.full);
    });
  }

  function open(i) {
    lastFocused = document.activeElement;
    box.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    show(i);
    box.querySelector(".lightbox-close").focus();
  }

  function close() {
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    if (bigImg) bigImg.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((el, i) => {
    el.addEventListener("click", () => open(i));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  box.querySelector(".lightbox-close").addEventListener("click", close);
  box.querySelector(".prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".next").addEventListener("click", () => show(current + 1));

  // щелчок по фону закрывает, по самому фото — нет
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lightbox-stage")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  // свайпы: вбок — листать, вниз — закрыть
  let sx = 0, sy = 0;
  box.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    else if (dy > 90 && Math.abs(dx) < 60) close();
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", initLightbox);
