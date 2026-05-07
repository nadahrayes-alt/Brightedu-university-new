/**
 * Smart Campus Assistant — intent router.
 *
 * Maps a free-text utterance (voice transcription or text fallback) to an
 * intent in the catalog. The matcher is deliberately simple: it normalises
 * Arabic and English and scores each phrase by token overlap. If no candidate
 * crosses a confidence threshold the router returns the ambiguous intent so
 * the UI can prompt the user to clarify.
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

/** Normalise an Arabic or English string for matching. Strips diacritics,
 *  unifies alef/yaa/taa-marbuta variants, drops punctuation, and lowercases. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    // strip Arabic diacritics (U+064B–U+0652, U+0670, U+06D6–U+06ED)
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
    // collapse non-letters to spaces (keep arabic + latin + digits)
    .replace(/[^؀-ۿݐ-ݿa-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

  // Substring of either direction is a strong signal — short phrases should
  // still match longer queries that contain them.
  let score = 0;
  if (nq.includes(np)) score += 60;
  else if (np.includes(nq)) score += 40;

  const qTokens = new Set(tokens(query));
  const pTokens = tokens(phrase);
  if (pTokens.length === 0) return score;

  let overlap = 0;
  for (const t of pTokens) if (qTokens.has(t)) overlap += 1;
  // Token-overlap ratio (0..1) scaled into the score.
  score += (overlap / pTokens.length) * 30;

  // Penalise tiny token-overlap with long query (likely a different request).
  if (overlap === 0) return Math.max(score - 10, 0);
  return score;
}

export interface RouterMatch {
  intent: IntentDef;
  /** 0..100. Anything below `MIN_CONFIDENCE` is treated as ambiguous. */
  confidence: number;
  /** The raw phrase that matched best (useful for diagnostics). */
  matchedPhrase?: string;
}

const MIN_CONFIDENCE = 35;

/** Match a free-text query to its best-fitting intent. Falls back to the
 *  ambiguous intent below the confidence threshold. */
export function matchIntent(query: string): RouterMatch {
  if (!query || !normalize(query)) {
    return { intent: AMBIGUOUS_INTENT, confidence: 0 };
  }

  let best: RouterMatch = { intent: AMBIGUOUS_INTENT, confidence: 0 };

  for (const intent of INTENTS) {
    const allPhrases = [...intent.phrasesAr, ...intent.phrasesEn];
    for (const phrase of allPhrases) {
      const s = scorePhrase(query, phrase);
      if (s > best.confidence) {
        best = { intent, confidence: s, matchedPhrase: phrase };
      }
    }
  }

  if (best.confidence < MIN_CONFIDENCE) {
    return { intent: AMBIGUOUS_INTENT, confidence: best.confidence };
  }
  return best;
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

  // Intent shortcut → resolve to the answer page for that intent.
  if (action.to.startsWith('#intent:')) {
    const intentId = action.to.slice('#intent:'.length);
    return `/assistant/intent/${intentId}`;
  }

  // Verify-kind action: always gate behind /verify with the destination as
  // the post-verification target.
  if (action.kind === 'verify') {
    return buildVerifyHref(action.to);
  }

  // Defensive: any private intent action with a target that is NOT the
  // refusal / map / hours / catalog public pages should still gate behind
  // verify, even if the action wasn't explicitly tagged. We rely on intent
  // authoring to mark verify actions correctly, but this guard keeps us
  // honest if a `kind` is forgotten on a private/restricted/human-decision
  // intent.
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
