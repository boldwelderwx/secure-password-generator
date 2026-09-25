/**
 * ============================================================
 * Secure Password Database Generator - Character Sets Module
 * Version: 0.1.0-beta.1
 * Author: Andras I. Szilasi <boldwelderwx@icloud.com>
 * ============================================================
 * 
 * Ez a modul tartalmazza az összes karakterkészletet,
 * amit a jelszó-generátor használhat.
 * 
 * Bővítés: Új karakterkészlet hozzáadásához egyszerűen
 * adj hozzá egy új bejegyzést a CHARSETS objektumhoz.
 * 
 * Példa:
 *   myCustom: {
 *     name: 'My Custom Set',
 *     chars: 'abc123!@#',
 *     description: 'Custom charset for special purposes'
 *   }
 */

// ============================================================
// ALAP KARAKTERKÉSZLETEK
// ============================================================

export const CHARSETS = {
  // Kisbetűk (angol)
  lowercase: {
    name: 'Lowercase',
    chars: 'abcdefghijklmnopqrstuvwxyz',
    description: 'English lowercase letters (a-z)',
  },

  // Nagybetűk (angol)
  uppercase: {
    name: 'Uppercase',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    description: 'English uppercase letters (A-Z)',
  },

  // Számok
  digits: {
    name: 'Digits',
    chars: '0123456789',
    description: 'Numeric digits (0-9)',
  },

  // Speciális karakterek
  symbols: {
    name: 'Symbols',
    chars: '!@#$%^&*()_+-=[]{}|;:,.<>?/~',
    description: 'Common special characters',
  },

  // Kombinált: alfanumerikus
  alphanumeric: {
    name: 'Alphanumeric',
    chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    description: 'Letters and digits (a-z, A-Z, 0-9)',
  },

  // Kombinált: alfanumerikus + szimbólumok
  alphanumericSymbols: {
    name: 'Alphanumeric + Symbols',
    chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~',
    description: 'Letters, digits, and special characters',
  },

  // Hexadecimális
  hex: {
    name: 'Hexadecimal',
    chars: '0123456789abcdef',
    description: 'Hexadecimal characters (0-9, a-f)',
  },

  // Hexadecimális nagybetűs
  hexUpper: {
    name: 'Hexadecimal (Uppercase)',
    chars: '0123456789ABCDEF',
    description: 'Hexadecimal characters uppercase (0-9, A-F)',
  },

  // Base64
  base64: {
    name: 'Base64',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    description: 'Base64 character set',
  },

  // Base64 URL-safe
  base64url: {
    name: 'Base64 URL-safe',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    description: 'URL-safe Base64 character set',
  },
};

// ============================================================
// NYELVSPECIFIKUS KARAKTERKÉSZLETEK
// ============================================================

