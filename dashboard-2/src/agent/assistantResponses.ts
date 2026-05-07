/**
 * Smart Campus Assistant — response templates.
 *
 * Bilingual copy used by the assistant UI in places that aren't tied to a
 * specific intent (mic states, processing animation, header titles, fallback
 * text, etc.). Intent-specific copy lives in `intents.ts`.
 */

export type Lang = 'ar' | 'en';

export const ASSISTANT_NAME = {
  ar: 'مساعد الحرم الذكي',
  en: 'Smart Campus Assistant',
} as const;

export const ASSISTANT_TAGLINE = {
  ar: 'اضغط على الميكروفون وتحدث.',
  en: 'Tap the microphone and speak.',
} as const;

export const ASSISTANT_HINT = {
  ar: 'يمكنك السؤال عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.',
  en: 'Ask about buildings, services, hours, or starting a request.',
} as const;

export const VOICE_STATE_COPY = {
  ready: {
    ar: 'اضغط وتحدث',
    en: 'Tap to speak',
  },
  listening: {
    ar: 'جاري الاستماع...',
    en: 'Listening...',
  },
  processing: {
    ar: 'جاري فهم طلبك...',
    en: 'Understanding your request...',
  },
} as const;

export const RECOGNITION_PREFIX = {
  ar: 'فهمت أنك تريد:',
  en: 'I understood you want:',
} as const;

export const ASSISTANT_BUBBLE_LABEL = {
  ar: 'مساعد الحرم',
  en: 'Campus Assistant',
} as const;

export const TYPE_FALLBACK_CTA = {
  ar: 'أفضل الكتابة',
  en: 'Type instead',
} as const;

export const TEXT_INPUT_PLACEHOLDER = {
  ar: 'اكتب سؤالك هنا...',
  en: 'Type your question...',
} as const;

export const ASK_BUTTON = {
  ar: 'اسأل',
  en: 'Ask',
} as const;

export const TRY_AGAIN_LABEL = {
  ar: 'محاولة جديدة',
  en: 'Try again',
} as const;

export const SUGGESTED_HEADER = {
  ar: 'مقترحات',
  en: 'Suggestions',
} as const;

export const QUICK_ACTIONS_HEADER = {
  ar: 'إجراءات سريعة',
  en: 'Quick actions',
} as const;

/** Generic "we still don't have that" copy for the unknown / ambiguous case. */
export const AMBIGUOUS_NOTICE = {
  ar: 'إذا كان طلبك يخص بيانات شخصية، أكمل من جوالك بعد التحقق من الرقم الجامعي.',
  en: "If your request involves personal data, continue on your phone after University ID verification.",
} as const;
