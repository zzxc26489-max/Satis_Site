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

  document.addEventListener('DOMContentLoaded', patchRoom5, { once: true });
  document.write('<script src="assets/js/main-original.js"></' + 'script>');
})();
