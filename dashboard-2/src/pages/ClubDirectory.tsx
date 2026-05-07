import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronLeft, ChevronRight,
  MapPin, Clock, Users, Sparkles, Info, ArrowLeft, ArrowRight,
  UserPlus,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Club {
  id: string;
  nameAr: string;
  nameEn: string;
  shortAr: string;
  shortEn: string;
  detailsAr: string;
  detailsEn: string;
  meetingPlaceAr: string;
  meetingPlaceEn: string;
  meetingTimeAr: string;
  meetingTimeEn: string;
  /** Public membership status — never tied to a specific student. */
  status: 'open' | 'closed' | 'soon';
  /** Where "Show location" maps to. */
  mapTarget: string;
}

const CLUBS: Club[] = [
  {
    id: 'ai',
    nameAr: 'نادي الذكاء الاصطناعي',
    nameEn: 'AI Club',
    shortAr: 'مجتمع طلابي يهتم بأبحاث وأدوات الذكاء الاصطناعي.',
    shortEn: 'A student community focused on AI research and tooling.',
    detailsAr:
      'يجمع النادي الطلاب المهتمين بالذكاء الاصطناعي عبر ورش، جلسات قراءة أوراق علمية، ومسابقات داخلية. مفتوح لجميع التخصصات.',
    detailsEn:
      'The club brings together students interested in AI through workshops, paper-reading sessions, and internal competitions. Open to all majors.',
    meetingPlaceAr: 'مركز الأنشطة — مبنى ٥',
    meetingPlaceEn: 'Activities Center — Building 5',
    meetingTimeAr: 'الثلاثاء ٤:٠٠ مساءً',
    meetingTimeEn: 'Tuesdays · 4:00 PM',
    status: 'open',
    mapTarget: '/map/activities',
  },
  {
    id: 'cybersec',
    nameAr: 'نادي الأمن السيبراني',
    nameEn: 'Cybersecurity Club',
    shortAr: 'تدريب عملي على الأمن السيبراني وفرق CTF.',
    shortEn: 'Hands-on practice in cybersecurity and CTF teams.',
    detailsAr:
      'يدرّب النادي أعضاءه على أساسيات الأمن السيبراني، يشارك في مسابقات CTF، ويستضيف ضيوفًا من الصناعة. مقاعد محدودة لكل فصل.',
    detailsEn:
      'The club trains members in cybersecurity foundations, competes in CTFs, and hosts industry guests. Limited seats each term.',
    meetingPlaceAr: 'قاعة الأنشطة A — مبنى ٥',
    meetingPlaceEn: 'Activities Hall A — Building 5',
    meetingTimeAr: 'الأربعاء ١:٣٠ مساءً',
    meetingTimeEn: 'Wednesdays · 1:30 PM',
    status: 'open',
    mapTarget: '/map/activities',
  },
  {
    id: 'entrepreneurship',
    nameAr: 'نادي ريادة الأعمال',
    nameEn: 'Entrepreneurship Club',
    shortAr: 'تطوير الأفكار الريادية وبناء النماذج الأولية.',
    shortEn: 'Develop startup ideas and build early prototypes.',
    detailsAr:
      'يدعم النادي الطلاب لبناء مشاريعهم الريادية عبر إرشاد من رواد أعمال، ورش لتقييم الأفكار، ولقاءات شهرية مع مستثمرين.',
    detailsEn:
      'The club supports students in building startups through entrepreneur mentorship, idea-validation workshops, and monthly investor meet-ups.',
    meetingPlaceAr: 'قاعة اجتماعات C2 — مبنى ٤',
    meetingPlaceEn: 'Meeting Room C2 — Building 4',
    meetingTimeAr: 'الخميس ٥:٠٠ مساءً',
    meetingTimeEn: 'Thursdays · 5:00 PM',
    status: 'open',
    mapTarget: '/map/activities',
  },
  {
    id: 'volunteering',
    nameAr: 'نادي التطوع',
    nameEn: 'Volunteering Club',
    shortAr: 'مبادرات تطوعية داخل الحرم وخارجه.',
    shortEn: 'Volunteering initiatives on campus and beyond.',
    detailsAr:
      'يقود النادي مبادرات تطوعية في الحرم الجامعي، حملات توعوية، وأنشطة خدمة المجتمع. التسجيل مفتوح لاحقًا في بداية الفصل.',
    detailsEn:
      'The club leads campus initiatives, awareness campaigns, and community-service activities. Registration opens early in the term.',
    meetingPlaceAr: 'شؤون الطلبة — مبنى ٤',
    meetingPlaceEn: 'Student Affairs — Building 4',
    meetingTimeAr: 'الأحد ١٢:٠٠ ظهرًا',
    meetingTimeEn: 'Sundays · 12:00 PM',
    status: 'soon',
    mapTarget: '/map/student-affairs',
  },
  {
    id: 'design',
    nameAr: 'نادي التصميم والإبداع',
    nameEn: 'Design & Creativity Club',
    shortAr: 'تصميم بصري، UX، ومشاريع إبداعية للطلاب.',
    shortEn: 'Visual design, UX, and student creative projects.',
    detailsAr:
      'يجمع النادي الطلاب المهتمين بالتصميم البصري وتجربة المستخدم، ويُنظّم تحديات تصميم وعرض أعمال طلابية. العضوية حاليًا مكتملة.',
    detailsEn:
      'The club brings together students interested in visual design and UX, runs design challenges, and showcases student work. Membership is currently full.',
    meetingPlaceAr: 'استوديو الورش D3 — مبنى ٧',
    meetingPlaceEn: 'Workshop Studio D3 — Building 7',
    meetingTimeAr: 'السبت ٣:٠٠ مساءً',
    meetingTimeEn: 'Saturdays · 3:00 PM',
    status: 'closed',
    mapTarget: '/map/activities',
  },
];

