/**
 * Smart Campus Assistant — agent rules.
 *
 * Pure mapping helpers. Given an intent (or its category), return the badge,
 * banner copy, and tone the response card should render.
 *
 * No JSX here — keep this file framework-agnostic so it can be unit-tested
 * later without React.
 */

import type { IntentCategory, IntentDef } from './intents';

export type BadgeTone =
  | 'public-safe'
  | 'needs-qr'
  | 'private'
  | 'unavailable'
  | 'black-tier';

export interface CategoryStyle {
  /** Default badge label per language. */
  badgeAr: string;
  badgeEn: string;
  /** Chip tone (matches Chip component's `tone` prop). */
  tone: BadgeTone;
  /** Icon kind for the badge — keep it serialisable so the renderer can map. */
  iconKind: 'shield' | 'lock' | 'gavel' | 'alert';
}

export const CATEGORY_STYLES: Record<IntentCategory, CategoryStyle> = {
  'public-safe': {
    badgeAr: 'عام وآمن',
    badgeEn: 'Public-safe',
    tone: 'public-safe',
    iconKind: 'shield',
  },
  private: {
    badgeAr: 'يحتاج تحقق آمن',
    badgeEn: 'Secure verification required',
    tone: 'needs-qr',
    iconKind: 'shield',
  },
  'human-decision': {
    badgeAr: 'قرار بشري مطلوب',
    badgeEn: 'Human decision required',
    tone: 'unavailable',
    iconKind: 'gavel',
  },
  restricted: {
    badgeAr: 'خاص — جوال فقط',
    badgeEn: 'Private — phone only',
    tone: 'black-tier',
    iconKind: 'lock',
  },
  ambiguous: {
    badgeAr: 'بحاجة لتوضيح',
    badgeEn: 'Needs clarification',
    tone: 'private',
    iconKind: 'alert',
  },
};

/** Returns true when the assistant must route the user through University ID
 *  verification before any continuation (private, human-decision, restricted). */
export function requiresVerification(category: IntentCategory): boolean {
  return (
    category === 'private' ||
    category === 'human-decision' ||
    category === 'restricted'
  );
}

/** Returns true when QR continuation is allowed AFTER University ID
 *  verification. QR is never used for public-safe or ambiguous intents. */
export function allowsQrContinuation(category: IntentCategory): boolean {
  return requiresVerification(category);
}

/** Should the response card show the privacy banner under it? */
export function showsPrivacyReassurance(category: IntentCategory): boolean {
  // Always show the banner — kiosk is public, the banner is global.
  // This helper exists so the rule is centralised and easy to change.
  return true;
}

/** A short reassurance line for the response card, customised per category. */
export function privacyReassurance(
  category: IntentCategory,
  lang: 'ar' | 'en',
): string {
  if (category === 'public-safe' || category === 'ambiguous') {
    return lang === 'ar'
      ? 'لن يتم عرض أي بيانات شخصية على هذه الشاشة.'
      : 'No personal data will be shown on this screen.';
  }
  // private / human-decision / restricted
  return lang === 'ar'
    ? 'ستكمل التفاصيل من جوالك بعد التحقق.'
    : 'You will complete the details on your phone after verification.';
}

/** Resolve the badge to display for an intent. Intent-level overrides win. */
export function resolveBadge(
  intent: IntentDef,
  lang: 'ar' | 'en',
): { label: string; tone: BadgeTone; iconKind: CategoryStyle['iconKind'] } {
  const base = CATEGORY_STYLES[intent.category];
  return {
    label:
      lang === 'ar'
        ? (intent.badgeAr ?? base.badgeAr)
        : (intent.badgeEn ?? base.badgeEn),
    tone: intent.badgeTone ?? base.tone,
    iconKind: intent.badgeIconKind ?? base.iconKind,
  };
}

/** Build the verification "next" route for an intent. Used when an action with
 *  `kind: 'verify'` defines `to` as a private flow target — we route via
 *  `/verify?next=<encoded>` so University ID is always asked first. */
export function buildVerifyHref(targetRoute: string): string {
  return `/verify?next=${encodeURIComponent(targetRoute)}`;
}
