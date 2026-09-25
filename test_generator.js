#!/usr/bin/env node
/**
 * Password Generator Teszt Script
 */

const {
  generatePassword,
  generateMultiple,
  generateFromPreset,
  analyzeStrength,
  getAvailablePresets,
} = require('./src/passwordGenerator');

console.log('========================================');
console.log('Password Generator Teszt');
console.log('========================================\n');

// 1. Egyszerű generálás
console.log('1. Alap jelszó generálás:');
const basic = generatePassword({ length: 12, charsets: ['lowercase', 'uppercase', 'digits'] });
console.log(`   ${basic}\n`);

// 2. Erős jelszó
console.log('2. Erős jelszó generálás:');
const strong = generatePassword({
  length: 16,
  charsets: ['lowercase', 'uppercase', 'digits', 'symbols'],
});
console.log(`   ${strong}\n`);

// 3. Preset használata
console.log('3. Magyar 4096 preset:');
const magyar = generateFromPreset('magyar4096');
console.log(`   ${magyar}\n`);

// 4. Több jelszó
console.log('4. 5 darab hex jelszó:');
const hexPasswords = generateMultiple(5, { length: 32, charsets: ['hex'] });
hexPasswords.forEach((pwd, i) => {
  console.log(`   ${i + 1}. ${pwd}`);
});
console.log('');

// 5. Erősség elemzés
console.log('5. Erősség elemzés:');
const testPasswords = [
  'password123',
  'MyP@ssw0rd',
  strong,
  magyar,
];

testPasswords.forEach(pwd => {
  const analysis = analyzeStrength(pwd);
  console.log(`   Jelszó: ${pwd.substring(0, 20)}${pwd.length > 20 ? '...' : ''}`);
  console.log(`   Hossz: ${analysis.length}`);
  console.log(`   Entropia: ${analysis.entropy.toFixed(2)} bit`);
  console.log(`   Pontszám: ${analysis.score}/10`);
  console.log(`   Értékelés: ${analysis.rating.toUpperCase()}`);
  console.log('');
});

// 6. Elérhető presetek
console.log('6. Elérhető presetek:');
const presets = getAvailablePresets();
presets.forEach(preset => {
  console.log(`   - ${preset.name}: ${preset.description} (${preset.length} karakter)`);
});

console.log('\n========================================');
console.log('Teszt befejezve!');
console.log('========================================');
