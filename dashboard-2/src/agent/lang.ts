/**
 * Smart Campus Assistant — language detection.
 *
 * Pure utility. Inspects an utterance, returns the dominant language, and
 * picks the reply language so the assistant always answers in the language
 * the user used. Falls back to the current UI language when the input is too
 * short or non-linguistic (digits, symbols).
 *
 * Heuristic:
 *   • Pure Latin letters → English.
 *   • Pure Arabic characters → Arabic.
 *   • Mixed → Arabic dominates when there's at least one full Arabic word
 *     (≥ 3 Arabic characters). Reasoning: Arabic speakers commonly borrow
 *     English nouns ("ابغى transcript") but the carrier sentence is Arabic;
 *     pure-English speakers don't typically embed Arabic words.
 */

export type Lang = 'ar' | 'en';
export type DetectedLang = 'ar' | 'en' | 'mixed' | 'unknown';

export interface LangDetection {
  detected: DetectedLang;
  /** Best guess for the reply language. `null` when we have no signal at
   *  all (digits, symbols, empty). */
  dominant: Lang | null;
  arabicChars: number;
  latinChars: number;
}

/** Arabic block + supplements + presentation forms. */
const ARABIC_RANGE = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g;
const LATIN_LETTER = /[a-zA-Z]/g;

export function detectLanguage(text: string): LangDetection {
  const arabicChars = (text.match(ARABIC_RANGE) ?? []).length;
  const latinChars = (text.match(LATIN_LETTER) ?? []).length;

  if (arabicChars === 0 && latinChars === 0) {
    return { detected: 'unknown', dominant: null, arabicChars, latinChars };
  }

  // ≥ 3 Arabic characters means at least one short Arabic word is present;
  // we treat the input as Arabic-dominant even when English is also present.
  if (arabicChars >= 3) {
    return {
      detected: latinChars > 0 ? 'mixed' : 'ar',
      dominant: 'ar',
      arabicChars,
      latinChars,
    };
  }

  // Otherwise the input is meaningfully English (or has stray Arabic letters
  // that aren't enough to flip the dominant language).
  if (latinChars > 0) {
    return {
      detected: arabicChars > 0 ? 'mixed' : 'en',
      dominant: 'en',
      arabicChars,
      latinChars,
    };
  }

  // ≤ 2 Arabic characters and no Latin: too short to commit either way.
  return { detected: 'unknown', dominant: null, arabicChars, latinChars };
}

/** Pick the language the assistant should reply in. Detected language wins;
 *  falls back to the current UI language for ambiguous/empty input. */
export function pickReplyLang(detection: LangDetection, uiLang: Lang): Lang {
  return detection.dominant ?? uiLang;
}
