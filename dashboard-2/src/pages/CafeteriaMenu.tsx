import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  UtensilsCrossed, Sparkles, MapPin, Clock, Info,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Meal {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Price label, e.g. "١٢ ر.س". Optional. */
  priceAr?: string;
  priceEn?: string;
  servingTimeAr: string;
  servingTimeEn: string;
  status: 'available' | 'sold-out' | 'soon';
  /** Counter inside the cafeteria, e.g. "محطة المشاوي". */
  stationAr: string;
  stationEn: string;
}

const MEALS: Meal[] = [
  {
    id: 'mansaf',
    nameAr: 'منسف لحم بالجريش',
    nameEn: 'Lamb mansaf with jareesh',
    priceAr: '٢٠ ر.س',
    priceEn: 'SAR 20',
    servingTimeAr: '١٢:٠٠ — ٢:٣٠ مساءً',
    servingTimeEn: '12:00 — 2:30 PM',
    status: 'available',
    stationAr: 'محطة الأطباق الرئيسية',
    stationEn: 'Main hot station',
  },
  {
    id: 'shawarma',
    nameAr: 'شاورما دجاج بالخبز العربي',
    nameEn: 'Chicken shawarma wrap',
    priceAr: '١٥ ر.س',
    priceEn: 'SAR 15',
    servingTimeAr: '١١:٠٠ صباحًا — ٤:٠٠ مساءً',
    servingTimeEn: '11:00 AM — 4:00 PM',
    status: 'available',
    stationAr: 'محطة المشاوي',
    stationEn: 'Grill station',
  },
  {
    id: 'salad',
    nameAr: 'سلطة فتوش طازجة',
    nameEn: 'Fresh fattoush salad',
    priceAr: '١٠ ر.س',
    priceEn: 'SAR 10',
    servingTimeAr: 'طوال اليوم',
    servingTimeEn: 'All day',
    status: 'available',
    stationAr: 'ركن السلطات',
    stationEn: 'Salad bar',
  },
  {
    id: 'manakish',
    nameAr: 'مناقيش زعتر',
    nameEn: 'Zaatar manakish',
    priceAr: '٨ ر.س',
    priceEn: 'SAR 8',
    servingTimeAr: '٧:٣٠ — ١٠:٠٠ صباحًا',
    servingTimeEn: '7:30 — 10:00 AM',
    status: 'sold-out',
    stationAr: 'ركن المخبوزات',
    stationEn: 'Bakery corner',
  },
  {
    id: 'kabsa',
    nameAr: 'كبسة دجاج',
    nameEn: 'Chicken kabsa',
    priceAr: '١٨ ر.س',
    priceEn: 'SAR 18',
    servingTimeAr: 'يبدأ ١:٠٠ مساءً',
    servingTimeEn: 'Starts at 1:00 PM',
    status: 'soon',
    stationAr: 'محطة الأطباق الرئيسية',
    stationEn: 'Main hot station',
  },
  {
    id: 'fruit-cup',
    nameAr: 'كوب فواكه موسمية',
    nameEn: 'Seasonal fruit cup',
    priceAr: '٧ ر.س',
    priceEn: 'SAR 7',
    servingTimeAr: 'طوال اليوم',
    servingTimeEn: 'All day',
    status: 'available',
    stationAr: 'ركن المشروبات والوجبات الخفيفة',
    stationEn: 'Drinks & snacks corner',
  },
];

export function CafeteriaMenu() {
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
          <span className="w-16 h-16 rounded-2xl bg-warning/15 dark:bg-warning/20 text-warning flex items-center justify-center">
            <UtensilsCrossed className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'قائمة الطعام اليوم' : "Today's menu"}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar' ? 'الكافتيريا الرئيسية — مبنى الخدمات الطلابية' : 'Main Cafeteria — Student Services Building'}
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
              ? 'هذه معلومات عامة ولا تحتوي على بيانات شخصية. لا يظهر هنا رصيدك أو معلومات الدفع.'
              : 'This is general information and contains no personal data. Your balance and payment info never appear here.'}
          </p>
        </div>

        {/* Meal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {MEALS.map((meal) => {
            const isAvailable = meal.status === 'available';
            const isSoldOut = meal.status === 'sold-out';
            const statusTone = isAvailable
              ? 'public-safe'
              : isSoldOut
                ? 'unavailable'
                : 'needs-qr';
            const statusLabel =
              lang === 'ar'
                ? isAvailable ? 'متوفر' : isSoldOut ? 'نفد' : 'قريبًا'
                : isAvailable ? 'Available' : isSoldOut ? 'Sold out' : 'Soon';

            return (
              <article
                key={meal.id}
                className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-3 hover:border-primary/40 transition"
              >
                <header className="flex items-start justify-between gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? meal.nameAr : meal.nameEn}
                  </h2>
                  <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                </header>

                {(meal.priceAr || meal.priceEn) && (
                  <div className="text-2xl font-bold text-primary num">
                    {lang === 'ar' ? meal.priceAr : meal.priceEn}
                  </div>
                )}

                <dl className="space-y-2 text-base">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Clock className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? meal.servingTimeAr : meal.servingTimeEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? meal.stationAr : meal.stationEn}
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
            <span>{lang === 'ar' ? 'عرض موقع الكافتيريا' : 'Show cafeteria location'}</span>
          </Link>
          <Link
            to="/hours/cafeteria"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <Clock className="w-5 h-5" />
            <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
          </Link>
          <Button variant="primary" onClick={() => navigate('/cafeteria/offers')}>
            <span>{lang === 'ar' ? 'العروض النشطة' : 'Active offers'}</span>
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
