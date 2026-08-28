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
