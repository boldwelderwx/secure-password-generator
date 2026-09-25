import { Hono } from 'hono';
import { getPreset, listPresets } from './src/presets.js';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    presets: listPresets().length,
    timestamp: new Date().toISOString()
  });
});

app.get('/presets', (c) => {
  return c.json({
    presets: listPresets(),
    total: listPresets().length
  });
});

export default {
  fetch: app.fetch
};

// Lokális szerver indítása
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = 8787;
  console.log(`🚀 Test server starting on http://127.0.0.1:${port}`);
  
  const server = Bun.serve({
    port,
    hostname: '127.0.0.1',
    fetch: app.fetch
  });
  
  console.log(`✅ Server running at http://127.0.0.1:${port}`);
}
