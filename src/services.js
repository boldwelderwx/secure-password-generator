/**
 * ============================================================
 * Secure Password Database Generator - Services Database
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 *
 * Ez a modul tartalmazza az ismert szolgáltatások jelszó-
 * korlátozásait. A tanácsadó (advisor) modul ebből dolgozik.
 *
 * FONTOS MEGJEGYZÉS FEJLESZTŐKNEK:
 * - A limitek nyilvánosan dokumentált értékek (2025-2026)
 * - A limitek IDŐVEL VÁLTOZHATNAK! Ellenőrizd frissítéskor.
 * - A 'max' érték a maximális elfogadott jelszóhossz.
 * - Ha egy szolgáltatás nem ismeri a maximumot, null-t írj.
 *
 * ÚJ SZOLGÁLTATÁS HOZZÁADÁSA:
 *   serviceName: {
 *     name: 'Szolgáltatás neve',
 *     category: 'email|social|banking|...',
 *     min: 8,          // minimális jelszóhossz
 *     max: 100,        // maximális jelszóhossz (null = ismeretlen)
 *     note: 'Megjegyzés (opcionális)'
 *   }
 */

export const SERVICES = {
  // ═══════════════════════════════════════════════════════════
  // EMAIL SZOLGÁLTATÓK
  // ═══════════════════════════════════════════════════════════
  gmail: {
    name: 'Gmail (Google)',
    category: 'email',
    min: 8,
    max: 100,
    note: 'Google fiók, 2FA ajánlott',
  },
  outlook: {
    name: 'Outlook / Hotmail (Microsoft)',
    category: 'email',
    min: 8,
    max: 16,
    note: 'FIGYELEM: Legacy Microsoft fiókok max 16 karakter!',
  },
  yahoo: {
    name: 'Yahoo Mail',
    category: 'email',
    min: 8,
    max: 32,
    note: 'Yahoo fiók',
  },
  protonmail: {
    name: 'ProtonMail',
    category: 'email',
    min: 8,
    max: 100,
    note: 'Titkosított email, erős jelszó ajánlott',
  },
  icloud_mail: {
    name: 'iCloud Mail (Apple)',
    category: 'email',
    min: 8,
    max: 32,
    note: 'Apple ID jelszó',
  },
  zoho: {
    name: 'Zoho Mail',
    category: 'email',
    min: 8,
    max: 100,
    note: 'Zoho fiók',
  },
  tutanota: {
    name: 'Tutanota',
    category: 'email',
    min: 8,
    max: 128,
    note: 'Titkosított email',
  },

  // ═══════════════════════════════════════════════════════════
  // KÖZÖSSÉGI MÉDIA
  // ═══════════════════════════════════════════════════════════
  facebook: {
    name: 'Facebook',
    category: 'social',
    min: 6,
    max: 200,
    note: 'Min. 6 karakter, de 12+ ajánlott',
  },
  twitter: {
    name: 'Twitter / X',
    category: 'social',
    min: 4,
    max: 1000,
    note: 'Min. 4 karakter, de 12+ ajánlott',
  },
  instagram: {
    name: 'Instagram',
    category: 'social',
    min: 6,
    max: 30,
    note: 'Max 30 karakter',
  },
  linkedin: {
    name: 'LinkedIn',
    category: 'social',
    min: 8,
    max: 200,
    note: 'Szakmai hálózat',
  },
  tiktok: {
    name: 'TikTok',
    category: 'social',
    min: 8,
    max: 20,
    note: 'Max 20 karakter',
  },
  reddit: {
    name: 'Reddit',
    category: 'social',
    min: 8,
    max: 100,
    note: 'Fórum/közösség',
  },
  discord: {
    name: 'Discord',
    category: 'social',
    min: 6,
    max: 72,
    note: 'Max 72 karakter',
  },
  telegram: {
    name: 'Telegram',
    category: 'social',
    min: 5,
    max: 64,
    note: 'Kétfaktoros kódolás ajánlott',
  },
  vk: {
    name: 'VK (VKontakte)',
    category: 'social',
    min: 6,
    max: 100,
    note: 'Orosz közösségi hálózat',
  },

  // ═══════════════════════════════════════════════════════════
  // BANKI ÉS PÉNZÜGYI
  // ═══════════════════════════════════════════════════════════
  otp_bank: {
    name: 'OTP Bank',
    category: 'banking',
    min: 8,
    max: 16,
    note: 'Magyar bank, FIGYELEM: max 16 karakter!',
  },
  revolut: {
    name: 'Revolut',
    category: 'banking',
    min: 8,
    max: 50,
    note: 'PIN: 4-6, jelszó: 8-50',
  },
  wise: {
    name: 'Wise (TransferWise)',
    category: 'banking',
    min: 8,
    max: 50,
    note: 'Nemzetközi átutalás',
  },
  paypal: {
    name: 'PayPal',
    category: 'banking',
    min: 8,
    max: 50,
    note: 'Fizetési szolgáltatás',
  },
  general_bank: {
    name: 'Általános banki belépés',
    category: 'banking',
    min: 8,
    max: 16,
    note: 'Legtöbb bank max 8-16 karaktert enged',
  },

  // ═══════════════════════════════════════════════════════════
  // KORMÁNYZATI PORTÁLOK
  // ═══════════════════════════════════════════════════════════
  ugyfelkapu: {
    name: 'Ügyfélkapu (Magyarország)',
    category: 'government',
    min: 8,
    max: 32,
    note: 'Magyar kormányzati portál',
  },
  nav: {
    name: 'NAV (Nemzeti Adó- és Vámhivatal)',
    category: 'government',
    min: 8,
    max: 32,
    note: 'Magyar adóhatóság',
  },
  eeszt: {
    name: 'EESZT (Egészségügyi Szolgáltatási Tér)',
    category: 'government',
    min: 8,
    max: 32,
    note: 'Magyar egészségügyi portál',
  },
  irs: {
    name: 'IRS (USA Adóhatóság)',
    category: 'government',
    min: 8,
    max: 16,
    note: 'USA adóhatóság',
  },
  gov_uk: {
    name: 'Gov.uk (Egyesült Királyság)',
    category: 'government',
    min: 10,
    max: 100,
    note: 'UK kormányzati portál',
  },

  // ═══════════════════════════════════════════════════════════
  // VÁLLALATI / MUNKAHELYI
  // ═══════════════════════════════════════════════════════════
  microsoft365: {
    name: 'Microsoft 365',
    category: 'corporate',
    min: 8,
    max: 256,
    note: 'Vállalati csomag',
  },
  slack: {
    name: 'Slack',
    category: 'corporate',
    min: 8,
    max: 100,
    note: 'Csapatkommunikáció',
  },
  github: {
    name: 'GitHub',
    category: 'corporate',
    min: 8,
    max: 72,
    note: 'FIGYELEM: 72 felett a bcrypt levágja!',
  },
  gitlab: {
    name: 'GitLab',
    category: 'corporate',
    min: 8,
    max: 128,
    note: 'DevOps platform',
  },
  jira: {
    name: 'Jira / Atlassian',
    category: 'corporate',
    min: 8,
    max: 100,
    note: 'Projektmenedzsment',
  },
  zoom: {
    name: 'Zoom',
    category: 'corporate',
    min: 8,
    max: 32,
    note: 'Videókonferencia',
  },

  // ═══════════════════════════════════════════════════════════
  // TECHNIKAI (SSH, WiFi, VPN, Crypto)
  // ═══════════════════════════════════════════════════════════
  ssh: {
    name: 'SSH kulcs/jelszó',
    category: 'technical',
    min: 16,
    max: 256,
    note: 'SSH passphrase, hosszú ajánlott',
  },
  wifi: {
    name: 'WiFi (WPA2/WPA3)',
    category: 'technical',
    min: 8,
    max: 63,
    note: 'FIGYELEM: WPA2 max 63 karakter!',
  },
  vpn: {
    name: 'VPN belépés',
    category: 'technical',
    min: 8,
    max: 64,
    note: 'Vállalati VPN',
  },
  router: {
    name: 'Router admin',
    category: 'technical',
    min: 8,
    max: 32,
    note: 'Router admin felület',
  },
  bitcoin_wallet: {
    name: 'Bitcoin wallet',
    category: 'technical',
    min: 16,
    max: 128,
    note: 'Kripto pénztárca passphrase',
  },

  // ═══════════════════════════════════════════════════════════
  // KATONAI / KORMÁNYZATI BIZTONSÁGI SZINTEK
  // ═══════════════════════════════════════════════════════════
  nato_standard: {
    name: 'NATO standard',
    category: 'military',
    min: 16,
    max: 256,
    note: 'NATO min. követelmény',
  },
  military_secret: {
    name: 'Katonai titkos szint',
    category: 'military',
    min: 32,
    max: 512,
    note: 'Magas biztonsági szint',
  },
  military_top: {
    name: 'Katonai legfelső szint',
    category: 'military',
    min: 64,
    max: 1024,
    note: 'Legmagasabb biztonsági szint',
  },

  // ═══════════════════════════════════════════════════════════
  // FÓRUMOK / IRC
  // ═══════════════════════════════════════════════════════════
  forum_general: {
    name: 'Általános fórum',
    category: 'forum',
    min: 6,
    max: 64,
    note: 'Fórum regisztráció',
  },
  irc: {
    name: 'IRC csatorna',
    category: 'forum',
    min: 4,
    max: 16,
    note: 'FIGYELEM: IRC max 16 karakter!',
  },

  // ═══════════════════════════════════════════════════════════
  // EGYÉB
  // ═══════════════════════════════════════════════════════════
  steam: {
    name: 'Steam',
    category: 'gaming',
    min: 6,
    max: 64,
    note: 'Játék platform',
  },
  amazon: {
    name: 'Amazon',
    category: 'shopping',
    min: 6,
    max: 128,
    note: 'Webáruház',
  },
  dropbox: {
    name: 'Dropbox',
    category: 'cloud',
    min: 6,
    max: 50,
    note: 'Cloud tárhely',
  },
  google_drive: {
    name: 'Google Drive',
    category: 'cloud',
    min: 8,
    max: 100,
    note: 'Google fiók része',
  },
};

/**
 * Szolgáltatások lekérése kategória alapján
 * @param {string} category - Kategória neve
 * @returns {Object[]} Szűrt szolgáltatások
 */
export function getServicesByCategory(category) {
  return Object.entries(SERVICES)
    .filter(([_, svc]) => svc.category === category)
    .map(([key, svc]) => ({ key, ...svc }));
}

/**
 * Egy szolgáltatás keresése kulcs alapján
 * @param {string} key - Szolgáltatás kulcsa
 * @returns {Object|null} Szolgáltatás vagy null
 */
export function getService(key) {
  return SERVICES[key] || null;
}
