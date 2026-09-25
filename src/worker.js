/**
 * ============================================================
 * Secure Password Database Generator - Cloudflare Worker
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 *
 * Ez a fő belépési pont a Cloudflare Worker-hez.
 * Kezeli az összes HTTP kérést és választ.
 *
 * ENDPOINTOK:
 * ┌─────────────────────┬──────────────────────────────────────┐
 * │ GET /               │ Üdvözlő üzenet (text/plain)          │
 * │ GET /health         │ Health check (JSON)                  │
 * │ GET /presets        │ Preset lista (JSON vagy text/plain)  │
 * │ GET /preset/:name   │ CSV letöltés (streaming, gzip)       │
 * │ GET /info/:name     │ Tanácsadás (text/plain)              │
 * └─────────────────────┴──────────────────────────────────────┘
 *
 * BIZTONSÁG:
 * - TLS 1.3 (Cloudflare automatikusan biztosítja)
 * - Nincs adattárolás (stateless, csak memória)
 * - Kriptográfiailag biztonságos random generálás
 *
 * BŐVÍTÉS: Új endpoint hozzáadásához adj hozzá egy új
 * handle... függvényt, és regisztráld a handleRequest-ben.
 */

import { getPreset, listPresets, getPresetStats } from './presets.js';
import { buildCharset } from './charsets.js';
import { generateCsvStream, estimateCsvSize } from './csvBuilder.js';
import {
  generateAdvice,
  generatePresetList,
  generateWelcome,
  DOCS_URL,
} from './advisor.js';

// ============================================================
// KONSTANSOK
// ============================================================

const VERSION = '0.1.0-beta.1';

