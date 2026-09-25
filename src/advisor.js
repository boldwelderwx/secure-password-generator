/**
 * ============================================================
 * Secure Password Database Generator - Advisor Module
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 *
 * Ez a modul generálja a felhasználónak szóló tanácsadást,
 * ami a letöltés után íródik ki a konzolra.
 *
 * A tanácsadás tartalmazza:
 * - Preset információk (hossz, darabszám, entropia)
 * - Ajánlott szolgáltatások listája
 * - Nem ajánlott szolgáltatások listája
 * - Biztonsági tippek
 * - További preset ajánlások
 * - Link a teljes dokumentációra
 *
 * A tanácsadás nyelve: ANGOL (nemzetközi szoftver)
 * A jövőben bővíthető többnyelvű támogatással (i18n).
 *
 * BŐVÍTÉS: Új kategória hozzáadásához adj hozzá egy új
 * bejegyzést a CATEGORY_INFO objektumhoz.
 */

import { getPreset, listPresets, getCategories, getPresetStats } from './presets.js';
import { buildCharset } from './charsets.js';

// ============================================================
// KONSTANSOK
// ============================================================

/** Dokumentáció URL (GitHub Pages) */
export const DOCS_URL = 'https://boldwelderwx.github.io/secure-passgen';

/** Worker base URL */
export const WORKER_BASE_URL = 'https://secure-password-generator.boldwelderwx.workers.dev';

/** Vízszintes elválasztó vonal */
const DIVIDER = '═'.repeat(60);

/** Kategória ikonok és nevek */
export const CATEGORY_INFO = {
  email:      { icon: '📧', label: 'Email Services' },
  social:     { icon: '📱', label: 'Social Media' },
  bank:       { icon: '🏦', label: 'Banking & Finance' },
  government: { icon: '🏛️', label: 'Government' },
  corporate:  { icon: '💼', label: 'Corporate' },
  developer:  { icon: '💻', label: 'Developer' },
  shopping:   { icon: '🛒', label: 'Shopping' },
  cloud:      { icon: '☁️', label: 'Cloud Storage' },
  gaming:     { icon: '🎮', label: 'Gaming' },
  forums:     { icon: '💬', label: 'Forums' },
  irc:        { icon: '🗨️', label: 'IRC' },
  technical:  { icon: '🔧', label: 'Technical' },
  military:   { icon: '⚔️', label: 'Military' },
  extreme:    { icon: '🛡️', label: 'Extreme Security' },
  universal:  { icon: '🌐', label: 'Universal' },
};

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================

/**
 * Entropia besorolása biztonsági szint szerint
 *
 * @param {number} bits - Entropia bitekben
 * @returns {Object} Besorolás (level, icon, description)
 */
export function classifyEntropy(bits) {
  if (bits < 60) {
    return {
      level: 'LOW',
      icon: '⚠️',
      description: 'Weak - only for low-security applications',
    };
  }
  if (bits < 100) {
    return {
      level: 'MODERATE',
      icon: '🔶',
      description: 'Fair - suitable for most consumer services',
    };
  }
  if (bits < 150) {
    return {
      level: 'STRONG',
      icon: '✅',
      description: 'Strong - suitable for sensitive accounts',
    };
  }
  if (bits < 250) {
    return {
      level: 'VERY STRONG',
      icon: '🛡️',
      description: 'Very strong - high-security applications',
    };
  }
  return {
    level: 'EXCELLENT',
    icon: '🔒',
    description: 'Excellent - maximum security, future-proof',
  };
}

/**
 * Számok formázása olvasható formátumban (10000 → 10,000)
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

// ============================================================
// FŐ TANÁCSADÁS GENERÁLÓ
// ============================================================

/**
 * Teljes tanácsadás generálása egy preset-hez
 *
 * Ez a fő függvény, amit a Worker /info/:name endpoint-ja hív.
 * A visszatérési érték egy szépen formázott text/plain szöveg,
 * amit a curl kiír a konzolra a letöltés után.
 *
 * @param {string} presetName - Preset neve (pl. "email-32-10k")
 * @returns {string} Formázott tanácsadás szöveg
 */
