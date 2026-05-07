import { Bot, ShieldCheck, UserCheck, Lock, Smartphone, Monitor, MessageSquare, Globe, User } from 'lucide-react';
import type { AiTier, Channel, Priority, RequestStatus } from '../../data/mockData';
import { useT } from '../../context';
import type { DictKey } from '../../i18n';

// ---------- AI Tier Badge ----------
const tierConfig: Record<AiTier, { key: DictKey; bg: string; fg: string; ring: string; icon: typeof Bot }> = {
  green:  { key: 'tier.green',  bg: 'bg-success/10',  fg: 'text-success',   ring: 'ring-success/20',  icon: Bot },
  yellow: { key: 'tier.yellow', bg: 'bg-warning/10',  fg: 'text-warning',   ring: 'ring-warning/30',  icon: UserCheck },
  red:    { key: 'tier.red',    bg: 'bg-danger/10',   fg: 'text-danger',    ring: 'ring-danger/20',   icon: ShieldCheck },
  black:  { key: 'tier.black',  bg: 'bg-privacy/10',  fg: 'text-privacy',   ring: 'ring-privacy/25',  icon: Lock },
};

export function AiTierBadge({ tier, compact = false }: { tier: AiTier; compact?: boolean }) {
  const c = tierConfig[tier];
  const t = useT();
  const Icon = c.icon;
  return (
    <span
      title={t(c.key)}
      className={`inline-flex items-center gap-1.5 ${c.bg} ${c.fg} ring-1 ${c.ring} rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      {!compact && <span>{t(c.key)}</span>}
    </span>
  );
}

// ---------- Status Chip ----------
const statusConfig: Record<RequestStatus, { key: DictKey; cls: string }> = {
  new:               { key: 'status.new',              cls: 'bg-primary/10 text-primary-700 dark:text-primary' },
  in_review:         { key: 'status.in_review',        cls: 'bg-teal/10 text-teal' },
  waiting_approval:  { key: 'status.waiting_approval', cls: 'bg-warning/10 text-warning' },
  waiting_student:   { key: 'status.waiting_student',  cls: 'bg-support/10 text-support' },
  escalated:         { key: 'status.escalated',        cls: 'bg-purple/10 text-purple' },
  completed:         { key: 'status.completed',        cls: 'bg-success/10 text-success' },
  rejected:          { key: 'status.rejected',         cls: 'bg-ink-muted/10 text-ink-muted' },
  sla_risk:          { key: 'status.sla_risk',         cls: 'bg-warning/10 text-warning' },
  sla_breached:      { key: 'status.sla_breached',     cls: 'bg-danger/10 text-danger' },
};

export function StatusChip({ status }: { status: RequestStatus }) {
  const t = useT();
  const c = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${c.cls}`}>
      {t(c.key)}
    </span>
  );
}

// ---------- Priority Badge ----------
const priorityConfig: Record<Priority, { key: DictKey; cls: string }> = {
  low:    { key: 'priority.low',    cls: 'bg-surface-2 text-ink-muted' },
  normal: { key: 'priority.normal', cls: 'bg-surface-2 text-ink' },
  high:   { key: 'priority.high',   cls: 'bg-warning/10 text-warning' },
  urgent: { key: 'priority.urgent', cls: 'bg-danger/10 text-danger' },
};

export function PriorityBadge({ p }: { p: Priority }) {
  const t = useT();
  const c = priorityConfig[p];
  return <span className={`text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${c.cls}`}>{t(c.key)}</span>;
}

// ---------- Channel Badge ----------
const channelConfig: Record<Channel, { key: DictKey; icon: typeof Bot }> = {
  kiosk:    { key: 'channel.kiosk',    icon: Monitor },
  mobile:   { key: 'channel.mobile',   icon: Smartphone },
  whatsapp: { key: 'channel.whatsapp', icon: MessageSquare },
  web:      { key: 'channel.web',      icon: Globe },
  staff:    { key: 'channel.staff',    icon: User },
};

export function ChannelBadge({ ch }: { ch: Channel }) {
  const t = useT();
  const c = channelConfig[ch];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-muted whitespace-nowrap">
      <Icon className="w-3.5 h-3.5" />
      {t(c.key)}
    </span>
  );
}

// ---------- SLA Timer ----------
export function SlaTimer({ minutes }: { minutes: number }) {
  const breached = minutes < 0;
  const risk = !breached && minutes < 30;
  const cls = breached
    ? 'bg-danger/10 text-danger'
    : risk
      ? 'bg-warning/10 text-warning'
      : 'bg-success/10 text-success';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${cls}`}>
      <span className="num">{breached ? '−' : ''}{label}</span>
    </span>
  );
}

// ---------- Privacy/Access Badge ----------
export function AccessBadge({ labelKey }: { labelKey?: DictKey }) {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-privacy/10 text-privacy">
      <Lock className="w-3 h-3" />
      {t(labelKey ?? 'access.restrictedRole')}
    </span>
  );
}
