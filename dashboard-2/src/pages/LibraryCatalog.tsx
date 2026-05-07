import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  BookOpen, Sparkles, MapPin, Search, Info,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface Book {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  /** Public location inside the library — never tied to a borrower. */
  locationAr: string;
  locationEn: string;
  /** General catalog status — never reveals who borrowed it. */
  status: 'available' | 'borrowed' | 'unavailable';
}

const CATALOG: Book[] = [
  {
    id: 'b-001',
    titleAr: 'مقدمة في الذكاء الاصطناعي',
    titleEn: 'Introduction to Artificial Intelligence',
    authorAr: 'د. أحمد الزهراني',
    authorEn: 'Dr. Ahmed Al-Zahrani',
    locationAr: 'الدور الثاني · رف A-12',
    locationEn: '2nd floor · Shelf A-12',
    status: 'available',
  },
  {
    id: 'b-002',
    titleAr: 'أسس الأمن السيبراني',
    titleEn: 'Foundations of Cybersecurity',
    authorAr: 'د. مها العبدالله',
    authorEn: 'Dr. Maha Al-Abdullah',
    locationAr: 'الدور الثالث · رف C-04',
    locationEn: '3rd floor · Shelf C-04',
    status: 'borrowed',
  },
  {
    id: 'b-003',
    titleAr: 'الكتابة العلمية باللغة العربية',
    titleEn: 'Academic Writing in Arabic',
    authorAr: 'د. سعد القرني',
    authorEn: 'Dr. Saad Al-Qarni',
    locationAr: 'الدور الأول · رف B-21',
    locationEn: '1st floor · Shelf B-21',
    status: 'available',
  },
  {
    id: 'b-004',
    titleAr: 'مبادئ ريادة الأعمال',
    titleEn: 'Principles of Entrepreneurship',
    authorAr: 'م. ليلى الحربي',
    authorEn: 'Eng. Layla Al-Harbi',
    locationAr: 'الدور الثاني · رف A-03',
    locationEn: '2nd floor · Shelf A-03',
    status: 'available',
  },
  {
    id: 'b-005',
    titleAr: 'تاريخ الجزيرة العربية الحديث',
    titleEn: 'Modern History of the Arabian Peninsula',
    authorAr: 'د. عبدالعزيز الشريف',
    authorEn: 'Dr. Abdulaziz Al-Sharif',
    locationAr: 'الدور الأول · رف D-09',
    locationEn: '1st floor · Shelf D-09',
    status: 'unavailable',
  },
  {
    id: 'b-006',
    titleAr: 'أساسيات تجربة المستخدم',
    titleEn: 'UX Fundamentals',
    authorAr: 'د. رنا المطيري',
    authorEn: 'Dr. Rana Al-Mutairi',
    locationAr: 'الدور الثالث · رف C-18',
    locationEn: '3rd floor · Shelf C-18',
    status: 'available',
  },
];

export function LibraryCatalog() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter((b) =>
      [b.titleAr, b.titleEn, b.authorAr, b.authorEn]
        .some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

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
            <BookOpen className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'البحث في الفهرس' : 'Search the catalog'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar' ? 'الفهرس العام لمكتبة الجامعة' : 'The public library catalog'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/30 mb-8">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-base text-ink leading-relaxed">
            {lang === 'ar'
              ? 'هذا فهرس عام ولا يتضمن حسابك أو تاريخ إعارتك أو غراماتك. حالة الكتاب تشير إلى توفّره العام فقط.'
              : 'This is a public catalog and does not include your account, borrowing history, or fines. A book status only reflects general availability.'}
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <Search className="absolute top-1/2 -translate-y-1/2 start-5 w-6 h-6 text-ink-subtle pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث عن كتاب أو مؤلف' : 'Search for a book or author'}
            className="w-full h-16 ps-14 pe-5 rounded-2xl bg-surface border border-border-soft text-lg text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:shadow-focus"
            aria-label={lang === 'ar' ? 'البحث في الفهرس' : 'Search the catalog'}
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {results.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 text-ink-muted">
              {lang === 'ar' ? 'لا توجد نتائج مطابقة.' : 'No matching results.'}
            </div>
          ) : (
            results.map((book) => {
              const isAvailable = book.status === 'available';
              const isBorrowed = book.status === 'borrowed';
              const statusTone = isAvailable
                ? 'public-safe'
                : isBorrowed ? 'needs-qr' : 'unavailable';
              const statusLabel =
                lang === 'ar'
                  ? isAvailable ? 'متوفر' : isBorrowed ? 'معار' : 'غير متاح'
                  : isAvailable ? 'Available' : isBorrowed ? 'Borrowed' : 'Unavailable';

              return (
                <article
                  key={book.id}
                  className="bg-surface border border-border-soft rounded-3xl p-6 flex flex-col gap-3 hover:border-primary/40 transition"
                >
                  <header className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold text-ink leading-tight">
                        {lang === 'ar' ? book.titleAr : book.titleEn}
                      </h2>
                      <p className="text-base text-ink-muted mt-1">
                        {lang === 'ar' ? book.authorAr : book.authorEn}
                      </p>
                    </div>
                    <Chip tone={statusTone} size="sm">{statusLabel}</Chip>
                  </header>

                  <div className="flex items-center gap-2 text-base text-ink-muted">
                    <MapPin className="w-5 h-5 shrink-0 text-primary" />
                    <span className="text-ink">
                      {lang === 'ar' ? book.locationAr : book.locationEn}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to="/map/library"
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-ink border border-border-soft hover:border-primary text-sm font-semibold transition"
                    >
                      <Search className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'أين أجده؟' : 'Where is it?'}</span>
                    </Link>
                    <Link
                      to="/map/library"
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-2 text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-semibold transition"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'عرض موقع المكتبة' : 'Show library location'}</span>
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            onClick={() => navigate('/start-request/library?action=borrow-a-book')}
          >
            <span>{lang === 'ar' ? 'طلب إعارة كتاب' : 'Borrow a book'}</span>
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
