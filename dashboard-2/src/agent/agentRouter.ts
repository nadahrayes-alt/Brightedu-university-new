/**
 * Smart Campus Assistant — multilingual intent router.
 *
 * Pipeline:
 *   raw input
 *     → language detection (ar / en / mixed / unknown)
 *     → normalisation (Arabic diacritics, alef variants, dialect collapsing,
 *       latin lowercase + punctuation)
 *     → intent matching (substring + token overlap against the catalog's
 *       multilingual phrase synonyms)
 *     → confidence level (high / medium / low / none)
 *     → reply-language pick (detected language, falling back to UI language)
 *
 * No JSX, no React. Pure data → data so it can be unit-tested in isolation.
 */

import {
  AMBIGUOUS_INTENT,
  INTENT_BY_ID,
  INTENTS,
  type IntentAction,
  type IntentCategory,
  type IntentDef,
} from './intents';
import { requiresVerification, buildVerifyHref } from './agentRules';
import { detectLanguage, pickReplyLang, type Lang, type LangDetection } from './lang';

/** Normalise an Arabic or English string for matching. Strips diacritics,
 *  unifies alef/yaa/taa-marbuta variants, collapses common Saudi-dialect
 *  spellings (ابغى/ابى/ابي → ابي), drops punctuation, and lowercases. */
