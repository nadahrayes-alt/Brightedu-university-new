import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  MapPin, Clock, CalendarCheck, Sparkles, Info, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Slot {
  id: string;
  timeAr: string;
  timeEn: string;
  /** General appointment type — never includes medical reason or diagnosis. */
  typeAr: string;
  typeEn: string;
  clinicAr: string;
  clinicEn: string;
}

interface Day {
  id: 'today' | 'tomorrow';
  labelAr: string;
  labelEn: string;
  slots: Slot[];
}

// Public slots — anonymised. No student names, no medical reasons.
const DAYS: Day[] = [
  {
    id: 'today',
    labelAr: 'اليوم',
    labelEn: 'Today',
    slots: [
      {
        id: 'today-10',
        timeAr: '١٠:٠٠ صباحًا',
        timeEn: '10:00 AM',
        typeAr: 'فحص عام',
        typeEn: 'General check-up',
        clinicAr: 'عيادة A — مبنى ٦',
        clinicEn: 'Clinic A — Building 6',
      },
      {
        id: 'today-1130',
        timeAr: '١١:٣٠ صباحًا',
        timeEn: '11:30 AM',
        typeAr: 'استشارة عامة',
        typeEn: 'General consultation',
        clinicAr: 'عيادة B — مبنى ٦',
        clinicEn: 'Clinic B — Building 6',
      },
      {
        id: 'today-2',
        timeAr: '٢:٠٠ مساءً',
        timeEn: '2:00 PM',
        typeAr: 'متابعة',
        typeEn: 'Follow-up',
        clinicAr: 'عيادة A — مبنى ٦',
        clinicEn: 'Clinic A — Building 6',
      },
    ],
  },
  {
    id: 'tomorrow',
    labelAr: 'غدًا',
    labelEn: 'Tomorrow',
    slots: [
      {
        id: 'tomorrow-9',
        timeAr: '٩:٠٠ صباحًا',
        timeEn: '9:00 AM',
        typeAr: 'فحص عام',
        typeEn: 'General check-up',
        clinicAr: 'عيادة A — مبنى ٦',
        clinicEn: 'Clinic A — Building 6',
      },
      {
        id: 'tomorrow-1',
        timeAr: '١:٠٠ مساءً',
        timeEn: '1:00 PM',
        typeAr: 'تطعيمات',
        typeEn: 'Vaccinations',
        clinicAr: 'عيادة C — مبنى ٦',
        clinicEn: 'Clinic C — Building 6',
      },
      {
        id: 'tomorrow-3',
        timeAr: '٣:٠٠ مساءً',
        timeEn: '3:00 PM',
        typeAr: 'استشارة وقائية',
        typeEn: 'Preventive consultation',
        clinicAr: 'عيادة B — مبنى ٦',
        clinicEn: 'Clinic B — Building 6',
      },
    ],
  },
];

export function AppointmentSlots() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

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
            <CalendarCheck className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'المواعيد المتاحة' : 'Available appointments'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'استعراض عام لمواعيد العيادة الجامعية'
                : 'A public view of available clinic appointments'}
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
              ? 'تظهر هنا فقط الأوقات المتاحة ونوع الموعد العام. لا تظهر أسماء الطلاب ولا أسباب الزيارة. عند الحجز، أكمل التفاصيل بشكل خاص من جوالك.'
              : 'Only available times and general appointment types are shown. No student names or visit reasons appear here. When you book, complete the details privately on your phone.'}
          </p>
        </div>

        {/* Slot groups by day */}
        <div className="space-y-8 mb-10">
          {DAYS.map((day) => (
            <section key={day.id}>
              <h2 className="text-2xl font-bold text-ink mb-4">
                {lang === 'ar' ? day.labelAr : day.labelEn}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {day.slots.map((slot) => (
                  <article
                    key={slot.id}
                    className="bg-surface border border-border-soft rounded-3xl p-5 flex flex-col gap-3 hover:border-primary/40 transition"
                  >
                    <header className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xl font-bold text-primary num">
                        <Clock className="w-5 h-5" />
                        {lang === 'ar' ? slot.timeAr : slot.timeEn}
                      </span>
                      <Chip tone="public-safe" size="sm">
                        {lang === 'ar' ? 'متاح' : 'Open'}
                      </Chip>
                    </header>

                    <div className="text-base text-ink">
                      {lang === 'ar' ? slot.typeAr : slot.typeEn}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <MapPin className="w-4 h-4 shrink-0 text-primary" />
                      <span>{lang === 'ar' ? slot.clinicAr : slot.clinicEn}</span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/start-request/clinic?action=book-an-appointment&slot=${slot.id}`,
                        )
                      }
                      className="mt-2 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-privacy text-white hover:opacity-90 text-sm font-semibold transition"
                    >
                      <span>{lang === 'ar' ? 'حجز هذا الموعد' : 'Book this slot'}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate('/clinic/info')}>
            <span>{lang === 'ar' ? 'معلومات العيادة' : 'Clinic information'}</span>
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