/** Alapértelmezett response headers (minden válaszhoz) */
const BASE_HEADERS = {
  'X-Version': VERSION,
  'X-Powered-By': 'Secure-PassGen-Worker',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept-Encoding',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================

/**
 * JSON válasz generálása
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...BASE_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

/**
 * Text válasz generálása
 */
function textResponse(text, status = 200) {
  return new Response(text, {
    status,
    headers: {
      ...BASE_HEADERS,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

/**
 * Hiba válasz generálása
 */
function errorResponse(message, status = 400) {
  return jsonResponse({
    error: message,
    version: VERSION,
    timestamp: new Date().toISOString(),
  }, status);
}

// ============================================================
// FŐ REQUEST HANDLER
// ============================================================

/**
 * Fő request handler - routing logika
 *
 * @param {Request} request - Beérkező HTTP kérés
 * @returns {Response} HTTP válasz
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight (OPTIONS)
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: BASE_HEADERS });
  }

  // Csak GET kéréseket fogadunk el
  if (method !== 'GET') {
    return errorResponse('Only GET requests are allowed', 405);
  }

  // ── ROUTING ──────────────────────────────────────────────

  // GET / → Üdvözlő üzenet
  if (path === '/') {
    return handleWelcome();
  }

  // GET /health → Health check
  if (path === '/health') {
    return handleHealth();
  }

  // GET /presets → Preset lista
  if (path === '/presets') {
    return handlePresetList(request);
  }

  // GET /preset/:name → CSV letöltés
  if (path.startsWith('/preset/')) {
    const presetName = path.substring('/preset/'.length);
    return handlePresetDownload(presetName, url);
  }

  // GET /info/:name → Tanácsadás
  if (path.startsWith('/info/')) {
    const presetName = path.substring('/info/'.length);
    return handlePresetInfo(presetName);
  }

  // 404 - Ismeretlen endpoint
  return errorResponse(
    `Unknown endpoint: ${path}. Available: /, /health, /presets, /preset/:name, /info/:name`,
    404
  );
}

// ============================================================
// ENDPOINT HANDLERS
// ============================================================

/**
 * GET / - Üdvözlő üzenet
 */
function handleWelcome() {
  return textResponse(generateWelcome());
}

/**
 * GET /health - Health check
 */
function handleHealth() {
  const stats = getPresetStats();
  return jsonResponse({
    status: 'ok',
    version: VERSION,
    timestamp: new Date().toISOString(),
    presets: stats.total_presets,
    categories: stats.categories,
    max_length: stats.max_length,
    max_count: stats.max_count,
    runtime: 'Cloudflare Worker (stateless)',
    security: {
      tls: '1.3 (Cloudflare managed)',
      storage: 'none (passwords never stored)',
      random: 'crypto.getRandomValues (CSPRNG)',
    },
  });
}

/**
 * GET /presets - Preset lista
 *
 * Content negotiation:
 * - Accept: text/plain → formázott lista
 * - Accept: application/json (alapértelmezett) → JSON
 */
function handlePresetList(request) {
  const accept = request.headers.get('Accept') || '';

  // Ha text/plain-t kér, adjuk vissza a formázott listát
  if (accept.includes('text/plain') && !accept.includes('application/json')) {
    return textResponse(generatePresetList());
  }

  // Alapértelmezés: JSON
  const presets = listPresets();
  return jsonResponse({
    version: VERSION,
    total: presets.length,
    presets,
    docs_url: DOCS_URL,
  });
}

/**
 * GET /preset/:name - CSV letöltés (streaming)
 *
 * Query paraméterek (opcionális felülírás):
 * - count:    Jelszavak száma (alapértelmezett: preset.count)
 * - length:   Jelszó hossza (alapértelmezett: preset.length)
 * - batch:    Batch méret streaming-hez (alapértelmezett: 1000)
 *
 * Példa:
 *   GET /preset/email-32-10k?count=5000&length=64
 */
function handlePresetDownload(presetName, url) {
  // Preset validálás
  const preset = getPreset(presetName);
  if (!preset) {
    return errorResponse(
      `Unknown preset: ${presetName}. Use /presets to see available presets.`,
      404
    );
  }

  // Query paraméterek felülírhatják az alapértelmezett értékeket
  const count = parseInt(url.searchParams.get('count') || String(preset.count), 10);
  const length = parseInt(url.searchParams.get('length') || String(preset.length), 10);
  const batchSize = parseInt(url.searchParams.get('batch') || '1000', 10);

  // Entropia számítás a tényleges charset alapján
  const charsetNames = Array.isArray(preset.charset) ? preset.charset : [preset.charset];
  const charsetString = buildCharset(charsetNames, preset.excludeAmbiguous);
  const entropyBits = length * Math.log2(charsetString.length);

  try {
    // Méret becslés
    const sizeEstimate = estimateCsvSize({ count, length });

    // Streaming CSV generálás (memória-hatékony)
    const stream = generateCsvStream({
      count,
      length,
      charset: preset.charset,
      excludeAmbiguous: preset.excludeAmbiguous,
      batchSize,
    });

    // Response headers
    const headers = {
      ...BASE_HEADERS,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${presetName}_passwords.csv"`,
      'X-Preset': presetName,
      'X-Password-Length': String(length),
      'X-Password-Count': String(count),
      'X-Entropy-Bits': entropyBits.toFixed(1),
      'X-Estimated-Size-KB': String(sizeEstimate.estimatedKB),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    };

    return new Response(stream, { headers });

  } catch (err) {
    return errorResponse(`Error generating CSV: ${err.message}`, 500);
  }
}

/**
 * GET /info/:name - Tanácsadás
 *
 * A válasz egy szépen formázott text/plain szöveg,
 * amit a curl kiír a konzolra a letöltés után.
 */
function handlePresetInfo(presetName) {
  const advice = generateAdvice(presetName);
  return textResponse(advice);
}

// ============================================================
// WORKER ENTRY POINT (Cloudflare Workers ES Modules format)
// ============================================================

export default {
  /**
   * Fő fetch handler
   *
   * @param {Request} request - Beérkező HTTP kérés
   * @param {Object} env - Environment bindings (wrangler.toml [vars])
   * @param {Object} ctx - Execution context
   * @returns {Response} HTTP válasz
   */
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request);
    } catch (err) {
      // Váratlan hiba - logolás és 500 válasz
      console.error('Unhandled error:', err);
      return errorResponse(`Internal server error: ${err.message}`, 500);
    }
  },
};
