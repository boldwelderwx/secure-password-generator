// ═══════════════════════════════════════════════════════════
// app.js - Main application logic (ES2024+)
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const WORKER_URL = "https://secure-password-generator.boldwelderwx.workers.dev";
  
  // ─── Presets ───────────────────────────────────────
  async function loadPresets() {
    const grid = document.getElementById('presetsGrid');
    const filter = document.getElementById('categoryFilter');
    if (!grid || !filter) return;
    
    try {
      const response = await fetch(`${WORKER_URL}/presets`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      renderPresets(data.presets ?? [], grid, filter);
    } catch (error) {
      console.error('Failed to load presets:', error);
      grid.innerHTML = '<div class="tip-box">⚠️ Failed to load presets. Please check your internet connection.</div>';
    }
  }
  
  function renderPresets(presets, grid, filter) {
    const categories = [...new Set(presets.map(p => p.category))].sort();
    
    filter.innerHTML = 
      '<button class="category-btn active" data-cat="all">All</button>' +
      categories.map(c => `<button class="category-btn" data-cat="${c}">${c}</button>`).join('');
    
    filter.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filter.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        grid.querySelectorAll('.preset-card').forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
    
    grid.innerHTML = presets.map(p => `
      <div class="preset-card" data-cat="${p.category}" data-preset="${p.name}" tabindex="0" role="button" aria-label="Copy command for ${p.name}">
        <span class="preset-category">${p.category}</span>
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <div class="preset-meta">
          <span>📏 ${p.length.toLocaleString()} chars</span>
          <span>📊 ${p.count.toLocaleString()} entries</span>
          <span>📋 Click to copy</span>
        </div>
      </div>`).join('');
    
    grid.querySelectorAll('.preset-card').forEach(card => {
      const handler = () => copyPreset(card.dataset.preset);
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }
  
  async function copyPreset(name) {
    const cmd = `curl --compressed ${WORKER_URL}/preset/${name} -o passwords.csv`;
    const msg = `📋 Command copied!

${cmd}

📝 What to do next:
1. Open your console (see "Beginner Guide" section above)
2. Paste this command (Ctrl+V or Cmd+V)
3. Press Enter
4. The file "passwords.csv" will download to your current folder`;
    
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cmd);
        alert(msg);
      } else {
        prompt('Copy this command:', cmd);
      }
    } catch {
      prompt('Copy this command:', cmd);
    }
  }
  
  // ─── Generic JSON loader ───────────────────────────
  async function loadJSON(url, renderer) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      renderer(data);
      // Re-highlight code blocks with Prism
      if (typeof Prism !== 'undefined') Prism.highlightAll();
    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
    }
  }
  
  // ─── Tabs ──────────────────────────────────────────
  function setupTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          tabGroup.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          
          // Hide all tab-contents in the parent section
          const section = tab.closest('section') || tab.closest('.info-card') || document.body;
          section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const targetEl = document.getElementById(`tab-${target}`);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    });
  }
  
  // ─── Smooth scroll ─────────────────────────────────
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
  
  // ─── Renderers ─────────────────────────────────────
  function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }
  
  function codeBlock(code, lang = 'bash') {
    return `<pre class="language-${lang}"><code class="language-${lang}">${escapeHTML(code)}</code></pre>`;
  }
  
  function renderOpenHandling(d) {
    const el = document.getElementById('openHandlingContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <strong>💡 The Idea</strong>
        <p>${d.concept[lang] || d.concept.en}</p>
      </div>
      <h3>Step-by-Step Workflow</h3>
      <div class="workflow-card">
        <ol>${d.workflow.map(s => `<li><strong>Step ${s.step}:</strong> ${s[lang] || s.en}</li>`).join('')}</ol>
      </div>
      <h3>Commands</h3>
      <p><strong>Step 1 - Generate the database:</strong></p>
      ${codeBlock(d.commands.generate)}
      <p><strong>Step 2 - Import into Excel:</strong></p>
      <p>${d.commands.import_excel}</p>
      <p><strong>Step 2 (alternative) - Import into LibreOffice Calc:</strong></p>
      <p>${d.commands.import_libre}</p>
      <h3>Security Notes</h3>
      <ul>${d.security_notes.map(n => `<li>${n[lang] || n.en}</li>`).join('')}</ul>
      <div class="tip-box">
        <strong>💡 Boldwelder Tip</strong>
        <p>${d.boldwelder_tip[lang] || d.boldwelder_tip.en}</p>
      </div>`;
  }
  
  function renderBoldwelder(d) {
    const el = document.getElementById('boldwelderContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <strong>💡 Philosophy</strong>
        <p>${d.philosophy[lang] || d.philosophy.en}</p>
      </div>
      <h3>Why 4096 characters?</h3>
      <ul>${d.why_4096.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
      <h3>OpenSSL Examples with -passfile</h3>
      ${d.openssl_passfile_examples.map(ex => `
        <div class="workflow-card">
          <h4>🔐 ${ex.tool}</h4>
          <p>${ex['description_'+lang] || ex.description_en}</p>
          ${codeBlock(ex.commands.join('\n'))}
        </div>`).join('')}
      <h3>Best Practices</h3>
      <ul>${d.best_practices.map(b => `<li>${b[lang] || b.en}</li>`).join('')}</ul>`;
  }
  
  function renderSarahTim(d) {
    const el = document.getElementById('sarahTimContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <p>${d.story[lang] || d.story.en}</p>
      </div>
      <h3>Complete Workflow with OpenSSL Commands</h3>
      ${d.full_workflow.map(s => `
        <div class="workflow-card">
          <h4>Step ${s.step}: ${s['title_'+lang] || s.title_en}</h4>
          ${s.note_en ? `<p>${s['note_'+lang] || s.note_en}</p>` : ''}
          ${s.commands ? codeBlock(s.commands.join('\n')) : ''}
        </div>`).join('')}
      <h3>OpenSSL Algorithms Comparison</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Algorithm</th><th>Security</th><th>Use</th><th>Note</th></tr></thead>
          <tbody>
            ${d.openssl_algorithms.map(a => `
              <tr>
                <td><code>${a.name}</code></td>
                <td>${a.security}</td>
                <td>${a.use}</td>
                <td>${a.note}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }
  
  function renderKyber(d) {
    const el = document.getElementById('kyberContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <p>${d.intro[lang] || d.intro.en}</p>
      </div>
      <h3>Why Kyber / ML-KEM?</h3>
      <ul>${d.why_kyber.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
      <h3>Kyber Variants (ML-KEM)</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Variant</th><th>Security</th><th>Use</th><th>Public Key</th><th>Private Key</th><th>Ciphertext</th></tr></thead>
          <tbody>
            ${d.kyber_variants.map(v => `
              <tr>
                <td><code>${v.name}</code></td>
                <td>${v.security}</td>
                <td>${v.use}</td>
                <td>${v.pubkey}</td>
                <td>${v.privkey}</td>
                <td>${v.ciphertext}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <h3>Implementation Examples (OpenSSL 3.5+)</h3>
      ${d.examples.map(ex => `
        <div class="workflow-card">
          <h4>🛡️ ${ex.tool}</h4>
          ${ex.install ? `<p><strong>Install:</strong> <code>${ex.install}</code></p>` : ''}
          ${ex.note_en ? `<p>${ex['note_'+lang] || ex.note_en}</p>` : ''}
          ${codeBlock((ex.commands || [ex.test]).join('\n'))}
        </div>`).join('')}`;
  }
  
  function renderEmailProviders(d) {
    const el = document.getElementById('emailProvidersContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <strong>💡 Boldwelder's Advice</strong>
        <p>${d.boldwelder_advice[lang] || d.boldwelder_advice.en}</p>
      </div>
      <p><strong>Total providers: ${d.providers.length}</strong></p>
      <div class="email-grid">
        ${d.providers.map(p => `
          <div class="email-card">
            <h4>${p.name}</h4>
            <div class="email-meta">
              <span>Max: <span class="email-max">${p.max} chars</span></span>
              <span>Rec: ${p.recommended}</span>
            </div>
            <div class="notes">${p.notes}</div>
          </div>`).join('')}
      </div>`;
  }
  
  function renderAnonymity(d) {
    const el = document.getElementById('anonymityContent');
    if (!el || !d) return;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <p>${d.why_anonymous[lang] || d.why_anonymous.en}</p>
      </div>
      ${d.levels.map(l => `
        <div class="workflow-card">
          <h4>Level ${l.level}: ${l.name} <span style="color:var(--txt3); font-weight:normal;">(${l.security})</span></h4>
          <p><strong>Use case:</strong> ${l.use_case}</p>
          ${codeBlock(l.commands.join('\n'))}
        </div>`).join('')}`;
  }
  
  function renderTextBrowsers(d) {
    const el = document.getElementById('textBrowsersContent');
    if (!el || !d?.text_browsers) return;
    const t = d.text_browsers;
    const lang = window.i18n?.currentLang || 'en';
    el.innerHTML = `
      <div class="tip-box">
        <p>${t['intro_'+lang] || t.intro_en}</p>
      </div>
      <div class="browser-grid">
        ${t.browsers.map(b => `
          <div class="browser-card">
            <h4>${b.name}</h4>
            <p>${b.features}</p>
            <p><strong>Install:</strong> <code>${b.install}</code></p>
            ${codeBlock(b.usage)}
          </div>`).join('')}
      </div>
      <h3 style="margin-top:2rem;">${t['full_workflow_'+lang] || t.full_workflow_en}</h3>
      ${codeBlock(t.workflow_commands.join('\n'))}`;
  }
  
  // ─── Init ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    loadPresets();
    loadJSON('content/open-password-handling.json', renderOpenHandling);
    loadJSON('content/boldwelder-recommendations.json', renderBoldwelder);
    loadJSON('content/sarah-tim.json', renderSarahTim);
    loadJSON('content/kyber.json', renderKyber);
    loadJSON('content/email-providers.json', renderEmailProviders);
    loadJSON('content/tor-guide.json', renderAnonymity);
    loadJSON('content/tor-guide.json', d => renderTextBrowsers(d));
    setupTabs();
    setupSmoothScroll();
    console.log('✅ App initialized successfully');
  });
  
  // Re-render on language change
  window.addEventListener('languageChanged', () => {
    loadJSON('content/open-password-handling.json', renderOpenHandling);
    loadJSON('content/boldwelder-recommendations.json', renderBoldwelder);
    loadJSON('content/sarah-tim.json', renderSarahTim);
    loadJSON('content/kyber.json', renderKyber);
    loadJSON('content/email-providers.json', renderEmailProviders);
    loadJSON('content/tor-guide.json', renderAnonymity);
    loadJSON('content/tor-guide.json', d => renderTextBrowsers(d));
  });
})();
