/**
 * ============================================================
 * Secure Password Database Generator - CSV Builder Module
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 *
 * Ez a modul felelős a jelszó-adatbázis CSV formátumú
 * elkészítéséért, streaming módon (memória-hatékonyan).
 *
 * FONTOS TERVEZÉSI DÖNTÉSEK:
 *
 * 1. STREAMING GENERÁLÁS:
 *    Nem tartjuk memóriában az összes jelszót, hanem
 *    chunkokban (batch-ekben) generáljuk és streameljük.
 *    Ez kritikus 100.000 jelszavas adatbázisoknál, mert
 *    a Cloudflare Worker memória limitje korlátozott.
 *
 * 2. RFC 4180 KOMPATIBILITÁS:
 *    Proper CSV escaping, hogy Excel/LibreOffice gond
 *    nélkül megnyissa a fájlokat.
 *
 * 3. UTF-8 BOM:
 *    Az Excel így ismeri fel az UTF-8 kódolást, ami
 *    kritikus a nyelvspecifikus karakterkészleteknél
 *    (magyar ékezetek, cirill, japán, stb.)
 *
 * BŐVÍTÉS: Új CSV formátum hozzáadásához adj hozzá egy új
 * buildRow függvényt, és regisztráld a megfelelő helyen.
 */

import { buildCharset } from './charsets.js';

// ============================================================
// KONSTANSOK
// ============================================================

/** CSV fejléc - oszlopnevek */
export const CSV_HEADER = 'id,password,length,charset,entropy_bits\n';

/** UTF-8 BOM (Byte Order Mark) - Excel kompatibilitáshoz */
export const UTF8_BOM = '\uFEFF';

/** Alapértelmezett batch méret streaming generáláshoz */
export const DEFAULT_BATCH_SIZE = 1000;

/** Maximális sorok száma egyetlen request-ben */
export const MAX_ROWS_PER_REQUEST = 100000;

/** Maximális jelszó hossz */
export const MAX_PASSWORD_LENGTH = 4096;

// ============================================================
// BELSŐ SEGÉDFÜGGVÉNYEK (performance-optimalizált)
// ============================================================

/**
 * Kriptográfiailag biztonságos véletlen szám generálása
 * (belső használatra, optimalizált verzió)
 */
function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Gyors jelszó generálás PRE-BUILT charset stringből
 *
 * FONTOS: Ez a függvény NEM buildeli újra a charsetet,
 * hanem a megadott charsetString-et használja közvetlenül.
 * Ez kritikus a streaming generálás performance-ához,
 * mert 100.000 jelszónál a charset buildelés hatalmas
 * overhead lenne.
 *
 * @param {string} charsetString - Pre-built karakterkészlet
 * @param {number} length - Jelszó hossza
 * @returns {string} Generált jelszó
 */
function fastGeneratePassword(charsetString, length) {
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = secureRandomInt(charsetString.length);
    password += charsetString[index];
  }
  return password;
}

// ============================================================
// CSV ESCAPING (RFC 4180)
// ============================================================

/**
 * Egyetlen CSV mező escape-lése RFC 4180 szabvány szerint
 *
 * Szabályok:
 * - Ha a mező tartalmaz vesszőt, idézőjelet, újsort vagy
 *   kocsivisszát, idézőjelek közé kell tenni
 * - Az idézőjeleket duplázni kell: " → ""
 *
 * @param {*} field - Az escape-elendő mező
 * @returns {string} Escape-elt mező
 */
