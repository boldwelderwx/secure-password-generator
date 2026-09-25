const WORKER_URL = "https://secure-password-generator.boldwelderwx.workers.dev";

async function loadPresets() {
  try { const r = await fetch(`${WORKER_URL}/presets`); const d = await r.json(); renderPresets(d.presets); } catch(e) { console.error(e); }
}
function renderPresets(presets) {
  const g = document.getElementById('presetsGrid'), f = document.getElementById('categoryFilter'); if (!g||!f) return;
  const cats = [...new Set(presets.map(p => p.category))];
  f.innerHTML = `<button class="category-btn active" data-cat="all">All</button>` + cats.map(c => `<button class="category-btn" data-cat="${c}">${c}</button>`).join('');
  f.querySelectorAll('.category-btn').forEach(b => b.addEventListener('click', () => { f.querySelectorAll('.category-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); g.querySelectorAll('.preset-card').forEach(c => c.style.display = (b.dataset.cat === 'all' || c.dataset.cat === b.dataset.cat) ? '' : 'none'); }));
  g.innerHTML = presets.map(p => `<div class="preset-card" data-cat="${p.category}" onclick="copyPreset('${p.name}')"><span class="preset-category">${p.category}</span><h4>${p.name}</h4><p>${p.description}</p><div class="preset-meta"><span>📏 ${p.length} chars</span><span>📊 ${p.count.toLocaleString()}</span></div></div>`).join('');
}
function copyPreset(n) { const c = `curl --compressed ${WORKER_URL}/preset/${n} -o pw.csv`; navigator.clipboard.writeText(c).then(() => alert(`Copied:\n${c}`)); }

async function loadJSON(url, renderer) { try { const r = await fetch(url); const d = await r.json(); renderer(d); } catch(e) { console.error(url, e); } }

function renderOpenHandling(d) {
  const el = document.getElementById('openHandlingContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box"><strong>💡 Concept:</strong> ${d.concept[lang] || d.concept.en}</div>
    <h3>Workflow:</h3>
    <div class="workflow-card"><ol>${d.workflow.map(s => `<li><strong>Step ${s.step}:</strong> ${s[lang] || s.en}</li>`).join('')}</ol></div>
    <h3>Commands:</h3>
    <pre><code>${d.commands.generate}\n${d.commands.import_excel}\n${d.commands.import_libre}</code></pre>
    <h3>Security Notes:</h3>
    <ul>${d.security_notes.map(n => `<li>${n[lang] || n.en}</li>`).join('')}</ul>
    <div class="tip-box"><strong>💡 Boldwelder Tip:</strong> ${d.boldwelder_tip[lang] || d.boldwelder_tip.en}</div>`;
}

function renderBoldwelder(d) {
  const el = document.getElementById('boldwelderContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box"><strong>💡 Philosophy:</strong> ${d.philosophy[lang] || d.philosophy.en}</div>
    <h3>Why 4096 characters?</h3>
    <ul>${d.why_4096.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
    <h3>OpenSSL -passfile Examples:</h3>
    ${d.openssl_passfile_examples.map(ex => `
      <div class="workflow-card">
        <h4>${ex.tool}</h4>
        <p>${ex[('description_'+lang)] || ex.description_en}</p>
        <pre><code>${ex.commands.join('\n')}</code></pre>
      </div>`).join('')}
    <h3>Best Practices:</h3>
    <ul>${d.best_practices.map(b => `<li>${b[lang] || b.en}</li>`).join('')}</ul>`;
}

function renderSarahTim(d) {
  const el = document.getElementById('sarahTimContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box">${d.story[lang] || d.story.en}</div>
    <h3>Full Workflow with Commands:</h3>
    ${d.full_workflow.map(s => `
      <div class="workflow-card">
        <h4>Step ${s.step}: ${s[('title_'+lang)] || s.title_en}</h4>
        ${s.note_en ? `<p>${s[('note_'+lang)] || s.note_en}</p>` : ''}
        ${s.commands ? `<pre><code>${s.commands.join('\n')}</code></pre>` : ''}
      </div>`).join('')}
    <h3>OpenSSL Algorithms Comparison:</h3>
    <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
      <tr style="background:var(--bg3);"><th style="padding:.75rem; text-align:left;">Algorithm</th><th>Security</th><th>Use</th><th>Note</th></tr>
      ${d.openssl_algorithms.map(a => `<tr style="border-bottom:1px solid var(--brd);"><td style="padding:.75rem;"><code>${a.name}</code></td><td>${a.security}</td><td>${a.use}</td><td>${a.note}</td></tr>`).join('')}
    </table>`;
}

function renderKyber(d) {
  const el = document.getElementById('kyberContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box">${d.intro[lang] || d.intro.en}</div>
    <h3>Why Kyber?</h3>
    <ul>${d.why_kyber.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
    <h3>Kyber Variants:</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tr style="background:var(--bg3);"><th style="padding:.75rem; text-align:left;">Variant</th><th>Security</th><th>Use</th><th>Public Key</th><th>Private Key</th><th>Ciphertext</th></tr>
      ${d.kyber_variants.map(v => `<tr style="border-bottom:1px solid var(--brd);"><td style="padding:.75rem;"><code>${v.name}</code></td><td>${v.security}</td><td>${v.use}</td><td>${v.pubkey}</td><td>${v.privkey}</td><td>${v.ciphertext}</td></tr>`).join('')}
    </table>
    <h3>Implementation Examples:</h3>
    ${d.examples.map(ex => `
      <div class="workflow-card">
        <h4>${ex.tool}</h4>
        ${ex.install ? `<p><strong>Install:</strong> ${ex.install}</p>` : ''}
        ${ex.note_en ? `<p>${ex[('note_'+lang)] || ex.note_en}</p>` : ''}
        <pre><code>${(ex.commands || [ex.test]).join('\n')}</code></pre>
      </div>`).join('')}`;
}

function renderEmailProviders(d) {
  const el = document.getElementById('emailProvidersContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box"><strong>💡 Boldwelder:</strong> ${d.boldwelder_advice[lang] || d.boldwelder_advice.en}</div>
    <p><strong>Total providers: ${d.providers.length}</strong></p>
    <div class="email-grid">
      ${d.providers.map(p => `
        <div class="email-card">
          <h4>${p.name}</h4>
          <div class="email-meta">
            <span>Max: <span class="email-max">${p.max} chars</span></span>
            <span>Recommended: ${p.recommended}</span>
          </div>
          <p style="font-size:.75rem; color:var(--txt2); margin-top:.5rem;">${p.notes}</p>
        </div>`).join('')}
    </div>`;
}

function renderAnonymity(d) {
  const el = document.getElementById('anonymityContent'); if (!el) return;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box">${d.why_anonymous[lang] || d.why_anonymous.en}</div>
    ${d.levels.map(l => `
      <div class="workflow-card">
        <h4>Level ${l.level}: ${l.name} (${l.security})</h4>
        <p><strong>Use case:</strong> ${l.use_case}</p>
        <pre><code>${l.commands.join('\n')}</code></pre>
      </div>`).join('')}`;
}

function renderTextBrowsers(d) {
  const el = document.getElementById('textBrowsersContent'); if (!el) return;
  const t = d.text_browsers;
  const lang = window.i18n?.currentLang || 'en';
  el.innerHTML = `
    <div class="tip-box">${t[('intro_'+lang)] || t.intro_en}</div>
    <div class="browser-grid">
      ${t.browsers.map(b => `
        <div class="browser-card">
          <h4>${b.name}</h4>
          <p style="font-size:.875rem; color:var(--txt2);">${b.features}</p>
          <p style="font-size:.75rem;"><strong>Install:</strong> <code>${b.install}</code></p>
          <code>${b.usage}</code>
        </div>`).join('')}
    </div>
    <h3 style="margin-top:2rem;">${t[('full_workflow_'+lang)] || t.full_workflow_en}</h3>
    <pre><code>${t.workflow_commands.join('\n')}</code></pre>`;
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    const tgt = t.dataset.tab; document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    t.classList.add('active'); document.getElementById(`tab-${tgt}`).classList.add('active');
  }));
}

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
  document.querySelectorAll('a[href^="#"]').forEach(l => l.addEventListener('click', e => { const h = l.getAttribute('href'); if (h.length > 1) { e.preventDefault(); document.querySelector(h)?.scrollIntoView({behavior:'smooth'}); } }));
});
