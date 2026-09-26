/**
 * ============================================================
 * CSV Builder Module v2.0 - Password-Only Column Layout
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * Date: 2026-09-25
 * ============================================================
 * 
 * NEW FORMAT (Boldwelder Specification):
 * - NO header row (only passwords)
 * - NO metadata (no id, no length, no entropy)
 * - MAX 5000 ROWS (Excel/LibreOffice friendly)
 * - Passwords arranged in COLUMNS to fit all passwords
 * - If count > 5000: ROWS=5000, COLS=ceil(count/5000)
 * - If count <= 5000: ROWS=count, COLS=1
 * 
 * EXAMPLE (count=10000):
 *   Row 1:    pw_1,  pw_5001
 *   Row 2:    pw_2,  pw_5002
 *   ...
 *   Row 5000: pw_5000, pw_10000
 * 
 * EXAMPLE (count=100000):
 *   5000 rows × 20 columns = 100000 passwords
 */

import { buildCharset } from './charsets.js';

// ============================================================
// CONSTANTS
// ============================================================

/** Maximum rows in output (Excel/LibreOffice friendly) */
const MAX_ROWS = 5000;

/** UTF-8 BOM for Excel compatibility with special characters */
const UTF8_BOM = '\ufeff';

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Generate a single secure password
 * @param {number} length - Password length
 * @param {string} charset - Character set to use
 * @returns {string} Generated password
 */
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

/**
 * Escape CSV field (RFC 4180)
 * If contains comma, quote, or newline: wrap in quotes and escape quotes
 */
function escapeCSV(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Calculate optimal grid layout
 * @param {number} count - Total password count
 * @returns {{rows: number, cols: number, totalCells: number}}
 */
function calculateLayout(count) {
  const rows = Math.min(MAX_ROWS, count);
  const cols = Math.ceil(count / rows);
  const totalCells = rows * cols;
  return { rows, cols, totalCells };
}

/**
 * Generate password grid as array of rows (each row = array of passwords)
 */
function generatePasswordGrid({ count, length, charset, batchSize }) {
  const { rows, cols } = calculateLayout(count);
  
  // Initialize grid: rows × cols, fill with empty strings
  const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
  
  // Generate all passwords and place in column-major order
  // (fill column by column, so grid[row][col] = password at index row + col*rows)
  let generatedCount = 0;
  for (let col = 0; col < cols && generatedCount < count; col++) {
    for (let row = 0; row < rows && generatedCount < count; row++) {
      grid[row][col] = generatePassword(length, charset);
      generatedCount++;
    }
  }
  
  return { grid, rows, cols };
}

/**
 * Convert password grid to CSV string
 */
function gridToCsv(grid, includeBom = true) {
  const lines = grid.map(row => row.map(escapeCSV).join(','));
  const csv = lines.join('\n') + '\n';
  return includeBom ? UTF8_BOM + csv : csv;
}

/**
 * Generate CSV as a ReadableStream (memory-efficient for large counts)
 */
export function generateCsvStream({ count, length, charset, excludeAmbiguous, batchSize = 1000 }) {
  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);
  const { rows, cols } = calculateLayout(count);
  
  const encoder = new TextEncoder();
  let currentRow = 0;
  let bomSent = false;
  
  const stream = new ReadableStream({
    pull(controller) {
      if (currentRow >= rows) {
        controller.close();
        return;
      }
      
      // Send BOM on first chunk
      let chunk = '';
      if (!bomSent) {
        chunk += UTF8_BOM;
        bomSent = true;
      }
      
      // Generate this row's passwords (column-major: password at [row][col] = index row + col*rows)
      const rowPasswords = [];
      for (let col = 0; col < cols; col++) {
        const idx = currentRow + col * rows;
        if (idx < count) {
          rowPasswords.push(generatePassword(length, charsetString));
        } else {
          rowPasswords.push(''); // Empty cell for padding
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
 * Estimate CSV size for headers
 */
export function estimateCsvSize({ count, length }) {
  const { rows, cols } = calculateLayout(count);
  const commasPerRow = Math.max(0, cols - 1);
  const newlineChars = 1;
  const bytesPerPassword = length; // ASCII approx (UTF-8 could be more)
  const bytesPerRow = (bytesPerPassword * cols) + commasPerRow + newlineChars;
  const totalBytes = bytesPerRow * rows + 3; // +3 for UTF-8 BOM
  const estimatedKB = Math.ceil(totalBytes / 1024);
  
  return {
    rows,
    cols,
    totalPasswords: count,
    estimatedKB,
    layout: `${rows} rows × ${cols} columns`
  };
}

/**
 * Generate a small sample CSV for live demo (first 10 passwords, single column)
 */
export function generateSampleCsv({ length, charset, excludeAmbiguous, sampleCount = 10 }) {
  const charsetNames = Array.isArray(charset) ? charset : [charset];
  const charsetString = buildCharset(charsetNames, excludeAmbiguous);
  
  const passwords = [];
  for (let i = 0; i < sampleCount; i++) {
    passwords.push(generatePassword(length, charsetString));
  }
  
  // Single column sample for demo (easier to read in browser)
  const csv = passwords.map(p => escapeCSV(p)).join('\n');
  return UTF8_BOM + csv + '\n';
}