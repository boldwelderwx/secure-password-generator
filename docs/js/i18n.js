// ═══════════════════════════════════════════════════════════
// i18n.js - Multilingual system (ES2024+)
// ═══════════════════════════════════════════════════════════

"use strict";

class I18n {
  #currentLang;
  #translations = {};
  #rtlLangs = new Set(['ar', 'he', 'fa', 'ur']);
  #langNames = {
    en: { flag: '🇺🇸', name: 'English' },
    hu: { flag: '🇭🇺', name: 'Magyar' },
    pl: { flag: '🇵🇱', name: 'Polski' },
    de: { flag: '🇩🇪', name: 'Deutsch' },
    ru: { flag: '🇷🇺', name: 'Русский' },
    ja: { flag: '🇯🇵', name: '日本語' },
    es: { flag: '🇪🇸', name: 'Español' },
    fr: { flag: '🇫🇷', name: 'Français' },
    ar: { flag: '🇸🇦', name: 'العربية' },
    zh: { flag: '🇨🇳', name: '中文' }
  };
  
  constructor() {
    this.#currentLang = this.#detectLanguage();
  }
  
  #detectLanguage() {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && this.#langNames[saved]) return saved;
      
      const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
      return this.#langNames[browserLang] ? browserLang : 'en';
    } catch {
      return 'en';
    }
  }
  
  async init() {
    await this.#loadLanguage(this.#currentLang);
    this.#applyTranslations();
    this.#setupUI();
    this.#applyDirection();
    this.#updateUI();
  }
  
  async #loadLanguage(lang) {
    try {
      const response = await fetch(`i18n/${lang}.json`, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.#translations = await response.json();
      this.#currentLang = lang;
      try { localStorage.setItem('lang', lang); } catch {}
    } catch (error) {
      console.warn(`Failed to load ${lang}.json, falling back to English:`, error);
      if (lang !== 'en') {
        try {
          const r = await fetch('i18n/en.json');
          if (r.ok) {
            this.#translations = await r.json();
            this.#currentLang = 'en';
          }
        } catch {}
      }
    }
  }
  
  t(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.#translations) ?? key;
  }
  
  #applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translated = this.t(key);
      if (translated !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      }
    });
    document.documentElement.lang = this.#currentLang;
  }
  
  #applyDirection() {
    const dir = this.#rtlLangs.has(this.#currentLang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
  }
  
  #setupUI() {
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langMenu.classList.toggle('active');
        langBtn.setAttribute('aria-expanded', isOpen);
      });
      
      langMenu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const lang = btn.dataset.lang;
          await this.setLanguage(lang);
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
        });
      });
      
      document.addEventListener('click', (e) => {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
  
  #updateUI() {
    const flagEl = document.getElementById('currentLangFlag');
    const codeEl = document.getElementById('currentLangCode');
    const langInfo = this.#langNames[this.#currentLang];
    
    if (flagEl && langInfo) flagEl.textContent = langInfo.flag;
    if (codeEl) codeEl.textContent = this.#currentLang.toUpperCase();
  }
  
  async setLanguage(lang) {
    await this.#loadLanguage(lang);
    this.#applyTranslations();
    this.#applyDirection();
    this.#updateUI();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.#currentLang } }));
  }
  
  get currentLang() { return this.#currentLang; }
  get isRTL() { return this.#rtlLangs.has(this.#currentLang); }
}

window.i18n = new I18n();
document.addEventListener('DOMContentLoaded', () => window.i18n.init());

// Theme toggle (global)
window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch {}
  
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
};

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', window.toggleTheme);
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = current === 'dark' ? '☀️' : '🌙';
  }
});
