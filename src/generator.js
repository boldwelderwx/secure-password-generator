/**
 * ============================================================
 * Secure Password Database Generator - Password Generator Module
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 * 
 * Ez a modul felelős a kriptográfiailag biztonságos
 * jelszavak generálásáért.
 * 
 * BIZTONSÁGI MEGJEGYZÉSEK:
 * - A Web Crypto API-t használjuk (crypto.getRandomValues)
 * - Ez kriptográfiailag biztonságos véletlenszám-generátor
 * - SOHA ne használj Math.random()-ot jelszavakhoz!
 * - A generált jelszavakat nem tároljuk, csak streameljük
 */

import { buildCharset } from './charsets.js';

/**
 * Kriptográfiailag biztonságos véletlen szám generálása
 * @param {number} max - Maximum érték (exkluzív)
 * @returns {number} Véletlen szám 0 és max-1 között
 */
function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Egyetlen jelszó generálása
 * @param {Object} options - Generálási opciók
 * @param {number} options.length - Jelszó hossza
 * @param {string} options.charset - Karakterkészlet (vagy charset nevek tömbje)
 * @param {boolean} options.excludeAmbiguous - Félreérthető karakterek kizárása
 * @returns {string} Generált jelszó
 */
export function generatePassword(options = {}) {
  const {
    length = 32,
    charset = 'alphanumericSymbols',
    excludeAmbiguous = false,
  } = options;

  // Validáció
  if (length < 4 || length > 4096) {
    throw new Error(`Invalid password length: ${length}. Must be between 4 and 4096.`);
  }

  // Karakterkészlet összeállítása
  let charsetString;
  if (typeof charset === 'string') {
    // Ha egyetlen charset név
    charsetString = buildCharset([charset], excludeAmbiguous);
  } else if (Array.isArray(charset)) {
    // Ha charset nevek tömbje
    charsetString = buildCharset(charset, excludeAmbiguous);
  } else {
    throw new Error('Invalid charset parameter');
  }

  if (charsetString.length === 0) {
    throw new Error('Empty charset after processing');
  }

  // Jelszó generálása
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = secureRandomInt(charsetString.length);
    password += charsetString[index];
  }

  return password;
}

/**
 * Több jelszó generálása (batch)
 * @param {number} count - Jelszavak száma
 * @param {Object} options - Generálási opciók
 * @param {Function} onProgress - Progress callback (opcionális)
 * @returns {string[]} Generált jelszavak tömbje
 */
export function generatePasswords(count, options = {}, onProgress = null) {
  const passwords = [];
  const batchSize = 1000; // Batch méret a memória kezeléséhez

  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));

    // Progress callback minden batch-nél
    if (onProgress && (i + 1) % batchSize === 0) {
      onProgress(i + 1, count);
    }
  }

  return passwords;
}

/**
 * Jelszó entropia számítása (bitekben)
 * @param {string} password - A jelszó
 * @param {string} charsetString - A használt karakterkészlet
 * @returns {number} Entropia bitekben
 */
export function calculateEntropy(password, charsetString) {
  if (charsetString.length === 0) return 0;
  return password.length * Math.log2(charsetString.length);
}

/**
 * Jelszó erősség besorolása entropia alapján
 * @param {number} entropyBits - Entropia bitekben
 * @returns {string} Erősség besorolás
 */
export function classifyStrength(entropyBits) {
  if (entropyBits < 40) return 'weak';
  if (entropyBits < 60) return 'fair';
  if (entropyBits < 80) return 'good';
  if (entropyBits < 100) return 'strong';
  if (entropyBits < 128) return 'very_strong';
  return 'excellent';
}
