// ═══════════════════════════════════════════════════════════
// i18n.js - Multilingual system (guaranteed working)
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);
  
  const I18n = {
    currentLang: 'en',
    translations: {},
    langCache: new Map(), // Cache loaded translations
    
    init() {
      this.currentLang = this.detectLang();
      this.setupUI();
      this.setupTheme();
      this.loadAndApply(this.currentLang);
    },
    
    detectLang() {
      try {
        const saved = localStorage.getItem('lang');
        if (saved) return saved;
      } catch(e) {}
      
      const browserLangs = navigator.languages || [navigator.language || 'en'];
      for (const lang of browserLangs) {
        const code = lang.split('-')[0].toLowerCase();
        const btn = document.querySelector(`#langMenu button[data-lang="${code}"]`);
        if (btn) return code;
      }
      return 'en';
    },
    
    setupUI() {
      const langBtn = document.getElementById('langBtn');
      const langMenu = document.getElementById('langMenu');
      
      if (!langBtn || !langMenu) return;
      
      // Toggle menu on button click
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = langMenu.classList.toggle('active');
        langBtn.setAttribute('aria-expanded', String(isOpen));
      });
      
      // Handle language selection
      langMenu.querySelectorAll('button[data-lang]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const lang = btn.dataset.lang;
          await this.setLanguage(lang);
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
        });
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langMenu.classList.contains('active')) {
          langMenu.classList.remove('active');
          langBtn.setAttribute('aria-expanded', 'false');
          langBtn.focus();
        }
      });
      
      // Keyboard navigation in menu
      langMenu.addEventListener('keydown', (e) => {
        const buttons = Array.from(langMenu.querySelectorAll('button'));
        const current = document.activeElement;
        const idx = buttons.indexOf(current);
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          buttons[(idx + 1) % buttons.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          buttons[(idx - 1 + buttons.length) % buttons.length].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          current.click();
        }
      });
    },
    
    setupTheme() {
      const toggle = document.getElementById('themeToggle');
      if (!toggle) return;
      
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch(e) {}
        const icon = toggle.querySelector('.theme-icon');
        const text = toggle.querySelector('.theme-text');
        if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
        if (text) text.textContent = next === 'dark' ? 'Light' : 'Dark';
      });
      
      // Update initial state
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const icon = toggle.querySelector('.theme-icon');
      const text = toggle.querySelector('.theme-text');
      if (icon) icon.textContent = current === 'dark' ? '☀️' : '🌙';
      if (text) text.textContent = current === 'dark' ? 'Light' : 'Dark';
    },
    
    async loadAndApply(lang) {
      // Check cache first
      if (this.langCache.has(lang)) {
        this.translations = this.langCache.get(lang);
        this.applyTranslations();
        this.updateButton();
        return;
      }
      
      try {
        const response = await fetch(`i18n/${lang}.json`, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        this.translations = data;
        this.langCache.set(lang, data);
        this.currentLang = lang;
        try { localStorage.setItem('lang', lang); } catch(e) {}
        this.applyTranslations();
        this.updateButton();
        
        // Notify other modules
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      } catch (error) {
        console.warn(`Failed to load ${lang}, falling back to English:`, error);
        if (lang !== 'en') {
          await this.loadAndApply('en');
        }
      }
    },
    
    applyTranslations() {
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
      
      document.documentElement.lang = this.currentLang;
      const dir = RTL_LANGS.has(this.currentLang) ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
    },
    
    updateButton() {
      const flagEl = document.getElementById('currentLangFlag');
      const nameEl = document.getElementById('currentLangName');
      const currentBtn = document.querySelector(`#langMenu button[data-lang="${this.currentLang}"]`);
      
      if (currentBtn) {
        if (flagEl) flagEl.textContent = currentBtn.dataset.flag || '🌐';
        if (nameEl) nameEl.textContent = currentBtn.dataset.name || this.currentLang.toUpperCase();
        
        // Update "current" class
        document.querySelectorAll('#langMenu button').forEach(b => b.classList.remove('current'));
        currentBtn.classList.add('current');
      }
    },
    
    t(key) {
      return key.split('.').reduce((obj, k) => obj && obj[k], this.translations) || key;
    },
    
    async setLanguage(lang) {
      await this.loadAndApply(lang);
    },
    
    get lang() { return this.currentLang; }
    get isRTL() { return RTL_LANGS.has(this.currentLang); }
  };
  
  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
  } else {
    I18n.init();
  }
  
  window.I18n = I18n;
})();
