// ═══════════════════════════════════════════════════════════
// i18n.js v6.0 - BULLETPROOF (global functions + inline onclick)
// ═══════════════════════════════════════════════════════════

"use strict";

// ─── GLOBAL FUNCTIONS (called by inline onclick) ─────────
// These are defined IMMEDIATELY when script loads,
// before DOMContentLoaded, so they ALWAYS work.

window.SPG_toggleTheme = function() {
  try {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch(e) {}
    
    // Update icon
    var icon = document.querySelector('.theme-icon');
    var text = document.querySelector('.theme-text');
    if (icon) icon.textContent = next === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    if (text) text.textContent = next === 'dark' ? 'Light' : 'Dark';
    console.log('[SPG] Theme switched to:', next);
  } catch(e) {
    console.error('[SPG] Theme toggle error:', e);
  }
};

window.SPG_toggleLangMenu = function() {
  try {
    var menu = document.getElementById('langMenu');
    var btn = document.getElementById('langBtn');
    if (!menu) { console.error('[SPG] langMenu not found'); return; }
    
    var isOpen = menu.classList.contains('active');
    if (isOpen) {
      menu.classList.remove('active');
      menu.style.display = 'none';
      if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
      menu.classList.add('active');
      menu.style.display = 'block';
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
    console.log('[SPG] Lang menu:', isOpen ? 'CLOSED' : 'OPEN');
  } catch(e) {
    console.error('[SPG] Lang menu error:', e);
  }
};

window.SPG_selectLang = function(lang) {
  try {
    console.log('[SPG] Selecting language:', lang);
    window.SPG_setLang(lang);
    // Close menu
    var menu = document.getElementById('langMenu');
    if (menu) {
      menu.classList.remove('active');
      menu.style.display = 'none';
    }
  } catch(e) {
    console.error('[SPG] Select lang error:', e);
  }
};

// ─── CLOSE MENU ON OUTSIDE CLICK ─────────────────────────
document.addEventListener('click', function(e) {
  try {
    var menu = document.getElementById('langMenu');
    var btn = document.getElementById('langBtn');
    if (!menu || !btn) return;
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('active');
      menu.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
    }
  } catch(e) {}
});

// ─── CLOSE ON ESCAPE ─────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var menu = document.getElementById('langMenu');
    if (menu) {
      menu.classList.remove('active');
      menu.style.display = 'none';
    }
  }
});

// ─── TRANSLATION ENGINE ──────────────────────────────────
var SPG_translations = {};
var SPG_currentLang = 'en';
var SPG_langCache = {};

window.SPG_setLang = function(lang) {
  // Check cache
  if (SPG_langCache[lang]) {
    SPG_translations = SPG_langCache[lang];
    SPG_currentLang = lang;
    SPG_applyTranslations();
    SPG_updateButton();
    try { localStorage.setItem('lang', lang); } catch(e) {}
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    return;
  }
  
  // Fetch translation
  fetch('i18n/' + lang + '.json?v=6', { cache: 'no-store' })
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      SPG_translations = data;
      SPG_langCache[lang] = data;
      SPG_currentLang = lang;
      SPG_applyTranslations();
      SPG_updateButton();
      try { localStorage.setItem('lang', lang); } catch(e) {}
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    })
    .catch(function(e) {
      console.warn('[SPG] Failed to load ' + lang + ':', e);
      if (lang !== 'en') window.SPG_setLang('en');
    });
};

function SPG_applyTranslations() {
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    var val = SPG_t(key);
    if (val !== key) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    }
  }
  document.documentElement.lang = SPG_currentLang;
  
  // RTL support
  var rtlLangs = ['ar', 'he', 'fa', 'ur'];
  document.documentElement.setAttribute('dir', rtlLangs.indexOf(SPG_currentLang) >= 0 ? 'rtl' : 'ltr');
}

function SPG_t(key) {
  var parts = key.split('.');
  var val = SPG_translations;
  for (var i = 0; i < parts.length; i++) {
    if (val && typeof val === 'object' && parts[i] in val) {
      val = val[parts[i]];
    } else {
      return key;
    }
  }
  return val;
}

function SPG_updateButton() {
  var currentBtn = document.querySelector('#langMenu button[data-lang="' + SPG_currentLang + '"]');
  var flagEl = document.getElementById('currentLangFlag');
  var nameEl = document.getElementById('currentLangName');
  
  if (currentBtn) {
    if (flagEl) flagEl.textContent = currentBtn.getAttribute('data-flag') || '\uD83C\uDF10';
    if (nameEl) nameEl.textContent = currentBtn.getAttribute('data-name') || SPG_currentLang.toUpperCase();
    
    // Update current class
    var allBtns = document.querySelectorAll('#langMenu button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('current');
    }
    currentBtn.classList.add('current');
  }
}

// ─── INIT ON DOM READY ───────────────────────────────────
function SPG_init() {
  console.log('[SPG] i18n v6.0 initializing...');
  
  // Detect language
  var lang = 'en';
  try {
    var saved = localStorage.getItem('lang');
    if (saved) lang = saved;
  } catch(e) {}
  
  // Load and apply
  window.SPG_setLang(lang);
  
  // Set theme icon
  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  var icon = document.querySelector('.theme-icon');
  var text = document.querySelector('.theme-text');
  if (icon) icon.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
  
  console.log('[SPG] i18n ready. Language:', lang, '| Theme:', theme);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SPG_init);
} else {
  SPG_init();
}

// ─── EXPOSE FOR OTHER MODULES ────────────────────────────
window.I18n = {
  get lang() { return SPG_currentLang; },
  t: SPG_t,
  setLanguage: window.SPG_setLang
};