export function generateAdvice(presetName) {
  const preset = getPreset(presetName);

  // Ha nem található a preset
  if (!preset) {
    return [
      DIVIDER,
      '  ❌ UNKNOWN PRESET: ' + presetName,
      DIVIDER,
      '',
      '  The requested preset does not exist.',
      '  Use /presets to see all available presets.',
      '',
      '  Example:',
      '    curl -s "' + WORKER_BASE_URL + '/presets"',
      '',
      '  📚 Full documentation: ' + DOCS_URL,
      DIVIDER,
    ].join('\n');
  }

  // Kategória információ
  const categoryInfo = CATEGORY_INFO[preset.category] || { icon: '📦', label: 'Other' };

  // Entropia számítás
  const charsetNames = Array.isArray(preset.charset) ? preset.charset : [preset.charset];
  const charsetString = buildCharset(charsetNames, preset.excludeAmbiguous);
  const entropyBits = preset.length * Math.log2(charsetString.length);
  const entropyClass = classifyEntropy(entropyBits);

  // Kapcsolódó presetek sorainak előkészítése
  const relatedLines = (preset.related_presets || [])
    .map(name => {
      const related = getPreset(name);
      if (!related) return null;
      return `     • ${name} → ${related.description}`;
    })
    .filter(Boolean);

  // Összeállítás
  const lines = [];

  lines.push(DIVIDER);
  lines.push(`  📊 PRESET: ${presetName}`);
  lines.push(`  ${categoryInfo.icon} Category: ${categoryInfo.label}`);
  lines.push(DIVIDER);
  lines.push('');

  // Technikai információk
  lines.push('  📐 TECHNICAL SPECIFICATIONS:');
  lines.push(`     • Password length:    ${preset.length} characters`);
  lines.push(`     • Database size:      ${formatNumber(preset.count)} passwords`);
  lines.push(`     • Character set:      ${charsetNames.join(' + ')}`);
  lines.push(`     • Entropy:            ${entropyBits.toFixed(1)} bits ${entropyClass.icon}`);
  lines.push(`     • Security level:     ${entropyClass.level} (${entropyClass.description})`);
  lines.push('');

  // Ajánlott szolgáltatások
  if (preset.recommended_for && preset.recommended_for.length > 0) {
    lines.push('  ✅ RECOMMENDED FOR:');
    preset.recommended_for.forEach(item => {
      lines.push(`     • ${item}`);
    });
    lines.push('');
  }

  // Nem ajánlott szolgáltatások
  if (preset.not_recommended_for && preset.not_recommended_for.length > 0) {
    lines.push('  ❌ NOT RECOMMENDED FOR:');
    preset.not_recommended_for.forEach(item => {
      lines.push(`     • ${item}`);
    });
    lines.push('');
  }

  // Biztonsági tippek
  if (preset.tips && preset.tips.length > 0) {
    lines.push('  💡 SECURITY TIPS:');
    preset.tips.forEach(tip => {
      lines.push(`     • ${tip}`);
    });
    lines.push('');
  }

  // További preset ajánlások
  if (relatedLines.length > 0) {
    lines.push('  🚀 RELATED PRESETS:');
    relatedLines.forEach(line => {
      lines.push(line);
    });
    lines.push('');
    lines.push('  Download a related preset:');
    lines.push(`    curl --tlsv1.3 --compressed --progress-bar \\`);
    lines.push(`      "${WORKER_BASE_URL}/preset/<preset-name>" \\`);
    lines.push(`      -o passwords.csv \\`);
    lines.push(`      && curl -s "${WORKER_BASE_URL}/info/<preset-name>"`);
    lines.push('');
  }

  // Általános biztonsági figyelmeztetés
  lines.push('  ⚠️  IMPORTANT SECURITY NOTICE:');
  lines.push('     • Store passwords in a password manager (Bitwarden, KeePassXC)');
  lines.push('     • Never reuse the same password across services');
  lines.push('     • Enable 2FA/MFA wherever possible');
  lines.push('     • This database was generated on-the-fly and is NOT stored');
  lines.push('');

  // Dokumentáció link
  lines.push(DIVIDER);
  lines.push('  📚 Full documentation:');
  lines.push(`     ${DOCS_URL}`);
  lines.push('');
  lines.push('  🔍 Preset list:');
  lines.push(`     ${WORKER_BASE_URL}/presets`);
  lines.push(DIVIDER);

  return lines.join('\n');
}

