const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('room 5 uses the responsive source rather than 320px script replacements', () => {
  const room = fs.readFileSync(path.join(root, 'dom-2.html'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
  assert.match(room, /dom-2-komnata-5-1-1600.webp/);
  assert.doesNotMatch(script, /patchRoom5|dom-2-komnata-5-[1-4]\.webp/);
});

test('homepage local links and image candidates resolve, without AI imagery', () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    refs.push(...m[1].split(',').map(s => s.trim().split(/\s+/)[0]));
  }
  for (const ref of refs) {
    if (/^(?:[a-z]+:|#)/i.test(ref)) continue;
    assert.ok(fs.existsSync(path.join(root, ref.split('#')[0])), `Missing asset: ${ref}`);
  }
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    assert.ok(m[1].startsWith('assets/img/foto/'), `Not a source photograph: ${m[1]}`);
  }
});

test('the hero offers an inquiry and preserves business trust below accommodation', () => {
  const hero = html.slice(html.indexOf('<section class="welcome"'), html.indexOf('<!-- ---------- Форматы'));
  assert.doesNotMatch(hero, /type="(?:date|number)"|Проверить даты|data-hero-book/);
  assert.match(hero, /Три дома/);
  assert.match(hero, /Узнать свободные даты/);
  for (const text of ['Договор на месте', 'Оплата от организации', 'Отвечаем в тот же день']) {
    assert.ok(html.indexOf(text) > html.indexOf('Выберите формат проживания'));
  }
});

test('request text preserves purpose, guest details and comments, encoded for WhatsApp', () => {
  const context = vm.createContext({ document: { addEventListener() {} } });
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/main-original.js'), 'utf8'), context);
  for (const purpose of ['Отдых с семьёй', 'Размещение бригады']) {
    const values = { phone: '+7 000 000-00-00', dates: '12–15 сентября', guests: '8', comment: 'Баня & кухня' };
    const form = {
      dataset: { houseName: `Гостевой дом «Сатис» — ${purpose}` },
      querySelector(selector) { return { value: values[selector.match(/name='([^']+)'/)[1]] || '' }; }
    };
    context.form = form;
    const message = vm.runInContext('buildRequestText(form)', context);
    assert.match(message, new RegExp(purpose));
    assert.match(message, /Гостей: 8/);
    assert.match(message, /Баня & кухня/);
    context.message = message;
    const link = new URL(vm.runInContext('whatsappLink(message)', context));
    assert.equal(link.hostname, 'wa.me');
    assert.equal(link.searchParams.get('text'), message);
    assert.equal([...link.searchParams].length, 1);
  }
});