export function ClubDirectory() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? CLUBS.find((c) => c.id === selectedId) ?? null : null;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 max-w-7xl mx-auto">
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
            <Users className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'الأندية الطلابية' : 'Student clubs'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'دليل عام بأندية الحرم وأوقات اللقاءات'
                : 'A public directory of campus clubs and meeting times'}
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
              ? 'هذه معلومات عامة عن الأندية ولا تحتوي على بيانات شخصية.'
              : 'This is general information about clubs and contains no personal data.'}
          </p>
        </div>

        {/* Club cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {CLUBS.map((club) => {
            const isOpen = club.status === 'open';
            const isClosed = club.status === 'closed';
            const statusTone = isOpen
              ? 'public-safe'
              : isClosed
                ? 'unavailable'
                : 'needs-qr';
            const statusLabel =
              lang === 'ar'
                ? isOpen ? 'مفتوح' : isClosed ? 'مغلق' : 'قريبًا'
                : isOpen ? 'Open' : isClosed ? 'Closed' : 'Soon';

            return (
              <article
                key={club.id}
                className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-4 hover:border-primary/40 transition"
              >
                <header className="flex items-start justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? club.nameAr : club.nameEn}
                  </h2>
                  <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                </header>

                <p className="text-base text-ink-muted leading-relaxed">
                  {lang === 'ar' ? club.shortAr : club.shortEn}
                </p>

                <dl className="space-y-2.5 text-base">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? club.meetingPlaceAr : club.meetingPlaceEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? club.meetingTimeAr : club.meetingTimeEn}
                    </span>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setSelectedId(club.id)}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-ink border border-border-soft hover:border-primary text-sm font-semibold transition"
                  >
                    <Info className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Show details'}</span>
                  </button>
                  {isOpen ? (
                    <Link
                      to={`/start-request/activities?action=join-a-club&club=${club.id}`}
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-privacy text-white hover:opacity-90 text-sm font-semibold transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'طلب الانضمام' : 'Request to join'}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-ink-subtle border border-border-soft text-sm font-semibold cursor-not-allowed"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {lang === 'ar'
                          ? isClosed ? 'العضوية مغلقة' : 'يفتح لاحقًا'
                          : isClosed ? 'Membership closed' : 'Opens later'}
                      </span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Public details card — opens when "Show details" is clicked. */}
        {selected && (
          <section
            aria-live="polite"
            className="bg-surface border border-primary/30 rounded-3xl p-7 mb-10"
          >
            <header className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div>
                <h3 className="text-2xl font-bold text-ink leading-tight">
                  {lang === 'ar' ? selected.nameAr : selected.nameEn}
                </h3>
                <p className="text-base text-ink-muted mt-1">
                  {lang === 'ar'
                    ? `${selected.meetingTimeAr} · ${selected.meetingPlaceAr}`
                    : `${selected.meetingTimeEn} · ${selected.meetingPlaceEn}`}
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
                className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-surface-2 text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 text-base font-semibold transition"
              >
                <MapPin className="w-5 h-5" />
                <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
              </Link>
              {selected.status === 'open' && (
                <Link
                  to={`/start-request/activities?action=join-a-club&club=${selected.id}`}
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-privacy text-white text-base font-semibold hover:opacity-90 transition"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'طلب الانضمام' : 'Request to join'}</span>
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
