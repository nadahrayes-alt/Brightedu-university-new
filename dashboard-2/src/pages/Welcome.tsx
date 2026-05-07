import {
  Compass, Building2, Clock, FileText, Map, Sparkles,
  ArrowLeft, ArrowRight, TrendingUp, Users, Activity, ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { AssistantInput } from '../components/board/AssistantInput';
import { SUGGESTIONS, SERVICES } from '../data/services';
import { mockBackend } from '../data/mock';
import { ar } from '../lib/numerals';

const quickActions = [
  { to: '/map/main-gate',            icon: Compass,    ar: 'أين أذهب؟',     en: 'Where to go?',     color: 'primary' },
  { to: '/service/student-affairs',  icon: Building2,  ar: 'شؤون الطلبة',   en: 'Student Affairs',  hint: 'مبنى ٤', color: 'teal' },
  { to: '/services',                 icon: Clock,      ar: 'مواعيد الخدمات', en: 'Service hours',    color: 'warning' },
  { to: '/start-request/graduation', icon: FileText,   ar: 'استلام الوثائق', en: 'Document pickup',  color: 'privacy' },
  { to: '/map/student-affairs',      icon: Map,        ar: 'الخريطة',        en: 'Campus map',       color: 'success' },
];

const colorClasses: Record<string, string> = {
  primary: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  teal:    'bg-teal-50 dark:bg-teal/15 text-teal border-teal/30',
  warning: 'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  privacy: 'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  success: 'bg-success/15 dark:bg-success/20 text-success border-success/30',
};

export function Welcome() {
  const { lang } = useApp();
  const openCount = SERVICES.filter((s) => s.status === 'open').length;
  const pulse = mockBackend.getCampusPulse();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="p-12 space-y-8">
      {/* Hero with gradient backdrop */}
      <section className="relative overflow-hidden rounded-3xl border border-border-soft bg-gradient-to-br from-primary/10 via-surface to-privacy/5 dark:from-primary/20 dark:via-surface dark:to-privacy/10 p-10">
        <div className="absolute -top-16 -end-16 w-72 h-72 rounded-full bg-primary/15 dark:bg-primary/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -start-12 w-80 h-80 rounded-full bg-privacy/10 dark:bg-privacy/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-primary/15 text-primary text-base font-semibold mb-5">
            <Sparkles className="w-5 h-5" />
            {lang === 'ar' ? 'لوحة الحرم الذكية' : 'Smart Campus Board'}
          </div>
          <h1 className="text-[64px] leading-[1.05] font-bold text-ink">
            {lang === 'ar' ? 'أهلًا بك في الحرم الجامعي' : 'Welcome to the Smart Campus'}
          </h1>
          <p className="mt-3 text-3xl text-ink-muted leading-snug">
            {lang === 'ar' ? 'كيف أقدر أساعدك اليوم؟' : 'How can I help you today?'}
          </p>
          <p className="mt-2 text-xl text-ink-muted">
            {lang === 'ar'
              ? 'اسأل المساعد الذكي أو اختر خدمة سريعة من الأسفل.'
              : 'Ask the assistant or pick a quick action below.'}
          </p>
        </div>
      </section>

      {/* Live status KPI strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-surface border border-border-soft rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-success/15 dark:bg-success/20 text-success flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </span>
          <div>
            <div className="text-base text-ink-muted">{lang === 'ar' ? 'خدمات مفتوحة' : 'Open services'}</div>
            <div className="text-2xl font-bold text-ink num">
              {lang === 'ar' ? `${ar(openCount)} / ${ar(SERVICES.length)}` : `${openCount} / ${SERVICES.length}`}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border-soft rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-warning/15 dark:bg-warning/20 text-warning flex items-center justify-center">
            <Users className="w-6 h-6" />
          </span>
          <div>
            <div className="text-base text-ink-muted">{lang === 'ar' ? 'متوسط الانتظار' : 'Average wait'}</div>
            <div className="text-2xl font-bold text-ink num">
              {lang === 'ar' ? `${ar(pulse.averageWaitMin)} د` : `${pulse.averageWaitMin} min`}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border-soft rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <div className="text-base text-ink-muted">{lang === 'ar' ? 'زيارات اليوم' : 'Visits today'}</div>
            <div className="text-2xl font-bold text-ink num">
              {lang === 'ar' ? ar(pulse.visitsToday) : String(pulse.visitsToday)}
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border-soft rounded-2xl p-5 flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <div className="text-base text-ink-muted">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</div>
            <div className="text-2xl font-bold text-ink">{lang === 'ar' ? 'محمية' : 'Protected'}</div>
          </div>
        </div>
      </section>

      {/* Assistant card */}
      <section className="bg-surface border border-border-soft rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-10 end-10 w-40 h-40 rounded-full bg-primary/10 dark:bg-primary/15 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-5">
            <span className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-9 h-9" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-ink">
                {lang === 'ar' ? 'مساعد الحرم الذكي' : 'Smart Campus Assistant'}
              </h2>
              <p className="text-base text-ink-muted">
                {lang === 'ar'
                  ? 'اسألني عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.'
                  : 'Ask about buildings, services, hours, or starting a request.'}
              </p>
            </div>
          </div>

          <AssistantInput />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-base text-ink-muted">
              {lang === 'ar' ? 'مقترحات:' : 'Suggestions:'}
            </span>
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <Link
                key={s.ar}
                to={s.route}
                className="h-12 px-5 rounded-full bg-surface-2 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary text-lg font-medium text-ink-muted border border-border-soft transition inline-flex items-center"
              >
                {lang === 'ar' ? s.ar : s.en}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick services */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-ink">
            {lang === 'ar' ? 'خدمات سريعة' : 'Quick services'}
          </h3>
          <Link to="/services" className="text-primary text-lg font-semibold hover:underline inline-flex items-center gap-1">
            <span>{lang === 'ar' ? 'كل الخدمات' : 'All services'}</span>
            <Arrow className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {quickActions.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to + q.ar}
                to={q.to}
                className="group bg-surface border border-border-soft rounded-3xl p-6 h-[200px] hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${colorClasses[q.color]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-xl font-semibold text-ink mb-1 leading-tight">
                  {lang === 'ar' ? q.ar : q.en}
                </div>
                {q.hint && <div className="text-base text-ink-muted">{q.hint}</div>}
                <div className="mt-3 inline-flex items-center text-base text-primary font-semibold">
                  <span>{lang === 'ar' ? 'افتح' : 'Open'}</span>
                  <Arrow className="w-5 h-5 ms-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live now strip — busiest services */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-ink">
            {lang === 'ar' ? 'الآن في الحرم' : 'Live on campus'}
          </h3>
          <span className="inline-flex items-center gap-2 text-base text-ink-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-success live-dot" />
            {lang === 'ar' ? 'تحديث مباشر' : 'Live updates'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.slice(0, 3).map((s) => {
            const tone =
              s.queue?.level === 'high' ? 'bg-danger'
              : s.queue?.level === 'medium' ? 'bg-warning'
              : 'bg-success';
            return (
              <Link
                key={s.id}
                to={`/service/${s.id}`}
                className="bg-surface border border-border-soft rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition flex items-center gap-4"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary text-2xl flex items-center justify-center shrink-0">
                  🏢
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold text-ink truncate">
                    {lang === 'ar' ? s.nameAr : s.nameEn}
                  </div>
                  <div className="text-sm text-ink-muted">
                    {lang === 'ar' ? s.building : s.buildingEn}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${tone}`} />
                  {s.queue && (
                    <span className="text-sm text-ink-muted num">
                      {lang === 'ar' ? `${ar(s.queue.minutes)} د` : `${s.queue.minutes}m`}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
