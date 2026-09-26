/**
 * ============================================================
 * Secure Password Generator - Cloudflare Worker v2.0
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * Date: 2026-09-25
 * ============================================================
 * 
 * ENDPOINTS:
 * ┌──────────────────────┬────────────────────────────────────────┐
 * │ GET /                │ Welcome message                        │
 * │ GET /health          │ Health check                           │
 * │ GET /presets         │ List all presets                       │
 * │ GET /preset/:name    │ Full CSV download (column layout)      │
 * │ GET /sample/:name    │ 10-password sample (for live demo)     │
 * │ GET /info/:name      │ Preset advice                          │
 * └──────────────────────┴────────────────────────────────────────┘
 * 
 * CSV FORMAT (v2.0 - Boldwelder Spec):
 * - Passwords only (no header, no metadata)
 * - Max 5000 rows, passwords arranged in columns
 * - UTF-8 BOM for Excel/LibreOffice compatibility
 */

import { getPreset, listPresets, getPresetStats } from './presets.js';
import { buildCharset } from './charsets.js';
import { generateCsvStream, estimateCsvSize, generateSampleCsv } from './csvBuilder.js';
import { generateAdvice, generatePresetList, generateWelcome, DOCS_URL } from './advisor.js';

const BASE_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function errorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({ error: message, version: '2.0.0', timestamp: new Date().toISOString() }),
    {
      status,
      headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: BASE_HEADERS });
  }

  if (method !== 'GET') {
    return errorResponse('Only GET requests are allowed', 405);
  }

  // ── ROUTING ──────────────────────────────────────────────
  if (path === '/') return handleWelcome();
  if (path === '/health') return handleHealth();
  if (path === '/presets') return handlePresetList(request);
  
  if (path.startsWith('/preset/')) {
    return handlePresetDownload(path.substring('/preset/'.length), url);
  }
  
  if (path.startsWith('/sample/')) {
    return handleSample(path.substring('/sample/'.length));
  }
  
  if (path.startsWith('/info/')) {
    return handlePresetInfo(path.substring('/info/'.length));
  }

  return errorResponse(`Unknown endpoint: ${path}`, 404);
}

function handleWelcome() {
  return new Response(generateWelcome(), {
    headers: { ...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

function handleHealth() {
  const stats = getPresetStats();
  return new Response(
    JSON.stringify({
      status: 'ok',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      presets: stats,
      csv_format: 'v2.0 - passwords only, max 5000 rows, column layout'
    }),
    {
      headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}

function handlePresetList(request) {
  const list = listPresets();
  const url = new URL(request.url);
  const format = url.searchParams.get('format');
  
  // TEXT format only if explicitly requested via ?format=text
  // DEFAULT is JSON (browsers expect JSON from fetch)
  if (format === 'text') {
    return new Response(generatePresetList(), {
      headers: { ...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
  
  // JSON by default (fixes "Failed to load presets" bug)
  return new Response(JSON.stringify(list, null, 2), {
    headers: { ...BASE_HEADERS, 'Content-Type': 'application/json' }
  });
}

/**
 * GET /preset/:name - Full CSV download (NEW column layout format)
 */
function handlePresetDownload(presetName, url) {
  const preset = getPreset(presetName);
  if (!preset) {
    return errorResponse(`Unknown preset: ${presetName}. Use /presets to see available presets.`, 404);
  }

  const count = parseInt(url.searchParams.get('count') || String(preset.count), 10);
  const length = parseInt(url.searchParams.get('length') || String(preset.length), 10);
  const batchSize = parseInt(url.searchParams.get('batch') || '1000', 10);

  const charsetNames = Array.isArray(preset.charset) ? preset.charset : [preset.charset];
  const charsetString = buildCharset(charsetNames, preset.excludeAmbiguous);
  const entropyBits = length * Math.log2(charsetString.length);
  const sizeEstimate = estimateCsvSize({ count, length });

  try {
    const stream = generateCsvStream({
      count, length, charset: preset.charset,
      excludeAmbiguous: preset.excludeAmbiguous, batchSize
    });

    return new Response(stream, {
      headers: {
        ...BASE_HEADERS,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${presetName}_${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15)}.csv"`,
        'X-Preset': presetName,
        'X-Password-Length': String(length),
        'X-Password-Count': String(count),
        'X-CSV-Format': 'v2.0-column-layout',
        'X-Layout': sizeEstimate.layout,
        'X-Rows': String(sizeEstimate.rows),
        'X-Columns': String(sizeEstimate.cols),
        'X-Entropy-Bits': entropyBits.toFixed(1),
        'X-Estimated-Size-KB': String(sizeEstimate.estimatedKB),
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err) {
    return errorResponse(`Error generating CSV: ${err.message}`, 500);
  }
}

/**
 * GET /sample/:name - 10-password sample for live demo (single column)
 */
function handleSample(presetName) {
  const preset = getPreset(presetName);
  if (!preset) {
    return errorResponse(`Unknown preset: ${presetName}`, 404);
  }

  try {
    const sample = generateSampleCsv({
      length: preset.length,
      charset: preset.charset,
      excludeAmbiguous: preset.excludeAmbiguous,
      sampleCount: 10
    });

    return new Response(sample, {
      headers: {
        ...BASE_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Sample-Count': '10',
        'X-Password-Length': String(preset.length),
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return errorResponse(`Error: ${err.message}`, 500);
  }
}

function handlePresetInfo(presetName) {
  const preset = getPreset(presetName);
  if (!preset) {
    return errorResponse(`Unknown preset: ${presetName}`, 404);
  }
  return new Response(generateAdvice(preset), {
    headers: { ...BASE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request);
    } catch (err) {
      console.error('Unhandled error:', err);
      return errorResponse(`Internal server error: ${err.message}`, 500);
    }
  }
};