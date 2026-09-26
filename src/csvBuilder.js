/**
 * CSV Builder v3.0 - Fixed 24-column layout (A-Z)
 * Author: Andras I. Szilasi
 * 
 * LAYOUT RULES:
 * - ALWAYS 24 columns (A-Z in Excel)
 * - MIN_ROWS = 10, MAX_ROWS = 5000
 * - If count <= 240: rows = ceil(count/24), cols = 24
 * - If count > 120000: capped at 5000 rows × 24 cols = 120,000
 * - Passwords only, no header, no metadata
 * - UTF-8 BOM for Excel/LibreOffice
 * 
 * EXAMPLES:
 *   count=100    → 5 rows × 24 cols (120 cells, 100 filled)
 *   count=1000   → 42 rows × 24 cols
 *   count=10000  → 417 rows × 24 cols
 *   count=100000 → 4167 rows × 24 cols
 *   count=200000 → 5000 rows × 24 cols (capped at 120,000)
 */

import { buildCharset } from './charsets.js';

// ═══ CONSTANTS ═══
const FIXED_COLS = 24;      // Always A-Z (24 columns)
const MIN_ROWS = 10;         // Minimum rows
const MAX_ROWS = 5000;       // Maximum rows (Excel friendly)
const UTF8_BOM = '\ufeff';

// ═══ CORE FUNCTIONS ═══

function generatePassword(length, charset) {
  const charsetLength = charset.length;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charsetLength];
  }
  return password;
}

function escapeCSV(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Calculate layout: ALWAYS 24 columns
 */
function calculateLayout(count) {
  const cols = FIXED_COLS; // Always 24
  let rows = Math.ceil(count / cols);
  
  // Apply min/max constraints
  rows = Math.max(MIN_ROWS, Math.min(rows, MAX_ROWS));
  
  // Actual passwords that fit
  const capacity = rows * cols;
  const actualCount = Math.min(count, capacity);
  
  return { rows, cols, totalCells: capacity, actualCount };
}

/**
 * Generate CSV as ReadableStream (24 columns always)
 */
export function generateCsvStream({ count, length, charset, excludeAmbiguous, batchSize = 1000 }) {
  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);
  const { rows, cols, actualCount } = calculateLayout(count);
  
  const encoder = new TextEncoder();
  let currentRow = 0;
  let bomSent = false;
  let generatedCount = 0;
  
  const stream = new ReadableStream({
    pull(controller) {
      if (currentRow >= rows) {
        controller.close();
        return;
      }
      
      let chunk = '';
      if (!bomSent) {
        chunk += UTF8_BOM;
        bomSent = true;
      }
      
      // Generate 24 passwords for this row (column-major order)
      const rowPasswords = [];
      for (let col = 0; col < cols; col++) {
        const idx = currentRow + col * rows;
        if (idx < actualCount && generatedCount < actualCount) {
          rowPasswords.push(generatePassword(length, charsetString));
          generatedCount++;
        } else {
          rowPasswords.push(''); // Empty cell
        }
      }
      
      chunk += rowPasswords.map(escapeCSV).join(',');
      chunk += '\n';
      
      controller.enqueue(encoder.encode(chunk));
      currentRow++;
    }
  });
  
  return stream;
}

/**
 * Estimate CSV size
 */
export function estimateCsvSize({ count, length }) {
  const { rows, cols, actualCount } = calculateLayout(count);
  const bytesPerRow = (length * cols) + (cols - 1) + 1; // passwords + commas + newline
  const totalBytes = bytesPerRow * rows + 3; // +3 for BOM
  const estimatedKB = Math.ceil(totalBytes / 1024);
  
  return {
    rows,
    cols,
    totalPasswords: actualCount,
    requestedCount: count,
    estimatedKB,
    layout: `${rows} rows × ${cols} columns (A-Z)`
  };
}

/**
 * Generate sample (10 passwords, single column for readability)
 */
export function generateSampleCsv({ length, charset, excludeAmbiguous, sampleCount = 10 }) {
  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);
  
  const passwords = [];
  for (let i = 0; i < sampleCount; i++) {
    passwords.push(generatePassword(length, charsetString));
  }
  
  return UTF8_BOM + passwords.map(p => escapeCSV(p)).join('\n') + '\n';
}
