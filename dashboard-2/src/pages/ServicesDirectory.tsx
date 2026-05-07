import { Search, ChevronDown, Filter, ShieldCheck, Info } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { ServiceCard } from '../components/board/ServiceCard';
import { SERVICES } from '../data/services';

const CATEGORIES = [
  { id: 'all',        ar: 'الكل',         en: 'All' },
  { id: 'students',   ar: 'خدمات الطلاب', en: 'Student services' },
  { id: 'facilities', ar: 'المرافق',      en: 'Facilities' },
  { id: 'documents',  ar: 'الوثائق',      en: 'Documents' },
  { id: 'support',    ar: 'الدعم',        en: 'Support' },
  { id: 'emergency',  ar: 'الطوارئ',      en: 'Emergency' },
];

type SortKey = 'default' | 'wait' | 'distance';

export function ServicesDirectory() {
  const { lang, isRTL } = useApp();
  const [cat, setCat] = useState('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('default');
  const [query, setQuery] = useState('');

  let filtered = SERVICES;
  if (cat !== 'all') filtered = filtered.filter((s) => s.category === cat);
  if (openOnly) filtered = filtered.filter((s) => s.status === 'open');
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter((s) =>
      s.nameAr.includes(q) || s.nameEn.toLowerCase().includes(q)
    );
  }
  if (sort === 'wait') {
    filtered = [...filtered].sort((a, b) => (a.queue?.minutes ?? 0) - (b.queue?.minutes ?? 0));
  } else if (sort === 'distance') {
    filtered = [...filtered].sort((a, b) => a.walkMin - b.walkMin);
  }

  const sortLabels: Record<SortKey, { ar: string; en: string }> = {
    default:  { ar: 'افتراضي',     en: 'Default' },
    wait:     { ar: 'الأقل انتظارًا', en: 'Shortest wait' },
    distance: { ar: 'الأقرب',       en: 'Nearest' },
  };

  return (
    <div className="p-12 max-w-7xl mx-auto space-y-6">
      {/* Title row + public-safe badge */}
      <div className="flex items-end justify-between gap-5 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-4xl font-bold text-ink">
              {lang === 'ar' ? 'دليل خدمات الحرم' : 'Campus services'}
            </h1>
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-success-soft dark:bg-success/15 text-success text-base font-semibold">
              <ShieldCheck className="w-4 h-4" />
              {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
            </span>
          </div>
          <p className="text-lg text-ink-muted">
            {lang === 'ar'
              ? `${filtered.length} خدمة متاحة الآن من ${SERVICES.length}`
              : `${filtered.length} of ${SERVICES.length} services`}
          </p>
        </div>
      </div>

      {/* Public-safe helper note */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-success-soft/60 dark:bg-success/10 border border-success/20">
        <Info className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <p className="text-base text-ink leading-relaxed">
          {lang === 'ar'
            ? 'تعرض هذه الصفحة مواقع الخدمات وساعات العمل والازدحام التقديري فقط. لا تحتوي على بيانات شخصية ولا تتطلب الرقم الجامعي.'
            : 'This page only shows service locations, hours, and estimated congestion. It contains no personal data and does not require a University ID.'}
        </p>
      </div>

      {/* Search bar — full width */}
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 text-ink-subtle ${isRTL ? 'right-6' : 'left-6'}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن خدمة، مبنى، أو سؤال...' : 'Search a service, building, or question...'}
          className={`w-full h-[72px] ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'} rounded-2xl bg-surface-2 border border-border-soft text-xl placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus`}
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-3 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-14 px-7 rounded-full text-lg font-medium border-2 transition ${
              cat === c.id
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-surface text-ink-muted border-border-soft hover:border-primary/50'
            }`}
          >
            {lang === 'ar' ? c.ar : c.en}
          </button>
        ))}
      </div>

      {/* Toolbar: open-only toggle + sort */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <button
          onClick={() => setOpenOnly((v) => !v)}
          className={`inline-flex items-center gap-3 h-12 px-5 rounded-2xl text-base font-medium transition border-2 ${
            openOnly
              ? 'bg-success/10 dark:bg-success/20 text-success border-success/30'
              : 'bg-surface text-ink-muted border-border-soft hover:border-primary/40'
          }`}
        >
          <span className={`w-3 h-3 rounded-full ${openOnly ? 'bg-success live-dot' : 'bg-ink-subtle'}`} />
          <span>{lang === 'ar' ? 'المفتوحة فقط' : 'Open now only'}</span>
        </button>

        <div className="inline-flex items-center gap-2 text-base text-ink-muted">
          <Filter className="w-5 h-5" />
          <span>{lang === 'ar' ? 'ترتيب:' : 'Sort:'}</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={`appearance-none bg-surface border-2 border-border-soft rounded-2xl h-12 ${isRTL ? 'pl-10 pr-4' : 'pl-4 pr-10'} text-base font-medium text-ink focus:outline-none focus:border-primary/40 cursor-pointer`}
            >
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {lang === 'ar' ? sortLabels[k].ar : sortLabels[k].en}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} />
          </div>
        </div>
      </div>

      {/* Cards grid — 3 columns on wide */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted text-xl">
          {lang === 'ar' ? 'لا توجد خدمات تطابق البحث.' : 'No services match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