export const LANGUAGE_CHARSETS = {
  // Magyar (ékezetes karakterekkel)
  hungarian: {
    name: 'Hungarian',
    chars: 'aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyzAÁBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ0123456789',
    description: 'Hungarian alphabet with accented characters',
  },

  // Lengyel (ékezetes karakterekkel)
  polish: {
    name: 'Polish',
    chars: 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ0123456789',
    description: 'Polish alphabet with accented characters',
  },

  // Német (ékezetes karakterekkel)
  german: {
    name: 'German',
    chars: 'abcdefghijklmnopqrstuvwxyzäöüßABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789',
    description: 'German alphabet with umlauts and eszett',
  },

  // Francia (ékezetes karakterekkel)
  french: {
    name: 'French',
    chars: 'abcdefghijklmnopqrstuvwxyzàâäéèêëïîôùûüÿçABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ0123456789',
    description: 'French alphabet with accented characters',
  },

  // Spanyol (ékezetes karakterekkel)
  spanish: {
    name: 'Spanish',
    chars: 'abcdefghijklmnopqrstuvwxyzáéíóúüñABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ0123456789',
    description: 'Spanish alphabet with accented characters',
  },

  // Olasz (ékezetes karakterekkel)
  italian: {
    name: 'Italian',
    chars: 'abcdefghijklmnopqrstuvwxyzàèéìòùABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ0123456789',
    description: 'Italian alphabet with accented characters',
  },

  // Portugál (ékezetes karakterekkel)
  portuguese: {
    name: 'Portuguese',
    chars: 'abcdefghijklmnopqrstuvwxyzáâãàéêíóôõúçABCDEFGHIJKLMNOPQRSTUVWXYZÁÂÃÀÉÊÍÓÔÕÚÇ0123456789',
    description: 'Portuguese alphabet with accented characters',
  },

  // Orosz (cirill)
  russian: {
    name: 'Russian',
    chars: 'абвгдежзиклмнопрстуфхцчшщъыьэюяАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789',
    description: 'Russian Cyrillic alphabet',
  },

  // Ukrán (cirill)
  ukrainian: {
    name: 'Ukrainian',
    chars: 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюяАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ0123456789',
    description: 'Ukrainian Cyrillic alphabet',
  },

  // Görög
  greek: {
    name: 'Greek',
    chars: 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789',
    description: 'Greek alphabet',
  },

  // Török (ékezetes karakterekkel)
  turkish: {
    name: 'Turkish',
    chars: 'abcçdefgğhıijklmnoöpqrsştuüvwxyzABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZ0123456789',
    description: 'Turkish alphabet with special characters',
  },

  // Cseh (ékezetes karakterekkel)
  czech: {
    name: 'Czech',
    chars: 'aábcčdďeěfghchiíjklmnňoópqrřsštťuúůvwxyýzžAÁBCČDĎEĚFGHCHIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽ0123456789',
    description: 'Czech alphabet with accented characters',
  },

  // Szlovák (ékezetes karakterekkel)
  slovak: {
    name: 'Slovak',
    chars: 'aábcčdďeéfghchiíjklĺľmnňoóôpqrŕsštťuúvwxyýzžAÁBCČDĎEÉFGHCHIÍJKLĹĽMNŇOÓÔPQRŔSŠTŤUÚVWXYÝZŽ0123456789',
    description: 'Slovak alphabet with accented characters',
  },

  // Román (ékezetes karakterekkel)
  romanian: {
    name: 'Romanian',
    chars: 'aăâbcdefghiîjklmnopqrsștțuvwxyzAĂÂBCDEFGHIÎJKLMNOPQRSȘTȚUVWXYZ0123456789',
    description: 'Romanian alphabet with special characters',
  },

  // Japán (hiragana)
  japanese: {
    name: 'Japanese (Hiragana)',
    chars: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
    description: 'Japanese Hiragana characters',
  },

  // Kínai (gyakori karakterek - csak példa)
  chinese: {
    name: 'Chinese (Common)',
    chars: '的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感',
    description: 'Common Chinese characters',
  },

  // Koreai (gyakori karakterek - csak példa)
  korean: {
    name: 'Korean (Common)',
    chars: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ',
    description: 'Korean Hangul jamo',
  },

  // Arab
  arabic: {
    name: 'Arabic',
    chars: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
    description: 'Arabic alphabet',
  },

  // Héber
  hebrew: {
    name: 'Hebrew',
    chars: 'אבגדהוזחטיכלמנסעפצקרשת',
    description: 'Hebrew alphabet',
  },

  // Hindi (devanagari)
  hindi: {
    name: 'Hindi (Devanagari)',
    chars: 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह',
    description: 'Hindi Devanagari characters',
  },
};

// ============================================================
// FÉLREÉRTHETŐ KARAKTEREK (kizárhatók)
// ============================================================

export const AMBIGUOUS_CHARS = 'Il1O0oB8S5G6';

/**
 * Karakterkészlet összeállítása a megadott nevek alapján
 * @param {string[]} charsetNames - Karakterkészlet nevek tömbje
 * @param {boolean} excludeAmbiguous - Félreérthető karakterek kizárása
 * @returns {string} Összeállított karakterkészlet
 */
export function buildCharset(charsetNames, excludeAmbiguous = false) {
  let combined = '';

  for (const name of charsetNames) {
    const charset = CHARSETS[name] || LANGUAGE_CHARSETS[name];
    if (charset) {
      combined += charset.chars;
    }
  }

  // Duplikátumok eltávolítása
  combined = [...new Set(combined)].join('');

  // Félreérthető karakterek kizárása
  if (excludeAmbiguous) {
    combined = combined
      .split('')
      .filter(c => !AMBIGUOUS_CHARS.includes(c))
      .join('');
  }

  return combined;
}

/**
 * Összes elérhető karakterkészlet listája
 * @returns {Object} Karakterkészletek összesített listája
 */
export function getAllCharsets() {
  return {
    basic: CHARSETS,
    languages: LANGUAGE_CHARSETS,
  };
}
