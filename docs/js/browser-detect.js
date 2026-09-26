// ═══════════════════════════════════════════════════════════
// browser-detect.js - Cross-browser detection & adaptation
// Uses UAParser.js + feature detection (MDN Baseline 2026)
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const BrowserDetect = {
    info: null,
    
    init() {
      this.info = this.detect();
      this.adapt();
      this.showInfo();
      this.checkCompatibility();
    },
    
    detect() {
      const result = {
        browser: 'unknown',
        version: '0',
        os: 'unknown',
        device: 'desktop',
        isMobile: false,
        isTV: false,
        isBot: false,
        supports: {
          grid: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('display', 'grid'),
          backdropFilter: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('backdrop-filter', 'blur(1px)'),
          fetch: typeof fetch === 'function',
          clipboard: navigator.clipboard && typeof navigator.clipboard.writeText === 'function',
          localStorage: (() => { try { localStorage.setItem('__test', '1'); localStorage.removeItem('__test'); return true; } catch(e) { return false; } })(),
          es2024: (() => { try { eval('const s = new Set([1,2,3]); s.intersection(new Set([2,3,4]))'); return true; } catch(e) { return false; } })()
        },
        userAgent: navigator.userAgent || ''
      };
      
      // Use UAParser if available
      if (typeof UAParser !== 'undefined') {
        try {
          const parser = new UAParser();
          const ua = parser.getResult();
          result.browser = ua.browser.name || 'unknown';
          result.version = ua.browser.major || '0';
          result.os = ua.os.name || 'unknown';
          result.device = ua.device.type || 'desktop';
          result.isMobile = ua.device.type === 'mobile' || ua.device.type === 'tablet';
          result.isTV = ua.device.type === 'smarttv' || /TV|SmartTV|GoogleTV|BRAVIA/i.test(result.userAgent);
          result.isBot = /bot|crawl|spider|slurp/i.test(result.userAgent);
        } catch (e) {
          console.warn('UAParser failed, using fallback');
        }
      } else {
        // Fallback UA parsing
        const ua = result.userAgent;
        if (/Edg\//i.test(ua)) result.browser = 'Edge';
        else if (/OPR\//i.test(ua)) result.browser = 'Opera';
        else if (/Chrome\//i.test(ua)) result.browser = 'Chrome';
        else if (/Firefox\//i.test(ua)) result.browser = 'Firefox';
        else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) result.browser = 'Safari';
        else if (/MSIE|Trident/i.test(ua)) result.browser = 'IE';
        
        if (/Mobile|Android|iPhone|iPad/i.test(ua)) result.isMobile = true;
        if (/TV|SmartTV|GoogleTV/i.test(ua)) result.isTV = true;
        if (/bot|crawl|spider/i.test(ua)) result.isBot = true;
      }
      
      return result;
    },
    
    adapt() {
      const html = document.documentElement;
      html.dataset.browser = this.info.browser.toLowerCase().replace(/\s+/g, '-');
      html.dataset.os = this.info.os.toLowerCase().replace(/\s+/g, '-');
      html.dataset.device = this.info.device;
      
      if (this.info.isMobile) html.dataset.mobile = 'true';
      if (this.info.isTV) html.dataset.tv = 'true';
      
      // Add RTL support for Arabic
      if (this.info.browser === 'ar') html.setAttribute('dir', 'rtl');
    },
    
    showInfo() {
      const infoEl = document.getElementById('browserInfo');
      if (infoEl) {
        infoEl.textContent = `🌐 ${this.info.browser} ${this.info.version} on ${this.info.os} (${this.info.device})`;
      }
    },
    
    checkCompatibility() {
      const missing = [];
      if (!this.info.supports.fetch) missing.push('fetch API');
      if (!this.info.supports.grid) missing.push('CSS Grid');
      if (!this.info.supports.localStorage) missing.push('localStorage');
      
      if (missing.length > 0) {
        const warn = document.getElementById('browserWarning');
        if (warn) {
          warn.hidden = false;
          warn.innerHTML = `<strong>⚠️ Your browser is outdated.</strong> Missing: ${missing.join(', ')}. Please update to a modern browser (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+).`;
        }
      }
    }
  };
  
  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BrowserDetect.init());
  } else {
    BrowserDetect.init();
  }
  
  window.BrowserDetect = BrowserDetect;
})();
