class I18n {
  constructor() { this.currentLang = localStorage.getItem('lang') || 'en'; this.translations = {}; this.rtlLangs = ['ar','he']; }
  async init() { await this.loadLanguage(this.currentLang); this.applyTranslations(); this.setupLanguageSwitcher(); this.setupThemeToggle(); this.applyDirection(); }
  async loadLanguage(lang) {
    try {
      const r = await fetch(`i18n/${lang}.json`);
      if (!r.ok) throw new Error();
      this.translations = await r.json(); this.currentLang = lang; localStorage.setItem('lang', lang);
    } catch { if (lang !== 'en') { const r = await fetch('i18n/en.json'); this.translations = await r.json(); this.currentLang = 'en'; } }
  }
  t(key) { const ks = key.split('.'); let v = this.translations; for (const k of ks) { if (v && k in v) v = v[k]; else return key; } return v; }
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => { const t = this.t(el.getAttribute('data-i18n')); if (el.tagName === 'INPUT') el.placeholder = t; else el.textContent = t; });
    const lb = document.getElementById('currentLang');
    if (lb) { const f = {en:'🇺🇸',hu:'🇭🇺',pl:'🇵🇱',de:'🇩🇪',ru:'🇷🇺',ja:'🇯🇵',es:'🇪🇸',fr:'🇫🇷',ar:'🇸🇦',zh:'🇨🇳'}; lb.textContent = `${f[this.currentLang]||'🌐'} ${this.currentLang.toUpperCase()}`; }
    document.documentElement.lang = this.currentLang;
  }
  applyDirection() { document.documentElement.setAttribute('dir', this.rtlLangs.includes(this.currentLang) ? 'rtl' : 'ltr'); }
  async setLanguage(lang) { await this.loadLanguage(lang); this.applyTranslations(); this.applyDirection(); window.dispatchEvent(new CustomEvent('languageChanged',{detail:{lang}})); }
  setupLanguageSwitcher() {
    const b = document.querySelector('.lang-btn'), m = document.getElementById('langMenu');
    if (b && m) { b.addEventListener('click', e => { e.stopPropagation(); m.classList.toggle('active'); }); m.querySelectorAll('a').forEach(l => l.addEventListener('click', async e => { e.preventDefault(); await this.setLanguage(l.dataset.lang); m.classList.remove('active'); })); document.addEventListener('click', () => m.classList.remove('active')); }
  }
  setupThemeToggle() {
    const t = document.querySelector('.theme-toggle'), i = document.getElementById('themeIcon');
    const s = localStorage.getItem('theme') || 'light'; document.documentElement.setAttribute('data-theme', s); if (i) i.textContent = s === 'dark' ? '☀️' : '🌙';
    if (t) t.addEventListener('click', () => { const c = document.documentElement.getAttribute('data-theme'), n = c === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); localStorage.setItem('theme', n); if (i) i.textContent = n === 'dark' ? '☀️' : '🌙'; });
  }
}
window.i18n = new I18n(); document.addEventListener('DOMContentLoaded', () => window.i18n.init());
function toggleLangMenu() { document.getElementById('langMenu').classList.toggle('active'); }
function toggleTheme() { const c = document.documentElement.getAttribute('data-theme'), n = c === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', n); localStorage.setItem('theme', n); document.getElementById('themeIcon').textContent = n === 'dark' ? '☀️' : '🌙'; }
