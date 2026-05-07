/**
 * Smart Campus Assistant — icon registry.
 *
 * Intent definitions reference icons by a serialisable `iconKind` so the
 * intent catalog stays free of JSX. The renderer maps each kind to its
 * corresponding lucide-react icon here.
 */

import {
  Map, Clock, Building2, ListChecks, ShieldCheck, QrCode, ArrowLeft, ArrowRight,
  Home, Phone, FileText, Users, CalendarDays, Wifi, Wrench, UtensilsCrossed,
  BookOpen, Cross, Sparkles, Lock, Gavel, AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IntentIconKind } from './intents';

const ICONS: Record<IntentIconKind, LucideIcon> = {
  map: Map,
  clock: Clock,
  building: Building2,
  list: ListChecks,
  verify: ShieldCheck,
  qr: QrCode,
  back: ArrowLeft,
  home: Home,
  phone: Phone,
  document: FileText,
  queue: Users,
  event: CalendarDays,
  calendar: CalendarDays,
  wifi: Wifi,
  wrench: Wrench,
  food: UtensilsCrossed,
  book: BookOpen,
  cross: Cross,
  sparkle: Sparkles,
  arrow: ArrowRight,
  shield: ShieldCheck,
  gavel: Gavel,
  alert: AlertTriangle,
};

export function getIntentIcon(kind: IntentIconKind | undefined): LucideIcon {
  return ICONS[kind ?? 'arrow'] ?? ArrowRight;
}