export function normalize(input: string): string {
  let out = input
    .toLowerCase()
    .normalize('NFKD')
    // strip Arabic diacritics
    .replace(/[ً-ْٰۖ-ۭ]/g, '')
    // unify alef family
    .replace(/[آأإٱ]/g, 'ا')
    // unify yaa
    .replace(/ى/g, 'ي')
    // unify taa marbuta → haa
    .replace(/ة/g, 'ه')
    // unify hamza on waw / yaa
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    // tatweel
    .replace(/ـ/g, '');

  // Saudi-dialect / casual collapsing — keeps the matcher tolerant of common
  // spellings without forcing authors to enumerate every variant.
  out = out
    .replace(/\bابغي\b/g, 'ابي')
    .replace(/\bابغى\b/g, 'ابي')
    .replace(/\bابى\b/g, 'ابي')
    .replace(/\bأبغي\b/g, 'ابي')
    .replace(/\bأبغى\b/g, 'ابي')
    .replace(/\bاريد\b/g, 'ابي')
    .replace(/\bأريد\b/g, 'ابي')
    .replace(/\bوش\b/g, 'ايش')
    .replace(/\bإيش\b/g, 'ايش')
    .replace(/\bفين\b/g, 'وين')
    .replace(/\bأين\b/g, 'وين');

  // collapse non-letters (keep arabic + latin + digits)
  out = out
    .replace(/[^؀-ۿݐ-ݿa-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return out;
}

function tokens(input: string): string[] {
  const n = normalize(input);
  return n.length === 0 ? [] : n.split(' ');
}

/** Score how well a candidate phrase matches a query. Higher = better.
 *  Substring match contributes the most; token overlap is the tiebreaker. */
function scorePhrase(query: string, phrase: string): number {
  const nq = normalize(query);
  const np = normalize(phrase);
  if (!nq || !np) return 0;

  // Exact match wins.
  if (nq === np) return 100;

  let score = 0;
  if (nq.includes(np)) score += 60;
  else if (np.includes(nq)) score += 40;

  const qTokens = new Set(tokens(query));
  const pTokens = tokens(phrase);
  if (pTokens.length === 0) return score;

  let overlap = 0;
  for (const t of pTokens) if (qTokens.has(t)) overlap += 1;
  score += (overlap / pTokens.length) * 30;

  if (overlap === 0) return Math.max(score - 10, 0);
  return score;
}

export type Confidence = 'high' | 'medium' | 'low' | 'none';

export interface RouterMatch {
  intent: IntentDef;
  /** 0..130. Anything below `MIN_CONFIDENCE` falls back to ambiguous. */
  confidence: number;
  level: Confidence;
  /** Detected input language and reply-language pick. */
  detection: LangDetection;
  replyLang: Lang;
  matchedPhrase?: string;
}

const MIN_CONFIDENCE = 35;
const HIGH_CONFIDENCE = 70;

function levelFor(score: number): Confidence {
  if (score === 0) return 'none';
  if (score < MIN_CONFIDENCE) return 'low';
  if (score < HIGH_CONFIDENCE) return 'medium';
  return 'high';
}

/** Match a free-text query to its best-fitting intent. Falls back to the
 *  ambiguous intent below the confidence threshold. The reply language is
 *  always set: the dominant language of the input, or `uiLang` for empty /
 *  non-linguistic input. */
export function matchIntent(query: string, uiLang: Lang = 'ar'): RouterMatch {
  const detection = detectLanguage(query);
  const replyLang = pickReplyLang(detection, uiLang);

  if (!query || !normalize(query)) {
    return {
      intent: AMBIGUOUS_INTENT,
      confidence: 0,
      level: 'none',
      detection,
      replyLang,
    };
  }

  let bestIntent: IntentDef = AMBIGUOUS_INTENT;
  let bestScore = 0;
  let bestPhrase: string | undefined;

  for (const intent of INTENTS) {
    const allPhrases = [...intent.phrasesAr, ...intent.phrasesEn];
    for (const phrase of allPhrases) {
      const s = scorePhrase(query, phrase);
      if (s > bestScore) {
        bestIntent = intent;
        bestScore = s;
        bestPhrase = phrase;
      }
    }
  }

  if (bestScore < MIN_CONFIDENCE) {
    return {
      intent: AMBIGUOUS_INTENT,
      confidence: bestScore,
      level: 'low',
      detection,
      replyLang,
    };
  }

  return {
    intent: bestIntent,
    confidence: bestScore,
    level: levelFor(bestScore),
    detection,
    replyLang,
    matchedPhrase: bestPhrase,
  };
}

/** Look up an intent by its ID — used by quick-action chips and intent links. */
export function getIntent(id: string): IntentDef {
  return INTENT_BY_ID[id] ?? AMBIGUOUS_INTENT;
}

/** Where should an action button take the user?
 *
 *  - `kind: 'verify'` and any private/human/restricted intent must always
 *    route through `/verify?next=<target>` first.
 *  - `to: '#intent:<id>'` is a "navigate to another intent's response card"
 *    shortcut, used to chain related public/private flows from action chips.
 *  - Otherwise the action navigates directly to its `to` URL.
 *
 *  Returns `null` for non-navigation actions (`back`, `retry`, `home`) so the
 *  caller can handle them with imperative navigation. */
export function resolveActionHref(
  action: IntentAction,
  intentCategory: IntentCategory,
): string | null {
  if (!action.to) return null;

  if (action.to.startsWith('#intent:')) {
    const intentId = action.to.slice('#intent:'.length);
    return `/assistant/intent/${intentId}`;
  }

  if (action.kind === 'verify') {
    return buildVerifyHref(action.to);
  }

  if (
    requiresVerification(intentCategory) &&
    !action.to.startsWith('/refusal') &&
    !action.to.startsWith('/map') &&
    !action.to.startsWith('/hours') &&
    !action.to.startsWith('/services') &&
    !action.to.startsWith('/library/catalog') &&
    !action.to.startsWith('/library/study-rooms') &&
    !action.to.startsWith('/clinic/appointments') &&
    !action.to.startsWith('/clinic/info') &&
    !action.to.startsWith('/clinic/emergency') &&
    !action.to.startsWith('/cafeteria') &&
    !action.to.startsWith('/events') &&
    !action.to.startsWith('/clubs') &&
    !action.to.startsWith('/rooms/availability') &&
    !action.to.startsWith('/admissions/inquiry') &&
    !action.to.startsWith('/student-affairs/info') &&
    !action.to.startsWith('/tech/sso') &&
    !action.to.startsWith('/tech/wifi') &&
    !action.to.startsWith('/queue') &&
    !action.to.startsWith('/assistant')
  ) {
    return buildVerifyHref(action.to);
  }

  return action.to;
}
