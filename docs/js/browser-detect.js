// ═══════════════════════════════════════════════════════════
// browser-detect.js - Feature Detection (MDN Baseline 2026)
// Supports ALL browsers via capability testing, not UA strings
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const Features = {
    info: {},
    
    init() {
      this.detect();
      this.adapt();
      this.showInfo();
      this.checkCritical();
    },
    
    // Feature detection - works on ALL browsers (old + new + exotic)
    detect() {
      this.info = {
        // Core web features
        fetch: typeof fetch === 'function',
        promise: typeof Promise === 'function',
        asyncAwait: (async () => true)() instanceof Promise,
        modules: 'noModule' in document.createElement('script'),
        cssGrid: CSS && CSS.supports && CSS.supports('display', 'grid'),
        cssFlexbox: CSS && CSS.supports && CSS.supports('display', 'flex'),
        cssBackdrop: CSS && CSS.supports && CSS.supports('backdrop-filter', 'blur(1px)'),
        cssClamp: CSS && CSS.supports && CSS.supports('font-size', 'clamp(1rem, 2vw, 2rem)'),
        es6Class: (() => { try { eval('class X{}'); return true; } catch(e) { return false; } })(),
        es2020Optional: (() => { try { eval('({a:1})?.a'); return true; } catch(e) { return false; } })(),
        es2024Set: (() => { try { eval('new Set([1]).intersection(new Set([1]))'); return true; } catch(e) { return false; } })(),
        localStorage: (() => { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch(e) { return false; } })(),
        clipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
        crypto: !!(window.crypto && window.crypto.getRandomValues),
        intersectionObserver: typeof IntersectionObserver === 'function',
        resizeObserver: typeof ResizeObserver === 'function',
        webgl: (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); } catch(e) { return false; } })(),
        serviceWorker: 'serviceWorker' in navigator,
        webp: (() => { const c = document.createElement('canvas'); c.width = c.height = 1; return c.toDataURL('image/webp').indexOf('data:image/webp') === 0; })(),
        avif: (() => { const c = document.createElement('canvas'); c.width = c.height = 1; return c.toDataURL('image/avif').indexOf('data:image/avif') === 0; })(),
        
        // Device detection
        isMobile: /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window && navigator.maxTouchPoints > 1),
        isTV: /SmartTV|GoogleTV|BRAVIA|NetCast|DLNADOC|HbbTV|Viera/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent),
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Viewport info
        viewportWidth: window.innerWidth || document.documentElement.clientWidth,
        viewportHeight: window.innerHeight || document.documentElement.clientHeight,
        screenWidth: window.screen ? window.screen.width : 0,
        screenHeight: window.screen ? window.screen.height : 0,
        devicePixelRatio: window.devicePixelRatio || 1,
        
        // Connection info
        connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
        
        // Timezone & language
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        languages: navigator.languages || [navigator.language || 'en'],
        
        // UA string (just for info, not for logic)
        userAgent: navigator.userAgent || 'unknown'
      };
      
      // Classify support level
      const f = this.info;
      const criticalCount = [f.fetch, f.promise, f.cssFlexbox, f.localStorage, f.es6Class].filter(Boolean).length;
      
      if (criticalCount === 5) this.info.supportLevel = 'full';
      else if (criticalCount >= 3) this.info.supportLevel = 'partial';
      else this.info.supportLevel = 'legacy';
      
      // Classify device type
      this.info.deviceType = this.info.isTV ? 'tv' : 
                             this.info.isTablet ? 'tablet' : 
                             this.info.isMobile ? 'mobile' : 'desktop';
    },
    
    // Apply adaptations based on features (not browser names!)
    adapt() {
      const html = document.documentElement;
      const f = this.info;
      
      // Device type
      html.dataset.device = f.deviceType;
      html.dataset.support = f.supportLevel;
      html.dataset.touch = f.isTouchDevice ? 'true' : 'false';
      
      // Viewport size class
      if (f.viewportWidth < 480) html.dataset.size = 'xs';
      else if (f.viewportWidth < 768) html.dataset.size = 'sm';
      else if (f.viewportWidth < 1024) html.dataset.size = 'md';
      else if (f.viewportWidth < 1440) html.dataset.size = 'lg';
      else html.dataset.size = 'xl';
      
      // Feature flags for CSS
      if (!f.cssBackdrop) html.dataset.noBackdrop = 'true';
      if (!f.cssGrid) html.dataset.noGrid = 'true';
      if (!f.webgl) html.dataset.noWebgl = 'true';
      
      // Touch device optimizations
      if (f.isTouchDevice) {
        document.addEventListener('touchstart', function(){}, {passive: true});
      }
      
      // Slow connection detection
      if (f.connection) {
        const slow = f.connection.effectiveType === 'slow-2g' || 
                     f.connection.effectiveType === '2g' ||
                     f.connection.saveData === true;
        if (slow) {
          html.dataset.slowConnection = 'true';
          // Preload fewer resources
          document.querySelectorAll('link[rel="preload"]').forEach(link => {
            if (!link.href.includes('prism')) link.remove();
          });
        }
      }
      
      // High DPI optimizations
      if (f.devicePixelRatio > 2) {
        html.dataset.hidpi = 'true';
      }
    },
    
    showInfo() {
      const el = document.getElementById('browserInfo');
      if (!el) return;
      const f = this.info;
      el.textContent = `📱 ${f.deviceType} | ${f.viewportWidth}×${f.viewportHeight} | support: ${f.supportLevel} | touch: ${f.isTouchDevice}`;
    },
    
    checkCritical() {
      const f = this.info;
      const critical = ['fetch', 'promise', 'cssFlexbox', 'es6Class', 'localStorage'];
      const missing = critical.filter(feature => !f[feature]);
      
      if (missing.length > 0) {
        const warn = document.getElementById('browserWarning');
        if (warn) {
          warn.hidden = false;
          warn.innerHTML = `⚠️ <strong>Your browser is missing critical features:</strong> ${missing.join(', ')}. <a href="https://browsehappy.com/" target="_blank" rel="noopener">Please update</a> for full functionality.`;
        }
      }
    }
  };
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Features.init());
  } else {
    Features.init();
  }
  
  window.Features = Features;
})();
