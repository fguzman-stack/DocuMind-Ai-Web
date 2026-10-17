// Offline regression tests. All redemption responses and buyer data are fake.
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');

const root = join(__dirname, '..');
const html = readFileSync(join(root, 'activate-4txntb.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const index = readFileSync(join(root, 'index.html'), 'utf8');
const appScript = readFileSync(join(root, 'js/app.js'), 'utf8');
const locales = ['es', 'en', 'pt', 'fr', 'de'];

function dictionary(source) {
  const literal = source.match(/var I18N = ([\s\S]*?);\s*var SUPPORTED/)[1];
  return vm.runInNewContext('(' + literal + ')');
}

function element() {
  return {
    value: '', textContent: '', disabled: false, hidden: false, listeners: {}, attributes: {},
    classList: { add() {}, remove() {} },
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    focus() {},
  };
}

function page({ language = 'es', blockedStorage = false, response = { ok: true }, httpOk = true, fetchImpl } = {}) {
  const nodes = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m => [m[1], element()]));
  nodes.viewSuccess.hidden = true;
  nodes.errorMsg.hidden = true;
  const errorSpan = element();
  nodes.errorMsg.querySelector = () => errorSpan;
  const translated = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => {
    const node = element(); node.attributes['data-i18n'] = m[1]; return node;
  });
  const calls = [], writes = [];
  const prefs = new Map();
  vm.runInNewContext(script, {
    document: {
      documentElement: element(),
      getElementById: id => { assert.ok(nodes[id], id); return nodes[id]; },
      querySelectorAll: () => translated,
    },
    navigator: { language },
    window: { matchMedia: () => ({ matches: false }), scrollTo() {} },
    localStorage: {
      getItem(key) { if (blockedStorage) throw Error('storage denied'); return prefs.get(key) ?? null; },
      setItem(key, value) { if (blockedStorage) throw Error('storage denied'); writes.push([key, value]); prefs.set(key, value); },
    },
    fetch(url, options) {
      calls.push({ url, options });
      return fetchImpl ? fetchImpl() : Promise.resolve({ ok: httpOk, json: async () => response });
    },
  });
  return {
    nodes, calls, writes, errorSpan,
    submit(code = 'DMND-TEST-TEST-TEST', email = 'qa@example.invalid') {
      nodes.codeInput.value = code;
      nodes.emailInput.value = email;
      nodes.redeemForm.listeners.submit({ preventDefault() {} });
    },
  };
}

const settle = () => new Promise(resolve => setImmediate(resolve));

test('both production scripts have valid syntax', () => {
  new vm.Script(script);
  new vm.Script(appScript);
});

for (const locale of locales) {
  test(`${locale}: complete translations, privacy disclosure and buyer installation instructions`, () => {
    const redeem = dictionary(script), site = dictionary(appScript);
    for (const key of Object.keys(redeem.es)) assert.equal(typeof redeem[locale][key], 'string', `redeem ${key}`);
    for (const key of Object.keys(site.es)) assert.equal(typeof site[locale][key], 'string', `site ${key}`);
    assert.notEqual(site[locale]['privacy.row2.leaves'], site[locale]['privacy.row3.leaves']);
    assert.match(redeem[locale]['success.hint'], /0\.1\.1.*22H2.*~7.*Authenticode/);
    assert.match(site[locale]['start.subtitle'], /Windows 10\/11/);
    const p = page({ language: locale });
    assert.equal(p.nodes.langSelect.value, locale);
  });
}

test('buyer instructions no longer require source code or npm commands', () => {
  assert.doesNotMatch(index, /npm install|npm run tauri dev|ollama pull/);
  assert.match(index, /href="activate-4txntb.html" data-i18n="start.download"/);
  assert.doesNotMatch(html, /~50 M|your files never leave|sin cuenta y sin enviar/);
  assert.match(html, /\.error\[hidden\]\{display:none;\}/);
});

test('invalid code or email never reaches the server', () => {
  const p = page();
  p.submit('invalid');
  assert.equal(p.calls.length, 0);
  assert.equal(p.nodes.errorMsg.hidden, false);
  p.submit('DMND-TEST-TEST-TEST', 'invalid');
  assert.equal(p.calls.length, 0);
  assert.equal(p.nodes.viewSuccess.hidden, true);
});

test('blocked browser storage does not break initialization or successful redemption', async () => {
  const p = page({ blockedStorage: true });
  p.submit();
  await settle();
  assert.equal(p.calls.length, 1);
  assert.equal(p.nodes.viewSuccess.hidden, false);
  assert.equal(p.nodes.redeemBtn.disabled, false);
});

test('success normalizes email, clears inputs and does not cache buyer data or license tier', async () => {
  const p = page({ response: { ok: true, tier: 2 } });
  p.submit('DMND-TEST-TEST-TEST', ' QA@EXAMPLE.INVALID ');
  await settle();
  assert.equal(JSON.parse(p.calls[0].options.body).email, 'qa@example.invalid');
  assert.equal(p.nodes.viewForm.hidden, true);
  assert.equal(p.nodes.viewSuccess.hidden, false);
  assert.equal(p.nodes.codeInput.value, '');
  assert.equal(p.nodes.emailInput.value, '');
  assert.ok(p.writes.every(([key]) => ['documind_lang', 'documind_theme'].includes(key)));
});

test('repeated submit while a request is pending sends only one redemption', async () => {
  let resolve;
  const pending = new Promise(r => { resolve = r; });
  const p = page({ fetchImpl: () => pending });
  p.submit(); p.submit();
  assert.equal(p.calls.length, 1);
  assert.equal(p.nodes.redeemBtn.disabled, true);
  resolve({ ok: true, json: async () => ({ ok: true }) });
  await settle();
  assert.equal(p.nodes.viewSuccess.hidden, false);
});

for (const [error, key] of [
  ['disabled_code', 'redeem.errDisabled'],
  ['already_redeemed', 'redeem.errUsed'],
  ['server_not_configured', 'redeem.errConfig'],
  ['invalid_code', 'redeem.errNotFound'],
  ['stack_limit_reached', 'redeem.errStack'],
  ['rate_limited', 'redeem.errRate'],
]) {
  test(`${error}: actionable error, no success screen`, async () => {
    const p = page({ response: { ok: false, error }, httpOk: false });
    p.submit();
    await settle();
    assert.equal(p.errorSpan.textContent, dictionary(script).es[key]);
    assert.equal(p.nodes.viewSuccess.hidden, true);
    assert.equal(p.nodes.redeemBtn.disabled, false);
    assert.equal(p.nodes.emailInput.value, 'qa@example.invalid');
  });
}

test('network failure allows retry without claiming successful redemption', async () => {
  const p = page({ fetchImpl: () => Promise.reject(Error('offline')) });
  p.submit();
  await settle();
  assert.equal(p.nodes.viewSuccess.hidden, true);
  assert.equal(p.nodes.redeemBtn.disabled, false);
  assert.equal(p.errorSpan.textContent, dictionary(script).es['redeem.errLoad']);
});
