const DEMO_WORKER = "https://secure-password-generator.boldwelderwx.workers.dev";

async function runDemo() {
  const preset = document.getElementById('demoPreset').value;
  const btn = document.querySelector('.demo-controls .btn-primary');
  const output = document.getElementById('demoOutput');
  
  if (!btn || !output) return;
  
  btn.disabled = true;
  btn.innerHTML = '⏳ Generating...';
  output.innerHTML = '<div class="demo-placeholder">Contacting Worker...</div>';
  
  try {
    const response = await fetch(DEMO_WORKER + '/preset/' + preset);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    
    const text = await response.text();
    const lines = text.split('\n').filter(x => x.trim());
    const sample = lines.slice(0, 11);
    
    let html = '<span style="color:#64748b">// Preset: ' + preset + '</span>\n';
    html += '<span style="color:#64748b">// Total entries: ' + (lines.length - 1).toLocaleString() + '</span>\n\n';
    
    sample.forEach((line, i) => {
      if (i === 0) {
        html += '<span style="color:#94a3b8">' + line + '</span>\n';
      } else {
        html += '<span style="color:#10b981">' + i + '.</span> ' + line.split(',')[0] + '\n';
      }
    });
    
    html += '\n<span style="color:#64748b">// ... ' + (lines.length - 11).toLocaleString() + ' more</span>';
    output.innerHTML = html;
    
  } catch(e) {
    output.innerHTML = '<span style="color:#ef4444">❌ Error: ' + e.message + '</span>\n\n' +
      '<span style="color:#64748b">Possible causes:\n' +
      '1. Cloudflare rate limit (100K req/day free)\n' +
      '2. Network timeout\n' +
      '3. CORS issue (try curl from terminal)</span>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Generate 10 Sample Passwords';
  }
}

// Bind button properly
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelector('.demo-controls .btn-primary');
  if (btn) {
    btn.addEventListener('click', runDemo);
  }
});

window.runDemo = runDemo;
