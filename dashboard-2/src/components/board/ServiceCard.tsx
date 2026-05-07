import { Link } from 'react-router-dom';
import {
  Clock, Users, Footprints, MapPin, ArrowLeft, ArrowRight,
  Building2, GraduationCap, FileText, BookOpen, Coffee, Wrench, Cross, Sparkles,
} from 'lucide-react';
import { Chip, StatusDot } from '../ui/Chip';
import { useApp } from '../../lib/AppContext';
import type { Service } from '../../data/services';
import { ar } from '../../lib/numerals';

const ICONS: Record<string, typeof Building2> = {
  building: Building2,
  graduation: GraduationCap,
  file: FileText,
  book: BookOpen,
  coffee: Coffee,
  wrench: Wrench,
  cross: Cross,
  sparkle: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  students:   'bg-primary/10 dark:bg-primary/20 text-primary',
  facilities: 'bg-teal-50 dark:bg-teal/15 text-teal',
  documents:  'bg-privacy/10 dark:bg-privacy/20 text-privacy',
  support:    'bg-warning/15 dark:bg-warning/20 text-warning',
  emergency:  'bg-danger/15 dark:bg-danger/20 text-danger',
};

// Estimated congestion wording — public-safe (no exact live counts).
function congestionLabel(level: 'low' | 'medium' | 'high', lang: 'ar' | 'en') {
  if (lang === 'ar') {
    return level === 'low' ? 'ازدحام منخفض'
      : level === 'medium' ? 'ازدحام متوسط'
      : 'ازدحام مرتفع';
  }
  return level === 'low' ? 'Low congestion'
    : level === 'medium' ? 'Medium congestion'
    : 'High congestion';
}

function expectedWaitRange(level: 'low' | 'medium' | 'high', lang: 'ar' | 'en') {
  const range = level === 'low' ? [0, 5] : level === 'medium' ? [10, 15] : [20, 30];
  if (lang === 'ar') {
    return `انتظار متوقع: ${ar(range[0])}–${ar(range[1])} دقيقة`;
  }
  return `Expected wait: ${range[0]}–${range[1]} min`;
}

export function ServiceCard({ service }: { service: Service }) {
  const { lang } = useApp();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const Icon = ICONS[service.icon] ?? Building2;
  const colorCls = CATEGORY_COLORS[service.category] ?? CATEGORY_COLORS.students;

  const statusTone =
    service.status === 'open' ? 'open'
    : service.status === 'closing' ? 'closing'
    : service.status === 'busy' ? 'busy'
    : 'closed';

  const statusLabel =
    lang === 'ar'
      ? service.status === 'open' ? 'مفتوح الآن'
        : service.status === 'closing' ? 'يغلق قريبًا'
        : service.status === 'busy' ? 'مزدحم' : 'مغلق'
      : service.status === 'open' ? 'Open now'
        : service.status === 'closing' ? 'Closing soon'
        : service.status === 'busy' ? 'Busy' : 'Closed';

  const walkLabel = lang === 'ar'
    ? `${ar(service.walkMin)} دقائق مشي`
    : `${service.walkMin} min walk`;

  const congestionTone =
    service.queue?.level === 'high' ? 'text-danger'
    : service.queue?.level === 'medium' ? 'text-warning'
    : 'text-success';

  return (
    <div className="group bg-surface border border-border-soft rounded-3xl p-7 hover:border-primary/40 hover:shadow-xl transition-all flex flex-col gap-5">
      {/* Top: status chip aligned end */}
      <div className="flex items-start justify-between gap-3">
        <span className={`w-16 h-16 rounded-2xl ${colorCls} flex items-center justify-center shrink-0`}>
          <Icon className="w-8 h-8" />
        </span>
        <Chip tone={statusTone} icon={<StatusDot tone={statusTone === 'busy' ? 'med' : statusTone} />}>
          {statusLabel}
        </Chip>
      </div>

      {/* Name + building */}
      <div>
        <h3 className="text-2xl font-bold text-ink leading-tight mb-1">
          {lang === 'ar' ? service.nameAr : service.nameEn}
        </h3>
        <p className="text-base text-ink-muted">
          {lang === 'ar' ? service.building : service.buildingEn}
        </p>
      </div>

      {/* Meta row: hours + walking time */}
      <div className="flex items-center gap-5 text-base text-ink-muted flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-5 h-5" />
          <span className="num">
            {service.hours.from} — {service.hours.to}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Footprints className="w-5 h-5" />
          <span>{walkLabel}</span>
        </span>
      </div>

      {/* Estimated congestion (no exact live counts) */}
      {service.queue && (
        <div className={`inline-flex items-center gap-2 text-base font-medium ${congestionTone}`}>
          <Users className="w-5 h-5" />
          <span>{congestionLabel(service.queue.level, lang)}</span>
          <span className="text-ink-muted font-normal">·</span>
          <span className="text-ink-muted font-normal">{expectedWaitRange(service.queue.level, lang)}</span>
        </div>
      )}

      {/* Two public-safe CTAs: Details + Show location */}
      <div className="flex items-center gap-3 pt-1 flex-wrap">
        <Link
          to={`/service/${service.id}`}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-primary text-white text-base font-semibold hover:bg-primary-600 transition"
        >
          <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
          <ArrowIcon className="w-5 h-5" />
        </Link>
        <Link
          to={`/map/${service.id}`}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-base font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
        >
          <MapPin className="w-5 h-5" />
          <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
        </Link>
      </div>
    </div>
  );
}
