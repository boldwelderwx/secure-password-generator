// ═══════════════════════════════════════════════════════════
// demo.js - Live demo with proper error handling
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const WORKER_URL = "https://secure-password-generator.boldwelderwx.workers.dev";
  
  async function runDemo() {
    const presetSelect = document.getElementById('demoPreset');
    const btn = document.getElementById('demoBtn');
    const output = document.getElementById('demoOutput');
    
    if (!presetSelect || !btn || !output) {
      console.error('Demo elements not found');
      return;
    }
    
    const preset = presetSelect.value;
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';
    output.innerHTML = '<div class="demo-placeholder">🔄 Contacting the password server...</div>';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${WORKER_URL}/preset/${preset}`, {
        signal: controller.signal,
        headers: { 'Accept': 'text/csv' }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`Server responded with HTTP ${response.status}`);
      
      const text = await response.text();
      const lines = text.split('\n').filter(l => l.trim());
      const sample = lines.slice(0, 11);
      
      const display = sample.map((line, i) => {
        if (i === 0) return `<span style="color:#94a3b8">// ${line}</span>`;
        const pw = line.split(',')[0];
        return `<span style="color:#10b981">${i}.</span> ${pw}`;
      }).join('\n');
      
      output.innerHTML = 
        `<span style="color:#64748b">// 📋 Preset: ${preset}</span>\n` +
        `<span style="color:#64748b">// 📊 Total generated: ${(lines.length - 1).toLocaleString()} passwords</span>\n` +
        `<span style="color:#64748b">// 🎯 Showing first 10:</span>\n\n` +
        display +
        `\n\n<span style="color:#64748b">// ... and ${(lines.length - 11).toLocaleString()} more passwords in the full file</span>\n\n` +
        `<span style="color:#64748b">// 💡 To download the full database, copy this command:</span>\n` +
        `<span style="color:#fbbf24">curl --compressed ${WORKER_URL}/preset/${preset} -o passwords.csv</span>`;
        
    } catch (error) {
      output.innerHTML = 
        `<span style="color:#ef4444">❌ Error: ${error.message}</span>\n\n` +
        `<span style="color:#64748b">This could happen because:</span>\n` +
        `<span style="color:#64748b">  1. You're offline or have a slow connection</span>\n` +
        `<span style="color:#64748b">  2. The server is rate-limited (100K requests/day on free tier)</span>\n` +
        `<span style="color:#64748b">  3. Your firewall or antivirus is blocking the request</span>\n\n` +
        `<span style="color:#94a3b8">Try running curl directly in your console (see the Beginner Guide above).</span>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate 10 Sample Passwords';
    }
  }
  
  window.runDemo = runDemo;
  
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('demoBtn');
    if (btn) {
      btn.addEventListener('click', runDemo);
    }
  });
})();
