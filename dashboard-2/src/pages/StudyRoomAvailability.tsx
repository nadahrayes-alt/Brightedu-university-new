import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  DoorOpen, Sparkles, MapPin, Clock, Users, Info,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface StudyRoom {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  capacity: number;
  availabilityAr: string;
  availabilityEn: string;
  status: 'open' | 'limited';
}

const ROOMS: StudyRoom[] = [
  {
    id: 'study-r1',
    nameAr: 'قاعة دراسية R1',
    nameEn: 'Study Room R1',
    locationAr: 'المكتبة — الدور الأول · رف الدراسة الفردية',
    locationEn: 'Library — Floor 1 · Solo study wing',
    capacity: 4,
    availabilityAr: 'متاحة اليوم من ١٠:٠٠ صباحًا إلى ١٢:٠٠ ظهرًا',
    availabilityEn: 'Available today from 10:00 AM to 12:00 PM',
    status: 'open',
  },
  {
    id: 'study-r2',
    nameAr: 'قاعة جماعية R2',
    nameEn: 'Group Room R2',
    locationAr: 'المكتبة — الدور الثاني · جناح المجموعات',
    locationEn: 'Library — Floor 2 · Group wing',
    capacity: 8,
    availabilityAr: 'متاحة اليوم من ١:٠٠ إلى ٣:٠٠ مساءً',
    availabilityEn: 'Available today from 1:00 to 3:00 PM',
    status: 'open',
  },
  {
    id: 'study-r3',
    nameAr: 'قاعة هادئة R3',
    nameEn: 'Quiet Room R3',
    locationAr: 'المكتبة — الدور الثالث · المنطقة الهادئة',
    locationEn: 'Library — Floor 3 · Quiet zone',
    capacity: 2,
    availabilityAr: 'متاحة غدًا من ٩:٠٠ إلى ١١:٠٠ صباحًا',
    availabilityEn: 'Available tomorrow from 9:00 to 11:00 AM',
    status: 'limited',
  },
  {
    id: 'study-r4',
    nameAr: 'قاعة مشاريع R4',
    nameEn: 'Project Room R4',
    locationAr: 'المكتبة — الدور الثاني · جناح المشاريع',
    locationEn: 'Library — Floor 2 · Projects wing',
    capacity: 6,
    availabilityAr: 'متاحة اليوم من ٤:٠٠ إلى ٦:٠٠ مساءً',
    availabilityEn: 'Available today from 4:00 to 6:00 PM',
    status: 'open',
  },
];

export function StudyRoomAvailability() {
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
            <DoorOpen className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'القاعات الدراسية المتاحة' : 'Available study rooms'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar' ? 'استعراض عام لقاعات المكتبة' : 'A public view of library study rooms'}
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
              ? 'يظهر هنا فقط توفّر القاعات. لحجز القاعة باسمك، أدخل رقمك الجامعي ثم أكمل الحجز من جوالك.'
              : 'Only room availability is shown here. To book a room in your name, enter your University ID and complete the booking on your phone.'}
          </p>
        </div>

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
                  <h2 className="text-xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? room.nameAr : room.nameEn}
                  </h2>
                  <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                </header>

                <dl className="space-y-2.5 text-base">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? room.locationAr : room.locationEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Users className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? `السعة: ${room.capacity}` : `Capacity: ${room.capacity}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? room.availabilityAr : room.availabilityEn}
                    </span>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    to="/map/library"
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-semibold transition"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
                  </Link>
                  <button
                    onClick={() =>
                      navigate(
                        `/start-request/library?action=reserve-a-study-room&room=${room.id}`,
                      )
                    }
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-privacy text-white hover:opacity-90 text-sm font-semibold transition"
                  >
                    <span>{lang === 'ar' ? 'حجز القاعة' : 'Book this room'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate('/library/catalog')}>
            <span>{lang === 'ar' ? 'البحث في الفهرس' : 'Search the catalog'}</span>
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
