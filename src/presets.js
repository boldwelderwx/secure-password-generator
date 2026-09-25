/**
 * ============================================================
 * Secure Password Database Generator - Presets Module
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 *
 * Ez a modul definiálja az 50 előre beállított presetet.
 *
 * PRESET STRUKTÚRA:
 *   'preset-nev': {
 *     length: 32,              // Jelszó hossza
 *     count: 10000,            // Generálandó jelszavak száma
 *     charset: ['alphanumericSymbols'],  // Karakterkészletek
 *     excludeAmbiguous: true,  // Félreérthető karakterek kizárása
 *     category: 'email',       // Kategória
 *     services: ['gmail', 'yahoo'],  // Kapcsolódó szolgáltatások
 *     description: { en: '...', hu: '...', ... }  // Többnyelvű leírás
 *   }
 *
 * ÚJ PRESET HOZZÁADÁSA:
 * Egyszerűen adj hozzá egy új bejegyzést a PRESETS objektumhoz.
 * A nevek kisbetűsek, kötőjellel elválasztottak legyenek.
 */

export const PRESETS = {
  // ═══════════════════════════════════════════════════════════
  // EMAIL PRESETEK (1-7)
  // ═══════════════════════════════════════════════════════════
  'email-basic-16-5k': {
    length: 16,
    count: 5000,
    charset: ['alphanumeric'],
    excludeAmbiguous: true,
    category: 'email',
    services: ['outlook', 'icloud_mail'],
    description: {
      en: 'Basic email passwords (16 chars, 5,000 entries) - for Outlook, iCloud',
      hu: 'Alap email jelszavak (16 karakter, 5.000 db) - Outlook, iCloud',
      de: 'Basis-E-Mail-Passwörter (16 Zeichen, 5.000 Einträge)',
    },
  },
  'email-standard-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'email',
    services: ['gmail', 'yahoo', 'protonmail', 'zoho'],
    description: {
      en: 'Standard email passwords (32 chars, 10,000 entries) - Gmail, Yahoo, ProtonMail',
      hu: 'Standard email jelszavak (32 karakter, 10.000 db) - Gmail, Yahoo, ProtonMail',
      de: 'Standard-E-Mail-Passwörter (32 Zeichen, 10.000 Einträge)',
    },
  },
  'email-pro-64-50k': {
    length: 64,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'email',
    services: ['protonmail', 'tutanota', 'gmail'],
    description: {
      en: 'Pro email passwords (64 chars, 50,000 entries)',
      hu: 'Pro email jelszavak (64 karakter, 50.000 db)',
    },
  },
  'email-hu-32-10k': {
    length: 32,
    count: 10000,
    charset: ['hungarian'],
    excludeAmbiguous: false,
    category: 'email',
    services: ['gmail', 'protonmail'],
    description: {
      en: 'Hungarian charset email passwords (32 chars, 10,000 entries)',
      hu: 'Magyar karakterkészletű email jelszavak (32 karakter, 10.000 db)',
    },
  },
  'email-pl-32-10k': {
    length: 32,
    count: 10000,
    charset: ['polish'],
    excludeAmbiguous: false,
    category: 'email',
    services: ['gmail', 'protonmail'],
    description: {
      en: 'Polish charset email passwords (32 chars, 10,000 entries)',
      hu: 'Lengyel karakterkészletű email jelszavak (32 karakter, 10.000 db)',
      pl: 'Hasła e-mail z polskim zestawem znaków',
    },
  },
  'email-de-32-10k': {
    length: 32,
    count: 10000,
    charset: ['german'],
    excludeAmbiguous: false,
    category: 'email',
    services: ['gmail', 'protonmail'],
    description: {
      en: 'German charset email passwords (32 chars, 10,000 entries)',
      hu: 'Német karakterkészletű email jelszavak (32 karakter, 10.000 db)',
      de: 'Deutsche Zeichen-E-Mail-Passwörter',
    },
  },
  'email-ru-32-10k': {
    length: 32,
    count: 10000,
    charset: ['russian'],
    excludeAmbiguous: false,
    category: 'email',
    services: ['gmail', 'vk'],
    description: {
      en: 'Russian charset email passwords (32 chars, 10,000 entries)',
      hu: 'Orosz karakterkészletű email jelszavak (32 karakter, 10.000 db)',
      ru: 'Пароли электронной почты с русским набором символов',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // KÖZÖSSÉGI MÉDIA PRESETEK (8-12)
  // ═══════════════════════════════════════════════════════════
  'social-basic-20-5k': {
    length: 20,
    count: 5000,
    charset: ['alphanumeric'],
    excludeAmbiguous: true,
    category: 'social',
    services: ['facebook', 'twitter', 'tiktok'],
    description: {
      en: 'Basic social media passwords (20 chars, 5,000 entries)',
      hu: 'Alap közösségi média jelszavak (20 karakter, 5.000 db)',
    },
  },
  'social-standard-30-10k': {
    length: 30,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'social',
    services: ['instagram', 'linkedin', 'reddit', 'discord'],
    description: {
      en: 'Standard social passwords (30 chars, 10,000 entries)',
      hu: 'Standard közösségi jelszavak (30 karakter, 10.000 db)',
    },
  },
  'social-pro-64-25k': {
    length: 64,
    count: 25000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'social',
    services: ['linkedin', 'telegram', 'reddit'],
    description: {
      en: 'Pro social passwords (64 chars, 25,000 entries)',
      hu: 'Pro közösségi jelszavak (64 karakter, 25.000 db)',
    },
  },
  'social-hu-32-10k': {
    length: 32,
    count: 10000,
    charset: ['hungarian'],
    excludeAmbiguous: false,
    category: 'social',
    services: ['facebook', 'instagram'],
    description: {
      en: 'Hungarian charset social passwords (32 chars)',
      hu: 'Magyar karakterkészletű közösségi jelszavak (32 karakter)',
    },
  },
  'social-ja-32-10k': {
    length: 32,
    count: 10000,
    charset: ['japanese'],
    excludeAmbiguous: false,
    category: 'social',
    services: ['twitter', 'telegram'],
    description: {
      en: 'Japanese charset social passwords (32 chars)',
      hu: 'Japán karakterkészletű közösségi jelszavak (32 karakter)',
      ja: '日本語文字セットのソーシャルパスワード',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // BANKI PRESETEK (13-17)
  // ═══════════════════════════════════════════════════════════
  'bank-basic-16-10k': {
    length: 16,
    count: 10000,
    charset: ['alphanumeric'],
    excludeAmbiguous: true,
    category: 'banking',
    services: ['otp_bank', 'general_bank', 'irs'],
    description: {
      en: 'Basic banking passwords (16 chars) - OTP, general banks',
      hu: 'Alap banki jelszavak (16 karakter) - OTP, általános bankok',
    },
  },
  'bank-standard-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'banking',
    services: ['revolut', 'wise', 'paypal'],
    description: {
      en: 'Standard banking passwords (32 chars) - Revolut, Wise, PayPal',
      hu: 'Standard banki jelszavak (32 karakter) - Revolut, Wise, PayPal',
    },
  },
  'bank-pro-64-50k': {
    length: 64,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'banking',
    services: ['revolut', 'wise', 'paypal'],
    description: {
      en: 'Pro banking passwords (64 chars, 50,000 entries)',
      hu: 'Pro banki jelszavak (64 karakter, 50.000 db)',
    },
  },
  'bank-ultra-128-100k': {
    length: 128,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'banking',
    services: [],
    description: {
      en: 'Ultra banking passwords (128 chars, 100,000 entries)',
      hu: 'Ultra banki jelszavak (128 karakter, 100.000 db)',
    },
  },
  'bank-hu-16-10k': {
    length: 16,
    count: 10000,
    charset: ['hungarian'],
    excludeAmbiguous: true,
    category: 'banking',
    services: ['otp_bank'],
    description: {
      en: 'Hungarian charset banking passwords (16 chars)',
      hu: 'Magyar karakterkészletű banki jelszavak (16 karakter) - OTP',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // KORMÁNYZATI PRESETEK (18-22)
  // ═══════════════════════════════════════════════════════════
  'gov-hu-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'government',
    services: ['ugyfelkapu', 'nav', 'eeszt'],
    description: {
      en: 'Hungarian government passwords (32 chars) - Ügyfélkapu, NAV, EESZT',
      hu: 'Magyar kormányzati jelszavak (32 karakter) - Ügyfélkapu, NAV, EESZT',
    },
  },
  'gov-standard-32-25k': {
    length: 32,
    count: 25000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'government',
    services: ['gov_uk', 'irs'],
    description: {
      en: 'Standard government passwords (32 chars, 25,000 entries)',
      hu: 'Standard kormányzati jelszavak (32 karakter, 25.000 db)',
    },
  },
  'gov-pro-64-50k': {
    length: 64,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'government',
    services: [],
    description: {
      en: 'Pro government passwords (64 chars, 50,000 entries)',
      hu: 'Pro kormányzati jelszavak (64 karakter, 50.000 db)',
    },
  },
  'gov-pl-32-10k': {
    length: 32,
    count: 10000,
    charset: ['polish'],
    excludeAmbiguous: false,
    category: 'government',
    services: [],
    description: {
      en: 'Polish charset government passwords (32 chars)',
      hu: 'Lengyel karakterkészletű kormányzati jelszavak (32 karakter)',
      pl: 'Hasła rządowe z polskim zestawem znaków',
    },
  },
  'gov-ultra-128-100k': {
    length: 128,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'government',
    services: [],
    description: {
      en: 'Ultra government passwords (128 chars, 100,000 entries)',
      hu: 'Ultra kormányzati jelszavak (128 karakter, 100.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // VÁLLALATI PRESETEK (23-27)
  // ═══════════════════════════════════════════════════════════
  'corp-standard-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'corporate',
    services: ['slack', 'zoom', 'jira'],
    description: {
      en: 'Standard corporate passwords (32 chars) - Slack, Zoom, Jira',
      hu: 'Standard vállalati jelszavak (32 karakter) - Slack, Zoom, Jira',
    },
  },
  'corp-ms365-64-25k': {
    length: 64,
    count: 25000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'corporate',
    services: ['microsoft365'],
    description: {
      en: 'Microsoft 365 passwords (64 chars, 25,000 entries)',
      hu: 'Microsoft 365 jelszavak (64 karakter, 25.000 db)',
    },
  },
  'dev-github-64-25k': {
    length: 64,
    count: 25000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'corporate',
    services: ['github', 'gitlab'],
    description: {
      en: 'Developer passwords (64 chars) - GitHub, GitLab',
      hu: 'Fejlesztői jelszavak (64 karakter) - GitHub, GitLab',
    },
  },
  'dev-pro-128-50k': {
    length: 128,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'corporate',
    services: ['gitlab'],
    description: {
      en: 'Pro developer passwords (128 chars, 50,000 entries)',
      hu: 'Pro fejlesztői jelszavak (128 karakter, 50.000 db)',
    },
  },
  'dev-ultra-256-100k': {
    length: 256,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'corporate',
    services: [],
    description: {
      en: 'Ultra developer passwords (256 chars, 100,000 entries)',
      hu: 'Ultra fejlesztői jelszavak (256 karakter, 100.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // TECHNIKAI PRESETEK (28-33)
  // ═══════════════════════════════════════════════════════════
  'ssh-standard-256-1k': {
    length: 256,
    count: 1000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'technical',
    services: ['ssh'],
    description: {
      en: 'SSH passphrases (256 chars, 1,000 entries)',
      hu: 'SSH jelszavak (256 karakter, 1.000 db)',
    },
  },
  'ssh-pro-512-1k': {
    length: 512,
    count: 1000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'technical',
    services: ['ssh'],
    description: {
      en: 'SSH pro passphrases (512 chars, 1,000 entries)',
      hu: 'SSH pro jelszavak (512 karakter, 1.000 db)',
    },
  },
  'wifi-standard-63-5k': {
    length: 63,
    count: 5000,
    charset: ['alphanumeric'],
    excludeAmbiguous: true,
    category: 'technical',
    services: ['wifi'],
    description: {
      en: 'WiFi passwords (63 chars max WPA2, 5,000 entries)',
      hu: 'WiFi jelszavak (63 karakter max WPA2, 5.000 db)',
    },
  },
  'vpn-standard-64-10k': {
    length: 64,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'technical',
    services: ['vpn'],
    description: {
      en: 'VPN passwords (64 chars, 10,000 entries)',
      hu: 'VPN jelszavak (64 karakter, 10.000 db)',
    },
  },
  'crypto-wallet-128-10k': {
    length: 128,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'technical',
    services: ['bitcoin_wallet'],
    description: {
      en: 'Crypto wallet passphrases (128 chars, 10,000 entries)',
      hu: 'Kripto pénztárca jelszavak (128 karakter, 10.000 db)',
    },
  },
  'crypto-pro-256-50k': {
    length: 256,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'technical',
    services: ['bitcoin_wallet'],
    description: {
      en: 'Crypto pro passphrases (256 chars, 50,000 entries)',
      hu: 'Kripto pro jelszavak (256 karakter, 50.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // KATONAI PRESETEK (34-37)
  // ═══════════════════════════════════════════════════════════
  'military-nato-256-10k': {
    length: 256,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'military',
    services: ['nato_standard'],
    description: {
      en: 'NATO standard passwords (256 chars, 10,000 entries)',
      hu: 'NATO standard jelszavak (256 karakter, 10.000 db)',
    },
  },
  'military-secret-512-50k': {
    length: 512,
    count: 50000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'military',
    services: ['military_secret'],
    description: {
      en: 'Military secret passwords (512 chars, 50,000 entries)',
      hu: 'Katonai titkos jelszavak (512 karakter, 50.000 db)',
    },
  },
  'military-top-1024-100k': {
    length: 1024,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'military',
    services: ['military_top'],
    description: {
      en: 'Military top passwords (1024 chars, 100,000 entries)',
      hu: 'Katonai legfelső jelszavak (1024 karakter, 100.000 db)',
    },
  },
  'military-hex-512-50k': {
    length: 512,
    count: 50000,
    charset: ['hex'],
    excludeAmbiguous: false,
    category: 'military',
    services: [],
    description: {
      en: 'Military hex passwords (512 chars, 50,000 entries)',
      hu: 'Katonai hex jelszavak (512 karakter, 50.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // EXTRÉM PRESETEK (38-42)
  // ═══════════════════════════════════════════════════════════
  'extreme-1024-100k': {
    length: 1024,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'extreme',
    services: [],
    description: {
      en: 'Extreme passwords (1024 chars, 100,000 entries)',
      hu: 'Extrém jelszavak (1024 karakter, 100.000 db)',
    },
  },
  'extreme-2048-100k': {
    length: 2048,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'extreme',
    services: [],
    description: {
      en: 'Ultra extreme passwords (2048 chars, 100,000 entries)',
      hu: 'Ultra extrém jelszavak (2048 karakter, 100.000 db)',
    },
  },
  'extreme-4096-100k': {
    length: 4096,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'extreme',
    services: [],
    description: {
      en: 'Maximum extreme passwords (4096 chars, 100,000 entries)',
      hu: 'Maximális extrém jelszavak (4096 karakter, 100.000 db)',
    },
  },
  'extreme-base64-512-50k': {
    length: 512,
    count: 50000,
    charset: ['base64'],
    excludeAmbiguous: false,
    category: 'extreme',
    services: [],
    description: {
      en: 'Base64 extreme passwords (512 chars, 50,000 entries)',
      hu: 'Base64 extrém jelszavak (512 karakter, 50.000 db)',
    },
  },
  'extreme-hex-1024-100k': {
    length: 1024,
    count: 100000,
    charset: ['hex'],
    excludeAmbiguous: false,
    category: 'extreme',
    services: [],
    description: {
      en: 'Hex extreme passwords (1024 chars, 100,000 entries)',
      hu: 'Hex extrém jelszavak (1024 karakter, 100.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // FÓRUM / IRC PRESETEK (43-44)
  // ═══════════════════════════════════════════════════════════
  'forum-standard-24-5k': {
    length: 24,
    count: 5000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'forum',
    services: ['forum_general', 'reddit'],
    description: {
      en: 'Forum passwords (24 chars, 5,000 entries)',
      hu: 'Fórum jelszavak (24 karakter, 5.000 db)',
    },
  },
  'irc-basic-16-1k': {
    length: 16,
    count: 1000,
    charset: ['alphanumeric'],
    excludeAmbiguous: true,
    category: 'forum',
    services: ['irc'],
    description: {
      en: 'IRC passwords (16 chars max, 1,000 entries)',
      hu: 'IRC jelszavak (16 karakter max, 1.000 db)',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // EGYÉB PRESETEK (45-50)
  // ═══════════════════════════════════════════════════════════
  'gaming-standard-32-5k': {
    length: 32,
    count: 5000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'gaming',
    services: ['steam'],
    description: {
      en: 'Gaming passwords (32 chars, 5,000 entries) - Steam',
      hu: 'Gaming jelszavak (32 karakter, 5.000 db) - Steam',
    },
  },
  'shopping-standard-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'shopping',
    services: ['amazon'],
    description: {
      en: 'Shopping passwords (32 chars, 10,000 entries) - Amazon',
      hu: 'Vásárlási jelszavak (32 karakter, 10.000 db) - Amazon',
    },
  },
  'cloud-standard-32-10k': {
    length: 32,
    count: 10000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: true,
    category: 'cloud',
    services: ['dropbox', 'google_drive'],
    description: {
      en: 'Cloud storage passwords (32 chars) - Dropbox, Google Drive',
      hu: 'Cloud tárhely jelszavak (32 karakter) - Dropbox, Google Drive',
    },
  },
  'universal-standard-64-100k': {
    length: 64,
    count: 100000,
    charset: ['alphanumericSymbols'],
    excludeAmbiguous: false,
    category: 'universal',
    services: [],
    description: {
      en: 'Universal passwords (64 chars, 100,000 entries)',
      hu: 'Univerzális jelszavak (64 karakter, 100.000 db)',
    },
  },
  'universal-hex-64-100k': {
    length: 64,
    count: 100000,
    charset: ['hex'],
    excludeAmbiguous: false,
    category: 'universal',
    services: [],
    description: {
      en: 'Universal hex passwords (64 chars, 100,000 entries)',
      hu: 'Univerzális hex jelszavak (64 karakter, 100.000 db)',
    },
  },
  'universal-base64-64-100k': {
    length: 64,
    count: 100000,
    charset: ['base64'],
    excludeAmbiguous: false,
    category: 'universal',
    services: [],
    description: {
      en: 'Universal Base64 passwords (64 chars, 100,000 entries)',
      hu: 'Univerzális Base64 jelszavak (64 karakter, 100.000 db)',
    },
  },
};

/**
 * Összes preset nevének lekérése
 * @returns {string[]} Preset nevek tömbje
 */
export function getPresetNames() {
  return Object.keys(PRESETS);
}

/**
 * Egy preset lekérése név alapján
 * @param {string} name - Preset neve
 * @returns {Object|null} Preset vagy null
 */
export function getPreset(name) {
  return PRESETS[name] || null;
}

/**
 * Presetek szűrése kategória alapján
 * @param {string} category - Kategória neve
 * @returns {Object[]} Szűrt presetek
 */
export function getPresetsByCategory(category) {
  return Object.entries(PRESETS)
    .filter(([_, preset]) => preset.category === category)
    .map(([name, preset]) => ({ name, ...preset }));
}

/**
 * Preset validálása (méretkorlátok ellenőrzése)
 * @param {Object} preset - Preset objektum
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePreset(preset) {
  const errors = [];

  if (preset.length < 4 || preset.length > 4096) {
    errors.push(`Invalid length: ${preset.length} (must be 4-4096)`);
  }
  if (preset.count < 1 || preset.count > 100000) {
    errors.push(`Invalid count: ${preset.count} (must be 1-100000)`);
  }
  if (!preset.charset || preset.charset.length === 0) {
    errors.push('Charset is required');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// SEGÉDFÜGGVÉNYEK (exportálva a worker.js és advisor.js számára)
// ============================================================

/**
 * Preset lekérése név alapján
 * @param {string} name - Preset neve (pl. "email-basic-16-5k")
 * @returns {Object|null} Preset konfiguráció vagy null
 */
/**
 * Összes preset listája (rövidített formában)
 * @returns {Array} Preset lista
 */
export function listPresets() {
  return Object.entries(PRESETS).map(([name, config]) => ({
    name,
    category: config.category,
    length: config.length,
    count: config.count,
    description: config.description?.en || '',
  }));
}

/**
 * Összes preset nevének listája
 * @returns {string[]} Preset nevek
 */
/**
 * Presetek szűrése kategória alapján
 * @param {string} category - Kategória neve
 * @returns {Array} Szűrt preset lista
 */
/**
 * Összes elérhető kategória listája
 * @returns {string[]} Kategóriák tömbje
 */
export function getCategories() {
  const cats = new Set();
  Object.values(PRESETS).forEach(p => cats.add(p.category));
  return [...cats].sort();
}

/**
 * Preset statisztika
 * @returns {Object} Statisztikai adatok
 */
export function getPresetStats() {
  const categories = getCategories();
  return {
    total_presets: Object.keys(PRESETS).length,
    categories: categories.length,
    category_list: categories,
    max_length: Math.max(...Object.values(PRESETS).map(p => p.length)),
    max_count: Math.max(...Object.values(PRESETS).map(p => p.count)),
  };
}

/**
 * Szolgáltatás információk lekérése a preset-hez
 * @param {string} presetName - Preset neve
 * @returns {Object} Szolgáltatás lista (ajánlott / nem ajánlott)
 */
export function getPresetServices(presetName) {
  const preset = PRESETS[presetName];
  if (!preset) return null;
  
  // SERVICES importálása itt, hogy ne legyen circular dependency
  return {
    preset: presetName,
    services: preset.services || [],
    category: preset.category,
    length: preset.length,
  };
}
