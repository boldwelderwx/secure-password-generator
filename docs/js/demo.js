// ═══════════════════════════════════════════════════════════
// demo.js - Live demo using /sample/ endpoint (passwords only)
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const WORKER = "https://secure-password-generator.boldwelderwx.workers.dev";
  
  async function runDemo() {
    const preset = document.getElementById('demoPreset');
    const btn = document.getElementById('demoBtn');
    const output = document.getElementById('demoOutput');
    
    if (!preset || !btn || !output) return;
    
    const presetName = preset.value;
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';
    output.innerHTML = '<div class="demo-placeholder">🔄 Contacting password server...</div>';
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      
      // Use new /sample/ endpoint - returns just 10 passwords, one per line
      const response = await fetch(`${WORKER}/sample/${presetName}`, {
        signal: controller.signal,
        headers: { 'Accept': 'text/plain' },
        cache: 'no-store'
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      // Remove UTF-8 BOM if present
      const cleanText = text.replace(/^\uFEFF/, '');
      const passwords = cleanText.split('\n').filter(p => p.trim() && !p.startsWith('#'));
      
      const display = passwords.map((pw, i) => 
        `<span style="color:#10b981">${String(i + 1).padStart(2, ' ')}.</span> ${pw}`
      ).join('\n');
      
      output.innerHTML = 
        `<span style="color:#64748b">// 📋 Preset: ${presetName}</span>\n` +
        `<span style="color:#64748b">// 🎯 Sample: 10 random passwords</span>\n\n` +
        display +
        `\n\n<span style="color:#64748b">// 💡 To download the full database to your computer:</span>\n` +
        `<span style="color:#fbbf24">curl -OJ "${WORKER}/preset/${presetName}"</span>\n\n` +
        `<span style="color:#64748b">// The CSV uses column layout (max 5000 rows, passwords only).</span>\n` +
        `<span style="color:#64748b">// Open in Excel/LibreOffice - it just works!</span>`;
        
    } catch (error) {
      const msg = error.name === 'AbortError' ? 'Request timed out (slow connection?)' : error.message;
      output.innerHTML = 
        `<span style="color:#ef4444">❌ Error: ${msg}</span>\n\n` +
        `<span style="color:#64748b">Try running curl directly in your console:</span>\n` +
        `<span style="color:#fbbf24">curl -OJ "${WORKER}/preset/${presetName}"</span>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate 10 Sample Passwords';
    }
  }
  
  window.runDemo = runDemo;
  
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('demoBtn');
    if (btn) btn.addEventListener('click', runDemo);
  });
})();
