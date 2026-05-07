import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Tag, Sparkles, MapPin, Clock, Info,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Offer {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** Public time window — never personal coupon dates. */
  timeAr: string;
  timeEn: string;
  locationAr: string;
  locationEn: string;
  status: 'active' | 'ending-soon';
}

const OFFERS: Offer[] = [
  {
    id: 'student-breakfast',
    nameAr: 'إفطار الطلاب',
    nameEn: 'Student breakfast',
    descriptionAr: 'وجبة فطور كاملة (مناقيش + شاي + فاكهة) بسعر موحد للطلاب.',
    descriptionEn: 'A complete breakfast (manakish + tea + fruit) at a flat student price.',
    timeAr: '٧:٣٠ — ١٠:٠٠ صباحًا',
    timeEn: '7:30 — 10:00 AM',
    locationAr: 'الكافتيريا الرئيسية — مبنى الخدمات الطلابية',
    locationEn: 'Main Cafeteria — Student Services Building',
    status: 'active',
  },
  {
    id: 'lunch-combo',
    nameAr: 'كومبو الغداء',
    nameEn: 'Lunch combo',
    descriptionAr: 'طبق رئيسي + سلطة + مشروب بخصم ١٥٪ للطلاب خلال ساعات الذروة.',
    descriptionEn: 'Main dish + salad + drink with a 15% student discount during peak hours.',
    timeAr: '١٢:٠٠ — ٢:٣٠ مساءً',
    timeEn: '12:00 — 2:30 PM',
    locationAr: 'محطة الأطباق الرئيسية',
    locationEn: 'Main hot station',
    status: 'active',
  },
  {
    id: 'coffee-break',
    nameAr: 'استراحة القهوة',
    nameEn: 'Coffee break',
    descriptionAr: 'كوب قهوة + قطعة مخبوزات بسعر مخفّض بين المحاضرات.',
    descriptionEn: 'A coffee + a baked-good piece at a discounted price between lectures.',
    timeAr: '٣:٠٠ — ٥:٠٠ مساءً',
    timeEn: '3:00 — 5:00 PM',
    locationAr: 'ركن المخبوزات',
    locationEn: 'Bakery corner',
    status: 'active',
  },
  {
    id: 'fruit-friday',
    nameAr: 'كوب فواكه نهاية الأسبوع',
    nameEn: 'Weekend fruit cup',
    descriptionAr: 'كوب فواكه طازجة بنصف السعر — عرض ينتهي قريبًا.',
    descriptionEn: 'A fresh fruit cup at half price — offer ending soon.',
    timeAr: 'حتى نهاية الأسبوع',
    timeEn: 'Through the end of the week',
    locationAr: 'ركن المشروبات والوجبات الخفيفة',
    locationEn: 'Drinks & snacks corner',
    status: 'ending-soon',
  },
];

export function CafeteriaOffers() {
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
            <Tag className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'العروض النشطة' : 'Active offers'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar' ? 'عروض عامة في الكافتيريا الرئيسية' : 'Public offers at the main cafeteria'}
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
              ? 'العروض المعروضة هنا عامة لجميع الطلاب. لا يتم عرض كوبونات شخصية أو مكافآت مرتبطة بحسابك.'
              : 'These offers are public to all students. Personal coupons or account-tied rewards never appear here.'}
          </p>
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {OFFERS.map((offer) => {
            const isActive = offer.status === 'active';
            const statusTone = isActive ? 'public-safe' : 'needs-qr';
            const statusLabel =
              lang === 'ar'
                ? isActive ? 'نشط' : 'ينتهي قريبًا'
                : isActive ? 'Active' : 'Ending soon';

            return (
              <article
                key={offer.id}
                className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-3 hover:border-primary/40 transition"
              >
                <header className="flex items-start justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? offer.nameAr : offer.nameEn}
                  </h2>
                  <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                </header>

                <p className="text-base text-ink-muted leading-relaxed">
                  {lang === 'ar' ? offer.descriptionAr : offer.descriptionEn}
                </p>

                <dl className="space-y-2 text-base pt-1">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">{lang === 'ar' ? offer.timeAr : offer.timeEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? offer.locationAr : offer.locationEn}
                    </span>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/map/cafeteria"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
          </Link>
          <Link
            to="/hours/cafeteria"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <Clock className="w-5 h-5" />
            <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
          </Link>
          <Button variant="primary" onClick={() => navigate('/cafeteria/menu')}>
            <span>{lang === 'ar' ? 'قائمة الطعام اليوم' : "Today's menu"}</span>
            <ArrowIcon className="w-5 h-5" />
          </Button>
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
