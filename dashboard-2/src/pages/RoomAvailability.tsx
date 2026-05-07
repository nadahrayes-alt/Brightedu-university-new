import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  MapPin, Users, Clock, DoorOpen, Building2, Sparkles,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Room {
  id: string;
  nameAr: string;
  nameEn: string;
  buildingAr: string;
  buildingEn: string;
  capacity: number;
  availabilityAr: string;
  availabilityEn: string;
  typeAr: string;
  typeEn: string;
  /** 'open' = green chip, 'limited' = warning chip. */
  status: 'open' | 'limited';
}

// Public, anonymised availability — no booking history, no student tied to slots.
const ROOMS: Room[] = [
  {
    id: 'activities-a',
    nameAr: 'قاعة الأنشطة A',
    nameEn: 'Activities Hall A',
    buildingAr: 'مبنى ٥ — الدور الأول',
    buildingEn: 'Building 5 — Floor 1',
    capacity: 40,
    availabilityAr: 'متاحة اليوم من ٢:٠٠ إلى ٤:٠٠ مساءً',
    availabilityEn: 'Available today from 2:00 to 4:00 PM',
    typeAr: 'قاعة أنشطة',
    typeEn: 'Activities hall',
    status: 'open',
  },
  {
    id: 'meeting-c2',
    nameAr: 'قاعة اجتماعات C2',
    nameEn: 'Meeting Room C2',
    buildingAr: 'مبنى ٤ — الدور الثاني',
    buildingEn: 'Building 4 — Floor 2',
    capacity: 12,
    availabilityAr: 'متاحة اليوم من ١٠:٠٠ صباحًا إلى ١٢:٠٠ ظهرًا',
    availabilityEn: 'Available today from 10:00 AM to 12:00 PM',
    typeAr: 'قاعة اجتماعات',
    typeEn: 'Meeting room',
    status: 'open',
  },
  {
    id: 'lecture-b1',
    nameAr: 'قاعة محاضرات B1',
    nameEn: 'Lecture Hall B1',
    buildingAr: 'مبنى ٢ — الدور الأرضي',
    buildingEn: 'Building 2 — Ground Floor',
    capacity: 80,
    availabilityAr: 'متاحة غدًا من ٩:٠٠ إلى ١١:٠٠ صباحًا',
    availabilityEn: 'Available tomorrow from 9:00 to 11:00 AM',
    typeAr: 'قاعة محاضرات',
    typeEn: 'Lecture hall',
    status: 'limited',
  },
  {
    id: 'workshop-d3',
    nameAr: 'استوديو الورش D3',
    nameEn: 'Workshop Studio D3',
    buildingAr: 'مبنى ٧ — الدور الثالث',
    buildingEn: 'Building 7 — Floor 3',
    capacity: 24,
    availabilityAr: 'متاحة اليوم من ٤:٣٠ إلى ٦:٣٠ مساءً',
    availabilityEn: 'Available today from 4:30 to 6:30 PM',
    typeAr: 'استوديو ورش',
    typeEn: 'Workshop studio',
    status: 'open',
  },
];

export function RoomAvailability() {
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
          <span className="w-16 h-16 rounded-2xl bg-success/15 dark:bg-success/20 text-success flex items-center justify-center">
            <DoorOpen className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'القاعات المتاحة' : 'Available rooms'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'استعراض عام لتوفّر القاعات في الحرم الذكي'
                : 'A public view of room availability across the smart campus'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        <p className="text-base text-ink-muted mb-10 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'هذه نظرة عامة آمنة على القاعات. لا تظهر هنا أي بيانات حجز شخصية. لإرسال طلب حجز رسمي، عُد إلى صفحة "حجز قاعة".'
            : 'This is a safe overview of rooms. No personal booking data is shown here. To submit an official booking request, return to the "Room booking" screen.'}
        </p>

        {/* Room cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {ROOMS.map((room) => {
            const statusTone = room.status === 'open' ? 'public-safe' : 'needs-qr';
            const statusLabel =
              lang === 'ar'
                ? room.status === 'open' ? 'متاحة' : 'مقاعد محدودة'
                : room.status === 'open' ? 'Available' : 'Limited slots';

            return (
              <article
                key={room.id}
                className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-4 hover:border-primary/40 transition"
              >
                <header className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-ink leading-tight">
                      {lang === 'ar' ? room.nameAr : room.nameEn}
                    </h2>
                    <p className="text-base text-ink-muted mt-1">
                      {lang === 'ar' ? room.typeAr : room.typeEn}
                    </p>
                  </div>
                  <Chip tone={statusTone} size="sm">
                    {statusLabel}
                  </Chip>
                </header>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-base">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Building2 className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">{lang === 'ar' ? room.buildingAr : room.buildingEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Users className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? `السعة: ${room.capacity}` : `Capacity: ${room.capacity}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted sm:col-span-2">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? room.availabilityAr : room.availabilityEn}
                    </span>
                  </div>
                </dl>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    to="/map/activities"
                    className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-surface-2 text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 text-base font-semibold transition"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/activities?action=reserve-a-hall')}
          >
            <span>{lang === 'ar' ? 'بدء طلب حجز' : 'Start booking request'}</span>
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