// ============================================================
// PRESET LISTA GENERÁLÓ
// ============================================================

/**
 * Összes preset listájának generálása text/plain formátumban
 * A Worker /presets endpoint-ja használja (JSON alternatíva)
 *
 * @returns {string} Formázott preset lista
 */
export function generatePresetList() {
  const presets = listPresets();
  const categories = getCategories();
  const stats = getPresetStats();

  const lines = [];

  lines.push(DIVIDER);
  lines.push('  📋 SECURE PASSWORD DATABASE GENERATOR');
  lines.push('  📦 AVAILABLE PRESETS');
  lines.push('  Version: 0.1.0-beta.1');
  lines.push(DIVIDER);
  lines.push('');
  lines.push(`  Total presets: ${stats.total_presets}`);
  lines.push(`  Categories:    ${stats.categories}`);
  lines.push(`  Max length:    ${formatNumber(stats.max_length)} characters`);
  lines.push(`  Max count:     ${formatNumber(stats.max_count)} passwords`);
  lines.push('');

  // Kategóriánként csoportosítva
  for (const category of categories) {
    const categoryInfo = CATEGORY_INFO[category] || { icon: '📦', label: category };
    const categoryPresets = presets.filter(p => p.category === category);

    lines.push(`  ${categoryInfo.icon} ${categoryInfo.label.toUpperCase()}`);
    lines.push('  ' + '─'.repeat(56));

    for (const preset of categoryPresets) {
      const lengthStr = String(preset.length).padStart(4);
      const countStr = formatNumber(preset.count).padStart(7);
      lines.push(`     ${preset.name.padEnd(28)} ${lengthStr} chars × ${countStr}`);
    }
    lines.push('');
  }

  lines.push(DIVIDER);
  lines.push('  💾 USAGE:');
  lines.push('');
  lines.push('  Download a preset:');
  lines.push(`    curl --tlsv1.3 --compressed --progress-bar \\`);
  lines.push(`      "${WORKER_BASE_URL}/preset/email-32-10k" \\`);
  lines.push(`      -o passwords.csv \\`);
  lines.push(`      && curl -s "${WORKER_BASE_URL}/info/email-32-10k"`);
  lines.push('');
  lines.push('  📚 Full documentation: ' + DOCS_URL);
  lines.push(DIVIDER);

  return lines.join('\n');
}

// ============================================================
// ÜDVÖZLŐ ÜZENET
// ============================================================

/**
 * Üdvözlő üzenet generálása (Worker / endpoint-ja)
 *
 * @returns {string} Üdvözlő üzenet
 */
export function generateWelcome() {
  const stats = getPresetStats();

  return [
    DIVIDER,
    '  🔐 SECURE PASSWORD DATABASE GENERATOR',
    '  Version: 0.1.0-beta.1',
    DIVIDER,
    '',
    '  Welcome! This service generates secure password databases',
    '  on-the-fly using cryptographically secure random numbers.',
    '',
    '  📊 QUICK STATS:',
    `     • Available presets: ${stats.total_presets}`,
    `     • Categories:        ${stats.categories}`,
    `     • Max password:      ${formatNumber(stats.max_length)} characters`,
    `     • Max database:      ${formatNumber(stats.max_count)} passwords`,
    '',
    '  🚀 QUICK START:',
    '',
    '  1. List all presets:',
    `     curl -s "${WORKER_BASE_URL}/presets"`,
    '',
    '  2. Download a password database:',
    `     curl --tlsv1.3 --compressed --progress-bar \\`,
    `       "${WORKER_BASE_URL}/preset/email-32-10k" \\`,
    `       -o passwords.csv`,
    '',
    '  3. Get advice for a preset:',
    `     curl -s "${WORKER_BASE_URL}/info/email-32-10k"`,
    '',
    '  📚 FULL DOCUMENTATION:',
    `     ${DOCS_URL}`,
    '',
    '  🔒 SECURITY:',
    '     • TLS 1.3 only',
    '     • Passwords generated on-the-fly (never stored)',
    '     • Cryptographically secure random generation',
    '',
    DIVIDER,
  ].join('\n');
}