export function escapeCsvField(field) {
  const str = String(field);
  const needsQuoting =
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r');

  if (needsQuoting) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Egyetlen CSV sor generálása
 *
 * @param {number} id - Sor azonosító (1-től indul)
 * @param {string} password - A jelszó
 * @param {number} length - Jelszó hossza
 * @param {string} charsetName - Karakterkészlet neve
 * @param {number} entropyBits - Entropia bitekben
 * @returns {string} CSV sor újsorral a végén
 */
export function buildCsvRow(id, password, length, charsetName, entropyBits) {
  return [
    id,
    escapeCsvField(password),
    length,
    escapeCsvField(charsetName),
    entropyBits.toFixed(1),
  ].join(',') + '\n';
}

// ============================================================
// PARAMÉTER VALIDÁLÁS
// ============================================================

/**
 * Generálási paraméterek validálása és normalizálása
 *
 * @param {Object} options - Generálási opciók
 * @returns {Object} Validált és normalizált opciók
 * @throws {Error} Ha érvénytelen paraméterek
 */
export function validateOptions(options = {}) {
  const {
    count = 10000,
    length = 32,
    charset = 'alphanumericSymbols',
    excludeAmbiguous = false,
    batchSize = DEFAULT_BATCH_SIZE,
  } = options;

  // Count validálás
  const normalizedCount = Number(count);
  if (!Number.isInteger(normalizedCount) || normalizedCount < 1) {
    throw new Error(`Érvénytelen count: ${count}. Pozitív egész számnak kell lennie.`);
  }
  if (normalizedCount > MAX_ROWS_PER_REQUEST) {
    throw new Error(`Túl sok sor: ${normalizedCount}. Maximum: ${MAX_ROWS_PER_REQUEST}.`);
  }

  // Length validálás
  const normalizedLength = Number(length);
  if (!Number.isInteger(normalizedLength) || normalizedLength < 4) {
    throw new Error(`Érvénytelen length: ${length}. Minimum 4 karakter.`);
  }
  if (normalizedLength > MAX_PASSWORD_LENGTH) {
    throw new Error(`Túl hosszú jelszó: ${normalizedLength}. Maximum: ${MAX_PASSWORD_LENGTH}.`);
  }

  // BatchSize validálás (100 és 5000 között)
  const normalizedBatchSize = Math.max(100, Math.min(5000, Number(batchSize) || DEFAULT_BATCH_SIZE));

  return {
    count: normalizedCount,
    length: normalizedLength,
    charset,
    excludeAmbiguous: Boolean(excludeAmbiguous),
    batchSize: normalizedBatchSize,
  };
}

// ============================================================
// TELJES CSV GENERÁLÁS (kis méretekhez)
// ============================================================

/**
 * Teljes CSV generálása egyetlen stringként
 *
 * FIGYELEM: Csak kis méretekhez (max 10.000 sor), mert
 * az egész CSV-t memóriában tartja. Nagyobb méretnél
 * használd a generateCsvStream-et!
 *
 * @param {Object} options - Generálási opciók
 * @returns {string} Teljes CSV string
 */
export function generateCsv(options = {}) {
  const validated = validateOptions(options);
  const { count, length, charset, excludeAmbiguous } = validated;

  if (count > 10000) {
    throw new Error('generateCsv: max 10.000 sor. Nagyobb mérethez használd a generateCsvStream-et.');
  }

  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);
  const charsetDisplayName = charsetNames.join('+');
  const entropyPerChar = Math.log2(charsetString.length);
  const totalEntropy = length * entropyPerChar;

  let csv = UTF8_BOM + CSV_HEADER;

  for (let i = 0; i < count; i++) {
    const password = fastGeneratePassword(charsetString, length);
    csv += buildCsvRow(i + 1, password, length, charsetDisplayName, totalEntropy);
  }

  return csv;
}

// ============================================================
// STREAMING CSV GENERÁLÁS (nagy méretekhez)
// ============================================================

/**
 * Streaming CSV generálás ReadableStream-ként
 *
 * Ez a memória-hatékony megoldás nagy méretekhez.
 * Nem tartja memóriában az egész CSV-t, hanem chunkokban
 * generálja és streameli a választ.
 *
 * Használat Cloudflare Worker-ben:
 *   const stream = generateCsvStream({ count: 100000, length: 32 });
 *   return new Response(stream, {
 *     headers: { 'Content-Type': 'text/csv; charset=utf-8' }
 *   });
 *
 * @param {Object} options - Generálási opciók
 * @returns {ReadableStream} Streamelhető CSV adat
 */
export function generateCsvStream(options = {}) {
  const validated = validateOptions(options);
  const { count, length, charset, excludeAmbiguous, batchSize } = validated;
  const includeBom = options.includeBom !== false;

  // Karakterkészlet ELŐRE buildelése (performance kritikus!)
  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);

  if (charsetString.length === 0) {
    throw new Error('Üres karakterkészlet - nem lehet CSV-t generálni');
  }

  const charsetDisplayName = charsetNames.join('+');
  const entropyPerChar = Math.log2(charsetString.length);
  const totalEntropy = length * entropyPerChar;

  let generated = 0;
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      // BOM + fejléc küldése az elején
      const header = (includeBom ? UTF8_BOM : '') + CSV_HEADER;
      controller.enqueue(encoder.encode(header));
    },

    pull(controller) {
      // Egy batch generálása
      const batchEnd = Math.min(generated + batchSize, count);
      let chunk = '';

      for (let i = generated; i < batchEnd; i++) {
        const password = fastGeneratePassword(charsetString, length);
        chunk += buildCsvRow(i + 1, password, length, charsetDisplayName, totalEntropy);
      }

      controller.enqueue(encoder.encode(chunk));
      generated = batchEnd;

      // Progress callback (opcionális)
      if (options.onProgress) {
        options.onProgress(generated, count);
      }

      // Ha elkészültünk, zárjuk a streamet
      if (generated >= count) {
        controller.close();
      }
    },
  });
}

// ============================================================
// MÉRET BECSLÉS
// ============================================================

/**
 * Becsült CSV méret számítása (byte-ban)
 * Hasznos a Content-Length header beállításához és
 * a tömörítés hatékonyságának becsléséhez.
 *
 * @param {Object} options - Generálási opciók
 * @returns {Object} Méret becslés
 */
export function estimateCsvSize(options = {}) {
  const validated = validateOptions(options);
  const { count, length } = validated;

  // Fejléc mérete (UTF-8 BOM + fejléc)
  const headerSize = (UTF8_BOM + CSV_HEADER).length * 2;

  // Egy sor becsült mérete:
  // id (max 6) + password (length) + length (max 4)
  // + charset (max 30) + entropy (max 8) + 4 vessző + újsor
  const rowSize = 6 + length + 4 + 30 + 8 + 5;

  const totalSize = headerSize + (rowSize * count);

  return {
    estimatedBytes: totalSize,
    estimatedKB: Math.round(totalSize / 1024),
    estimatedMB: (totalSize / 1024 / 1024).toFixed(2),
    // Tömörítéssel általában 70-85% megtakarítás
    estimatedCompressedKB: Math.round(totalSize / 1024 * 0.2),
  };
}
