const DEMO_WORKER = "https://secure-password-generator.boldwelderwx.workers.dev";
async function runDemo() {
  const p = document.getElementById('demoPreset').value, b = event.target, o = document.getElementById('demoOutput');
  b.disabled = true; b.innerHTML = '⏳ Generating...'; o.innerHTML = '<div class="demo-placeholder">Contacting Worker...</div>';
  try {
    const r = await fetch(`${DEMO_WORKER}/preset/${p}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const t = await r.text(), l = t.split('\n').filter(x => x.trim()), s = l.slice(0, 11);
    o.innerHTML = `<span style="color:#64748b">// Preset: ${p}</span>\n<span style="color:#64748b">// Total: ${(l.length-1).toLocaleString()}</span>\n\n` + s.map((x,i) => i===0 ? `<span style="color:#94a3b8">${x}</span>` : `<span style="color:#10b981">${i}.</span> ${x.split(',')[0]}`).join('\n') + `\n\n<span style="color:#64748b">// ... ${(l.length-11).toLocaleString()} more</span>`;
  } catch(e) { o.innerHTML = `<span style="color:#ef4444">❌ Error: ${e.message}</span>`; }
  finally { b.disabled = false; b.innerHTML = 'Generate 10 Sample Passwords'; }
}
window.runDemo = runDemo;
