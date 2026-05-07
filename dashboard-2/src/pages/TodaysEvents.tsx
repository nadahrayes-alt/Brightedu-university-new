import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  MapPin, Clock, Users, CalendarDays, Sparkles, Info, ArrowLeft, ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface PublicEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  timeAr: string;
  timeEn: string;
  locationAr: string;
  locationEn: string;
  /** Where the location maps to. Reuses existing /map/:id routes. */
  mapTarget: string;
  status: 'open' | 'limited';
  showSeats?: boolean;
  /** Whether the event accepts registration. Some are walk-in only. */
  registerable?: boolean;
  detailsAr: string;
  detailsEn: string;
}

// Public-safe seed data. None of this is tied to a specific student.
const EVENTS: PublicEvent[] = [
  {
    id: 'ai-workshop',
    titleAr: 'ورشة الذكاء الاصطناعي للطلاب',
    titleEn: 'AI Workshop for Students',
    timeAr: '١١:٠٠ صباحًا',
    timeEn: '11:00 AM',
    locationAr: 'مركز الأنشطة — مبنى ٥',
    locationEn: 'Activities Center — Building 5',
    mapTarget: '/map/activities',
    status: 'open',
    showSeats: true,
    registerable: true,
    detailsAr:
      'جلسة تعريفية بالذكاء الاصطناعي مع تطبيق عملي على أدوات معتمدة في الجامعة. مناسبة لجميع التخصصات.',
    detailsEn:
      'A hands-on intro to AI with practical exercises on tools approved by the university. Open to all majors.',
  },
  {
    id: 'cybersec-club',
    titleAr: 'لقاء نادي الأمن السيبراني',
    titleEn: 'Cybersecurity Club Meet-up',
    timeAr: '١:٣٠ مساءً',
    timeEn: '1:30 PM',
    locationAr: 'قاعة الأنشطة A',
    locationEn: 'Activities Hall A',
    mapTarget: '/map/activities',
    status: 'limited',
    registerable: true,
    detailsAr:
      'لقاء أعضاء نادي الأمن السيبراني لمناقشة آخر مستجدات الأمن وتجارب CTF القادمة. المقاعد محدودة.',
    detailsEn:
      'A meet-up for cybersecurity club members covering recent updates and upcoming CTF practice. Limited seats.',
  },
  {
    id: 'student-services-info',
    titleAr: 'جلسة تعريفية بالخدمات الطلابية',
    titleEn: 'Student Services Orientation',
    timeAr: '٣:٠٠ مساءً',
    timeEn: '3:00 PM',
    locationAr: 'شؤون الطلبة — مبنى ٤',
    locationEn: 'Student Affairs — Building 4',
    mapTarget: '/map/student-affairs',
    status: 'open',
    registerable: false,
    detailsAr:
      'جولة تعريفية بالخدمات الطلابية وكيفية الوصول لها بسرعة من اللوحات الذكية. لا تحتاج تسجيل مسبق.',
    detailsEn:
      'An orientation tour covering student services and how to reach them quickly from the smart boards. No prior registration needed.',
  },
];

export function TodaysEvents() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Selected event for the inline public details card. Null = list view.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? EVENTS.find((e) => e.id === selectedId) ?? null : null;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
            className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
          >
            <ChevIcon className="w-6 h-6" />
          </button>
          <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
            <CalendarDays className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'فعاليات اليوم' : "Today's events"}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'استعراض عام لأبرز الفعاليات في الحرم اليوم'
                : 'A public overview of the highlights happening on campus today'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/30 mb-10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-base text-ink leading-relaxed">
            {lang === 'ar'
              ? 'هذه معلومات عامة عن الفعاليات ولا تحتوي على بيانات شخصية.'
              : 'This is general information about events and contains no personal data.'}
          </p>
        </div>

        {/* Event list */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {EVENTS.map((event) => {
            const statusTone = event.status === 'open' ? 'public-safe' : 'needs-qr';
            const statusLabel =
              lang === 'ar'
                ? event.status === 'open'
                  ? event.showSeats ? 'متاحة · مقاعد متاحة' : 'مفتوحة'
                  : 'مقاعد محدودة'
                : event.status === 'open'
                  ? event.showSeats ? 'Available · seats open' : 'Open'
                  : 'Limited seats';

            return (
              <article
                key={event.id}
                className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-4 hover:border-primary/40 transition"
              >
                <header className="flex items-start justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? event.titleAr : event.titleEn}
                  </h2>
                  <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                </header>

                <dl className="space-y-2.5 text-base">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">{lang === 'ar' ? event.timeAr : event.timeEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? event.locationAr : event.locationEn}
                    </span>
                  </div>
                  {event.showSeats && (
                    <div className="flex items-center gap-2 text-ink-muted">
                      <Users className="w-5 h-5 shrink-0 text-primary" />
                      <span className="text-ink">
                        {lang === 'ar' ? 'المقاعد متاحة' : 'Seats available'}
                      </span>
                    </div>
                  )}
                </dl>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setSelectedId(event.id)}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-ink border border-border-soft hover:border-primary text-sm font-semibold transition"
                  >
                    <Info className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Show details'}</span>
                  </button>
                  <Link
                    to={event.mapTarget}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-semibold transition"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
                  </Link>
                  {event.registerable && (
                    <Link
                      to={`/start-request/activities?action=event-registration&event=${event.id}`}
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-privacy text-white hover:opacity-90 text-sm font-semibold transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'التسجيل' : 'Register'}</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Public details card — opens when "Show details" is clicked. No private data. */}
        {selected && (
          <section
            aria-live="polite"
            className="bg-surface border border-primary/30 rounded-3xl p-7 mb-10"
          >
            <header className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div>
                <h3 className="text-2xl font-bold text-ink leading-tight">
                  {lang === 'ar' ? selected.titleAr : selected.titleEn}
                </h3>
                <p className="text-base text-ink-muted mt-1">
                  {lang === 'ar'
                    ? `${selected.timeAr} · ${selected.locationAr}`
                    : `${selected.timeEn} · ${selected.locationEn}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </header>

            <p className="text-lg text-ink leading-relaxed mb-6">
              {lang === 'ar' ? selected.detailsAr : selected.detailsEn}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={selected.mapTarget}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-primary text-white text-base font-semibold hover:bg-primary-600 transition"
              >
                <MapPin className="w-5 h-5" />
                <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
              </Link>
              {selected.registerable && (
                <Link
                  to={`/start-request/activities?action=event-registration&event=${selected.id}`}
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-privacy text-white text-base font-semibold hover:opacity-90 transition"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'التسجيل' : 'Register'}</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Footer actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate('/service/activities')}>
            <span>{lang === 'ar' ? 'مركز الأنشطة' : 'Activities Center'}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
