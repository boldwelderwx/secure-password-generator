// ═══════════════════════════════════════════════════════════
// app.js - Main application (progressive loading)
// ═══════════════════════════════════════════════════════════

"use strict";

(function() {
  const WORKER = "https://secure-password-generator.boldwelderwx.workers.dev";
  
  // ─── Content sections (HTML strings) ───────────────
  const sections = {
    nav: `<nav class="sticky-nav"><div class="container"><div class="nav-content">
      <a href="#what-is-curl" class="nav-link">🆘 Beginner</a>
      <a href="#demo" class="nav-link">Demo</a>
      <a href="#openssl" class="nav-link">🔐 OpenSSL</a>
      <a href="#gnupg" class="nav-link">🔑 GnuPG</a>
      <a href="#kyber" class="nav-link">🛡️ Kyber</a>
      <a href="#open-handling" class="nav-link">Open Handling</a>
      <a href="#boldwelder" class="nav-link">💡 4096</a>
      <a href="#sarah-tim" class="nav-link">Keys</a>
      <a href="#presets" class="nav-link">Presets</a>
      <a href="#email-providers" class="nav-link">📧 Email</a>
      <a href="#crypto" class="nav-link">Crypto</a>
      <a href="#steganography" class="nav-link">Steg</a>
      <a href="#anonymity" class="nav-link">🕵️ Tor</a>
      <a href="#text-browsers" class="nav-link">📟 Text</a>
    </div></div></nav>`,
    
    curl: `<section id="what-is-curl" class="section">
      <div class="section-header">
        <h2>🆘 What is "curl"? A Beginner's Guide</h2>
        <p class="section-subtitle">Never heard of curl? This explains everything step by step.</p>
      </div>
      <div class="info-card">
        <h3>What is curl?</h3>
        <p><strong>curl</strong> (Client URL) is a free tool that lets your computer talk to websites from a text window called a "terminal" or "console". Think of it as a robot that visits websites for you. <strong>It's already installed on most computers!</strong></p>
      </div>
      <div class="info-card">
        <h3>How to open the console</h3>
        <div class="tabs">
          <button class="tab active" data-tab="windows">🪟 Windows</button>
          <button class="tab" data-tab="mac">🍎 Mac</button>
          <button class="tab" data-tab="linux">🐧 Linux</button>
          <button class="tab" data-tab="phone">📱 Phone</button>
        </div>
        <div class="tab-content active" id="tab-windows">
          <h4>Windows 10 / 11</h4>
          <ol>
            <li>Press <kbd>Windows</kbd> key</li>
            <li>Type <code>cmd</code> or <code>powershell</code></li>
            <li>Press <kbd>Enter</kbd></li>
            <li>Type <code>curl --version</code> to verify</li>
          </ol>
          <p>If not found: <a href="https://curl.se/windows/" target="_blank">Download curl for Windows</a></p>
        </div>
        <div class="tab-content" id="tab-mac">
          <h4>macOS</h4>
          <ol>
            <li>Press <kbd>Cmd ⌘</kbd> + <kbd>Space</kbd></li>
            <li>Type <code>Terminal</code> and press <kbd>Enter</kbd></li>
            <li>curl is pre-installed. Type <code>curl --version</code> to verify.</li>
          </ol>
        </div>
        <div class="tab-content" id="tab-linux">
          <h4>Linux (Ubuntu, Debian, Parrot, Kali, Fedora)</h4>
          <ol>
            <li>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd></li>
            <li>curl is usually pre-installed</li>
            <li>If missing: <code>sudo apt install curl</code> (Debian/Ubuntu)</li>
          </ol>
        </div>
        <div class="tab-content" id="tab-phone">
          <h4>📱 Phone / Tablet</h4>
          <ul>
            <li><strong>iPhone:</strong> Install "a-Shell" from App Store</li>
            <li><strong>Android:</strong> Install "Termux" from F-Droid</li>
            <li><strong>Best:</strong> Use a computer for this tool</li>
          </ul>
        </div>
      </div>
      <div class="info-card">
        <h3>Your first curl command</h3>
        <p>Copy this, paste in your console, press Enter:</p>
        <pre><code class="language-bash">curl ${WORKER}</code></pre>
        <p><strong>What should happen:</strong> A welcome message appears. If you see it, you're ready!</p>
      </div>
      <div class="tip-box">
        <strong>💡 Tip</strong>
        <p>Whenever this site shows a <code>curl</code> command, click the <strong>Copy</strong> button on the code box, paste it into your console (<kbd>Ctrl</kbd>+<kbd>V</kbd>), and press <kbd>Enter</kbd>.</p>
      </div>
    </section>`,
    
    openssl: `<section id="openssl" class="section">
      <div class="section-header">
        <h2>🔐 OpenSSL - Latest Version (Source Compile)</h2>
        <p class="section-subtitle">Boldwelder Recommendation: Always compile from source for maximum security</p>
      </div>
      
      <div class="warning-box">
        <strong>⚠️ Boldwelder's Recommendation</strong>
        <p><strong>Always compile OpenSSL from the latest source code on GitHub.</strong> Pre-built binaries may be outdated, compromised, or lack the newest algorithms (like ML-KEM/Kyber). Compiling from source ensures you have the most secure, auditable, and up-to-date version.</p>
      </div>
      
      <div class="info-card">
        <h3>Official Downloads & Source</h3>
        <ul class="download-list">
          <li><strong>Latest Release:</strong> <a href="https://github.com/openssl/openssl/releases" target="_blank" rel="noopener">github.com/openssl/openssl/releases</a> (3.5.8 current)</li>
          <li><strong>Official Source:</strong> <a href="https://www.openssl.org/source/" target="_blank" rel="noopener">openssl.org/source</a></li>
          <li><strong>GitHub Repo:</strong> <a href="https://github.com/openssl/openssl" target="_blank" rel="noopener">github.com/openssl/openssl</a></li>
          <li><strong>Binaries (Windows):</strong> <a href="https://github.com/openssl/openssl/wiki/Binaries" target="_blank" rel="noopener">OpenSSL Wiki - Binaries</a></li>
          <li><strong>Documentation:</strong> <a href="https://docs.openssl.org/" target="_blank" rel="noopener">docs.openssl.org</a></li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>Compile from Source (Linux/macOS)</h3>
        <pre><code class="language-bash"># Download latest source
cd /tmp
git clone https://github.com/openssl/openssl.git
cd openssl

# Configure (optimize for your CPU)
./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl   shared zlib enable-ec_nistp_64_gcc_128

# Compile (use all CPU cores)
make -j$(nproc)

# Test (important!)
make test

# Install
sudo make install

# Verify
/usr/local/ssl/bin/openssl version
# Should show: OpenSSL 3.5.x (latest)</code></pre>
      </div>
      
      <div class="info-card">
        <h3>Verify Integrity of Downloads</h3>
        <p>Always verify PGP signatures before compiling:</p>
        <pre><code class="language-bash"># Download signature file
wget https://www.openssl.org/source/openssl-3.5.8.tar.gz.asc

# Import OpenSSL team key
gpg --keyserver keyserver.ubuntu.com --recv-keys   EFC0A467D613CB83C7ED6D30D894E2CE8B3D79F5

# Verify
gpg --verify openssl-3.5.8.tar.gz.asc openssl-3.5.8.tar.gz
# Must say: "Good signature"</code></pre>
      </div>
      
      <div class="success-box">
        <strong>✅ Why Source Compile?</strong>
        <p>• Latest algorithms (ML-KEM, ML-DSA, SLH-DSA)<br>
        • Full security audit trail<br>
        • No pre-compiled binary risks<br>
        • Optimized for your specific CPU<br>
        • Transparent and verifiable</p>
      </div>
    </section>`,
    
    gnupg: `<section id="gnupg" class="section">
      <div class="section-header">
        <h2>🔑 GnuPG - Integrity & Quality Verification</h2>
        <p class="section-subtitle">Always verify GPG software integrity before use</p>
      </div>
      
      <div class="warning-box">
        <strong>⚠️ Critical: Always Verify GnuPG Integrity</strong>
        <p>GnuPG security is <strong>time-limited and must be verified continuously</strong>. The GnuPG project maintains quality guarantees for specific periods, and you must regularly check the official website for updates, security advisories, and signature validity. <strong>Never trust a GnuPG binary without verifying its PGP signature.</strong></p>
      </div>
      
      <div class="info-card">
        <h3>Official GnuPG Resources</h3>
        <ul class="download-list">
          <li><strong>Integrity Check:</strong> <a href="https://www.gnupg.org/download/integrity_check.html" target="_blank" rel="noopener">gnupg.org/download/integrity_check.html</a></li>
          <li><strong>Download Page:</strong> <a href="https://www.gnupg.org/download/" target="_blank" rel="noopener">gnupg.org/download</a></li>
          <li><strong>Signature Keys:</strong> <a href="https://www.gnupg.org/signature_key.html" target="_blank" rel="noopener">gnupg.org/signature_key.html</a></li>
          <li><strong>Security Advisories:</strong> <a href="https://www.gnupg.org/documentation/" target="_blank" rel="noopener">gnupg.org/documentation</a></li>
          <li><strong>Source Code:</strong> <a href="https://git.gnupg.org/cgi-bin/gitweb.cgi" target="_blank" rel="noopener">git.gnupg.org</a></li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>Verify GnuPG Installation (Step by Step)</h3>
        <pre><code class="language-bash"># 1. Download GnuPG and signature
wget https://gnupg.org/ftp/gcrypt/gnupg/gnupg-2.4.5.tar.bz2
wget https://gnupg.org/ftp/gcrypt/gnupg/gnupg-2.4.5.tar.bz2.sig

# 2. Import the official GnuPG signing key
# Check gnupg.org/signature_key.html for current key ID
gpg --keyserver hkps://keys.openpgp.org --recv-keys   6DAA6E64A76D6E6227F4EA65E058D4A80B4DCC67

# 3. Verify the signature
gpg --verify gnupg-2.4.5.tar.bz2.sig gnupg-2.4.5.tar.bz2
# MUST output: "Good signature from [GnuPG team]"
# If it says "BAD signature" - DO NOT USE THE FILE!

# 4. Verify SHA256 checksum (second layer of verification)
sha256sum gnupg-2.4.5.tar.bz2
# Compare with value on gnupg.org/download/integrity_check.html</code></pre>
      </div>
      
      <div class="info-card">
        <h3>Regular Verification Schedule</h3>
        <ul>
          <li><strong>Before every install:</strong> Verify signature of downloaded package</li>
          <li><strong>Monthly:</strong> Check <a href="https://www.gnupg.org/download/integrity_check.html" target="_blank">gnupg.org/download/integrity_check.html</a> for updates</li>
          <li><strong>After security news:</strong> Verify your installed version is not affected by CVEs</li>
          <li><strong>Before signing important data:</strong> Verify GnuPG binary integrity on your system</li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>Verify Installed GnuPG Binary</h3>
        <pre><code class="language-bash"># Check your GnuPG version
gpg --version

# Check which package installed it (Debian/Ubuntu)
dpkg -S $(which gpg)

# Verify package integrity (Debian/Ubuntu)
sudo debsums gnupg

# Check signature of any file you download
gpg --verify downloaded-file.sig downloaded-file</code></pre>
      </div>
    </section>`,
    
    kyber: `<section id="kyber" class="section">
      <div class="section-header">
        <h2>🛡️ Kyber / ML-KEM Post-Quantum Encryption</h2>
        <p class="section-subtitle">NIST FIPS 203 standard - native in OpenSSL 3.5+</p>
      </div>
      <div id="kyberContent"></div>
    </section>`,
    
    openHandling: `<section id="open-handling" class="section">
      <div class="section-header">
        <h2>🆕 Open Password Handling - Excel Cell Reference</h2>
        <p class="section-subtitle">Reference passwords via Excel cell coordinates worn on clothing</p>
      </div>
      <div id="openHandlingContent"></div>
    </section>`,
    
    boldwelder: `<section id="boldwelder" class="section">
      <div class="section-header">
        <h2>💡 Boldwelder Recommendations - 4096 Character Passwords</h2>
        <p class="section-subtitle">Best practices from years of security research</p>
      </div>
      <div id="boldwelderContent"></div>
    </section>`,
    
    sarahTim: `<section id="sarah-tim" class="section">
      <div class="section-header">
        <h2>🔑 Sarah & Tim: Public/Private Key Story</h2>
        <p class="section-subtitle">Learn public-key cryptography with complete OpenSSL commands</p>
      </div>
      <div id="sarahTimContent"></div>
    </section>`,
    
    presets: `<section id="presets" class="section">
      <div class="section-header">
        <h2>📦 50+ Professional Presets</h2>
        <p class="section-subtitle">Click any preset to copy the curl command. Paste it into your console!</p>
      </div>
      <div class="category-filter" id="categoryFilter"></div>
      <div class="presets-grid" id="presetsGrid"></div>
    </section>`,
    
    emailProviders: `<section id="email-providers" class="section">
      <div class="section-header">
        <h2>📧 100+ Email Provider Password Limits</h2>
        <p class="section-subtitle">Maximum password length for every major email provider</p>
      </div>
      <div id="emailProvidersContent"></div>
    </section>`,
    
    crypto: `<section id="crypto" class="section">
      <div class="section-header">
        <h2>🔐 Cryptography Tools & Guides</h2>
        <p class="section-subtitle">OpenSSL, GPG, VeraCrypt, LUKS with full examples</p>
      </div>
      <div class="tools-grid" id="cryptoGrid"></div>
    </section>`,
    
    steganography: `<section id="steganography" class="section">
      <div class="section-header">
        <h2>🎨 Steganography - Hidden in Plain Sight</h2>
        <p class="section-subtitle">Hide password databases inside images, audio, video</p>
      </div>
      <div class="tools-grid" id="stegGrid"></div>
    </section>`,
    
    anonymity: `<section id="anonymity" class="section">
      <div class="section-header">
        <h2>🕵️ Complete Anonymity Stack</h2>
        <p class="section-subtitle">Tor, Proxychains, VPN, Whonix, Tails - from basic to Snowden-level</p>
      </div>
      <div id="anonymityContent"></div>
    </section>`,
    
    textBrowsers: `<section id="text-browsers" class="section">
      <div class="section-header">
        <h2>📟 Terminal Browsers for Maximum Anonymity</h2>
        <p class="section-subtitle">w3m, links2, lynx, elinks - no JavaScript, no tracking</p>
      </div>
      <div id="textBrowsersContent"></div>
    </section>`
  };
  
  // ─── Render content progressively ────────────────
  function renderContent() {
    const loader = document.getElementById('contentLoader');
    if (!loader) return;
    
    // Render in priority order (critical content first)
    const order = [
      'nav', 'curl', 'openssl', 'gnupg', 'demo', 'kyber',
      'openHandling', 'boldwelder', 'sarahTim', 'presets',
      'emailProviders', 'crypto', 'steganography', 'anonymity', 'textBrowsers'
    ];
    
    // Add demo section manually
    sections.demo = `<section id="demo" class="section demo-section">
      <div class="section-header">
        <h2>🎯 Live Demo</h2>
        <p class="section-subtitle">Test directly in browser - no installation needed</p>
      </div>
      <div class="demo-container">
        <div class="demo-controls">
          <div class="control-group">
            <label for="demoPreset">Preset</label>
            <select id="demoPreset">
              <option value="email-standard-32-10k">Email Standard (32 chars, 10K)</option>
              <option value="bank-standard-32-10k">Banking (32 chars, 10K)</option>
              <option value="military-nato-256-10k">NATO Military (256 chars, 10K)</option>
              <option value="gov-hu-32-10k">🇭🇺 Hungarian Gov (32 chars, 10K)</option>
              <option value="crypto-wallet-128-10k">Crypto Wallet (128 chars, 10K)</option>
              <option value="extreme-4096-100k">Extreme (4096 chars, 100K)</option>
            </select>
          </div>
          <button id="demoBtn" class="btn btn-primary">Generate 10 Sample Passwords</button>
        </div>
        <div class="demo-output" id="demoOutput">
          <div class="demo-placeholder">👆 Click the button to see sample passwords</div>
        </div>
        <p class="demo-info">ℹ️ This calls the live server. Passwords are never stored.</p>
      </div>
    </section>`;
    
    loader.innerHTML = order.map(key => sections[key]).join('');
    
    // Re-attach demo button handler
    const btn = document.getElementById('demoBtn');
    if (btn) btn.addEventListener('click', window.runDemo);
  }
  
  // ─── Presets ─────────────────────────────────────
  async function loadPresets() {
    const grid = document.getElementById('presetsGrid');
    const filter = document.getElementById('categoryFilter');
    if (!grid || !filter) return;
    
    try {
      const r = await fetch(`${WORKER}/presets`);
      const data = await r.json();
      renderPresets(data.presets || [], grid, filter);
    } catch (e) {
      grid.innerHTML = '<div class="tip-box">⚠️ Failed to load presets. Check internet.</div>';
    }
  }
  
  function renderPresets(presets, grid, filter) {
    const cats = [...new Set(presets.map(p => p.category))].sort();
    
    filter.innerHTML = '<button class="category-btn active" data-cat="all">All</button>' +
      cats.map(c => `<button class="category-btn" data-cat="${c}">${c}</button>`).join('');
    
    filter.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filter.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        grid.querySelectorAll('.preset-card').forEach(c => {
          c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
    
    grid.innerHTML = presets.map(p => `
      <div class="preset-card" data-cat="${p.category}" data-preset="${p.name}" tabindex="0" role="button">
        <span class="preset-category">${p.category}</span>
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <div class="preset-meta">
          <span>📏 ${p.length.toLocaleString()} chars</span>
          <span>📊 ${p.count.toLocaleString()}</span>
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
    const cmd = `curl --compressed ${WORKER}/preset/${name} -o ` + name + '_' + new Date().toISOString().replace(/[-:T]/g,'').slice(0,15) + `.csv`;
    const msg = `📋 Command copied!

${cmd}

📝 What to do:
1. Open your console (see Beginner Guide above)
2. Paste this command (Ctrl+V or Cmd+V)
3. Press Enter
4. The file "` + name + '_' + new Date().toISOString().replace(/[-:T]/g,'').slice(0,15) + `.csv" downloads to your current folder

💡 The CSV uses column layout (max 5000 rows, passwords only).
   Open in Excel/LibreOffice - it works perfectly!`;
    
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
  
  // ─── JSON loader ─────────────────────────────────
  async function loadJSON(url, renderer) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      renderer(data);
      if (typeof Prism !== 'undefined') Prism.highlightAll();
    } catch (e) {
      console.error(`Failed to load ${url}:`, e);
    }
  }
  
  // ─── Tabs ────────────────────────────────────────
  function setupTabs() {
    document.querySelectorAll('.tabs').forEach(group => {
      group.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const section = tab.closest('section') || tab.closest('.info-card') || document.body;
          section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const el = document.getElementById(`tab-${target}`);
          if (el) el.classList.add('active');
        });
      });
    });
  }
  
  // ─── Smooth scroll ──────────────────────────────
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
  
  // ─── Escaping & helpers ─────────────────────────
  function esc(str) { return String(str ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }
  function code(b, lang='bash') { return `<pre class="language-${lang}"><code class="language-${lang}">${esc(b)}</code></pre>`; }
  
  // ─── Renderers ──────────────────────────────────
  function renderOpenHandling(d) {
    const el = document.getElementById('openHandlingContent');
    if (!el || !d) return;
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><strong>💡 The Idea</strong><p>${d.concept[lang] || d.concept.en}</p></div>
      <h3>Step-by-Step Workflow</h3>
      <div class="workflow-card"><ol>${d.workflow.map(s => `<li><strong>Step ${s.step}:</strong> ${s[lang] || s.en}</li>`).join('')}</ol></div>
      <h3>Commands</h3>
      ${code(d.commands.generate)}
      <p><strong>Import to Excel:</strong> ${d.commands.import_excel}</p>
      <p><strong>Import to LibreOffice:</strong> ${d.commands.import_libre}</p>
      <h3>Security Notes</h3>
      <ul>${d.security_notes.map(n => `<li>${n[lang] || n.en}</li>`).join('')}</ul>
      <div class="tip-box"><strong>💡 Boldwelder Tip</strong><p>${d.boldwelder_tip[lang] || d.boldwelder_tip.en}</p></div>`;
  }
  
  function renderBoldwelder(d) {
    const el = document.getElementById('boldwelderContent');
    if (!el || !d) return;
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><strong>💡 Philosophy</strong><p>${d.philosophy[lang] || d.philosophy.en}</p></div>
      <h3>Why 4096 characters?</h3>
      <ul>${d.why_4096.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
      <h3>OpenSSL Examples with -passfile</h3>
      ${d.openssl_passfile_examples.map(ex => `
        <div class="workflow-card">
          <h4>🔐 ${ex.tool}</h4>
          <p>${ex['description_'+lang] || ex.description_en}</p>
          ${code(ex.commands.join('\n'))}
        </div>`).join('')}
      <h3>Best Practices</h3>
      <ul>${d.best_practices.map(b => `<li>${b[lang] || b.en}</li>`).join('')}</ul>`;
  }
  
  function renderSarahTim(d) {
    const el = document.getElementById('sarahTimContent');
    if (!el || !d) return;
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><p>${d.story[lang] || d.story.en}</p></div>
      <h3>Complete Workflow with OpenSSL Commands</h3>
      ${d.full_workflow.map(s => `
        <div class="workflow-card">
          <h4>Step ${s.step}: ${s['title_'+lang] || s.title_en}</h4>
          ${s.note_en ? `<p>${s['note_'+lang] || s.note_en}</p>` : ''}
          ${s.commands ? code(s.commands.join('\n')) : ''}
        </div>`).join('')}
      <h3>OpenSSL Algorithms Comparison</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Algorithm</th><th>Security</th><th>Use</th><th>Note</th></tr></thead>
          <tbody>${d.openssl_algorithms.map(a => `<tr><td><code>${a.name}</code></td><td>${a.security}</td><td>${a.use}</td><td>${a.note}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  }
  
  function renderKyber(d) {
    const el = document.getElementById('kyberContent');
    if (!el || !d) return;
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><p>${d.intro[lang] || d.intro.en}</p></div>
      <h3>Why Kyber / ML-KEM?</h3>
      <ul>${d.why_kyber.map(r => `<li>${r[lang] || r.en}</li>`).join('')}</ul>
      <h3>Kyber Variants</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Variant</th><th>Security</th><th>Use</th><th>Public</th><th>Private</th><th>Ciphertext</th></tr></thead>
        <tbody>${d.kyber_variants.map(v => `<tr><td><code>${v.name}</code></td><td>${v.security}</td><td>${v.use}</td><td>${v.pubkey}</td><td>${v.privkey}</td><td>${v.ciphertext}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3>Implementation Examples (OpenSSL 3.5+)</h3>
      ${d.examples.map(ex => `
        <div class="workflow-card">
          <h4>🛡️ ${ex.tool}</h4>
          ${ex.install ? `<p><strong>Install:</strong> <code>${ex.install}</code></p>` : ''}
          ${ex.note_en ? `<p>${ex['note_'+lang] || ex.note_en}</p>` : ''}
          ${code((ex.commands || [ex.test]).join('\n'))}
        </div>`).join('')}`;
  }
  
  function renderEmailProviders(d) {
    const el = document.getElementById('emailProvidersContent');
    if (!el || !d) return;
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><strong>💡 Boldwelder</strong><p>${d.boldwelder_advice[lang] || d.boldwelder_advice.en}</p></div>
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
    const lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><p>${d.why_anonymous[lang] || d.why_anonymous.en}</p></div>
      ${d.levels.map(l => `
        <div class="workflow-card">
          <h4>Level ${l.level}: ${l.name} <span style="color:var(--txt3)">(${l.security})</span></h4>
          <p><strong>Use case:</strong> ${l.use_case}</p>
          ${code(l.commands.join('\n'))}
        </div>`).join('')}`;
  }
  
  function renderTextBrowsers(d) {
    const el = document.getElementById('textBrowsersContent');
    if (!el || !d?.text_browsers) return;
    const t = d.text_browsers, lang = window.I18n?.lang || 'en';
    el.innerHTML = `
      <div class="tip-box"><p>${t['intro_'+lang] || t.intro_en}</p></div>
      <div class="browser-grid">
        ${t.browsers.map(b => `
          <div class="browser-card">
            <h4>${b.name}</h4>
            <p>${b.features}</p>
            <p><strong>Install:</strong> <code>${b.install}</code></p>
            ${code(b.usage)}
          </div>`).join('')}
      </div>
      <h3 style="margin-top:1.5rem">${t['full_workflow_'+lang] || t.full_workflow_en}</h3>
      ${code(t.workflow_commands.join('\n'))}`;
  }
  
  function renderCrypto() {
    const el = document.getElementById('cryptoGrid');
    if (!el) return;
    const tools = [
      { icon: '🔐', name: 'OpenSSL AES-256-CBC', desc: 'Industry-standard symmetric encryption', code: `# Encrypt file
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 1000000 \
  -in secret.pdf -out secret.enc

# Decrypt
openssl enc -d -aes-256-cbc -pbkdf2 -iter 1000000 \
  -in secret.enc -out secret.pdf` },
      { icon: '🔑', name: 'GPG Symmetric', desc: 'Encrypt with passphrase', code: `# Encrypt
gpg --symmetric --cipher-algo AES256 \
  -o secret.pdf.gpg secret.pdf

# Decrypt
gpg --decrypt -o secret.pdf secret.pdf.gpg` },
      { icon: '💾', name: 'VeraCrypt', desc: 'Encrypted containers with plausible deniability', code: `# Create 1GB container
veracrypt --create --size 1G --encryption AES \
  --hash SHA-512 passwords.hc

# Mount
veracrypt passwords.hc /mnt/crypt` },
      { icon: '🔒', name: 'LUKS Full Disk', desc: 'Linux native full disk encryption', code: `# Format partition
sudo cryptsetup luksFormat /dev/sdb1

# Open
sudo cryptsetup luksOpen /dev/sdb1 secure
sudo mount /dev/mapper/secure /mnt/secure` },
      { icon: '🗝️', name: 'age (Modern)', desc: 'Simple, modern alternative to GPG', code: `# Generate key
age-keygen -o key.txt

# Encrypt
age -r age1... -o file.age file

# Decrypt
age -d -i key.txt file.age > file` },
      { icon: '🔓', name: 'pass (Unix)', desc: 'Standard Unix password manager', code: `# Initialize
pass init "Your GPG Key ID"

# Add password
pass insert email/gmail

# Retrieve
pass email/gmail` }
    ];
    el.innerHTML = tools.map(t => `
      <div class="tool-card">
        <h3>${t.icon} ${t.name}</h3>
        <p>${t.desc}</p>
        ${code(t.code)}
      </div>`).join('');
  }
  
  function renderSteg() {
    const el = document.getElementById('stegGrid');
    if (!el) return;
    const tools = [
      { icon: '🖼️', name: 'Steghide', desc: 'Hide data in JPEG/BMP/WAV files', code: `# Hide CSV in image
steghide embed -cf cover.jpg -ef ` + name + '_' + new Date().toISOString().replace(/[-:T]/g,'').slice(0,15) + `.csv \
  -p "passphrase" -sf stego.jpg

# Extract
steghide extract -sf stego.jpg -p "passphrase"` },
      { icon: '🎨', name: 'OpenStego', desc: 'Java-based with watermarking', code: `# Hide data
java -jar openstego.jar embed \
  -mf ` + name + '_' + new Date().toISOString().replace(/[-:T]/g,'').slice(0,15) + `.csv -cf cover.png \
  -sf stego.png -p passphrase

# Extract
java -jar openstego.jar extract \
  -sf stego.png -xf out.csv -p passphrase` },
      { icon: '🎵', name: 'DeepSound', desc: 'Hide in audio files (MP3/WAV/FLAC)', code: `# Windows tool
# https://jpinsoft.com/deepsound

# CLI alternative
pip install audio-stego
audio-stego hide input.mp3 pw.csv output.mp3` },
      { icon: '📝', name: 'Snow (Whitespace)', desc: 'Hide in text using end-of-line spaces', code: `# Hide message
stegsnow -C -m "secret" -p "key" \
  input.txt output.txt

# Extract
stegsnow -C -p "key" output.txt` }
    ];
    el.innerHTML = tools.map(t => `
      <div class="tool-card">
        <h3>${t.icon} ${t.name}</h3>
        <p>${t.desc}</p>
        ${code(t.code)}
      </div>`).join('');
  }
  
  // ─── Init ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    loadPresets();
    renderCrypto();
    renderSteg();
    loadJSON('content/open-password-handling.json', renderOpenHandling);
    loadJSON('content/boldwelder-recommendations.json', renderBoldwelder);
    loadJSON('content/sarah-tim.json', renderSarahTim);
    loadJSON('content/kyber.json', renderKyber);
    loadJSON('content/email-providers.json', renderEmailProviders);
    loadJSON('content/tor-guide.json', renderAnonymity);
    loadJSON('content/tor-guide.json', d => renderTextBrowsers(d));
    setupTabs();
    setupSmoothScroll();
    console.log('✅ App v4.0 initialized');
  });
  
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
