/* =========================================================
   Согласие на необязательные cookie
   -----------------------------------------------------------
   Сам сайт cookie не ставит и данные посетителей не собирает.
   Необязательный элемент на сайте один — карта Яндекса на
   странице «Контакты»: это сторонний фрейм, он ставит свои
   cookie. Поэтому карта не загружается, пока посетитель не
   согласился (или не нажал «Показать карту» вручную).

   Выбор хранится в localStorage — одна техническая запись,
   без неё баннер спрашивал бы при каждом открытии страницы.
   ========================================================= */
(function () {
  const KEY = "satis-cookie-consent";       // 'all' | 'necessary'
  const BANNER_ID = "cookie-banner";

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* приватный режим — просто не запомним */ }
  }

  /* Подставляет карту в место, зарезервированное разметкой. */
  function loadEmbeds() {
    document.querySelectorAll("[data-embed-src]").forEach((box) => {
      if (box.dataset.embedLoaded) return;
      box.dataset.embedLoaded = "1";
      const frame = document.createElement("iframe");
      frame.src = box.dataset.embedSrc;
      frame.title = box.dataset.embedTitle || "Карта";
      frame.loading = "lazy";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "no-referrer-when-downgrade";
      box.replaceChildren(frame);
    });
  }

  function initEmbedButtons() {
    document.querySelectorAll("[data-embed-load]").forEach((btn) => {
      btn.addEventListener("click", loadEmbeds);
    });
  }

  function hideBanner() {
    const el = document.getElementById(BANNER_ID);
    if (el) el.hidden = true;
  }

  function initBanner() {
    const el = document.getElementById(BANNER_ID);
    if (!el) return;
    const choice = read();

    if (choice === "all") { loadEmbeds(); return; }
    if (choice === "necessary") return;

    el.hidden = false;
    el.querySelector("[data-cookie-accept]").addEventListener("click", () => {
      write("all");
      hideBanner();
      loadEmbeds();
    });
    el.querySelector("[data-cookie-reject]").addEventListener("click", () => {
      write("necessary");
      hideBanner();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEmbedButtons();
    initBanner();
  }, { once: true });
})();
