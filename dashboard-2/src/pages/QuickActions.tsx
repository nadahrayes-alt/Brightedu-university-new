import { Search, Building2, GraduationCap, FileText, BookOpen, Coffee, Wrench, Cross, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import { useState } from 'react';

const ICONS: Record<string, typeof Building2> = {
  building: Building2,
  graduation: GraduationCap,
  file: FileText,
  book: BookOpen,
  coffee: Coffee,
  wrench: Wrench,
  cross: Cross,
  sparkle: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  students:   'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  facilities: 'bg-teal-50 dark:bg-teal/15 text-teal border-teal/30',
  documents:  'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  support:    'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  emergency:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

const CATEGORIES = [
  { id: 'all',         ar: 'الكل',           en: 'All' },
  { id: 'students',    ar: 'خدمات الطلاب',   en: 'Student services' },
  { id: 'facilities',  ar: 'المرافق',        en: 'Facilities' },
  { id: 'documents',   ar: 'الوثائق',        en: 'Documents' },
  { id: 'support',     ar: 'الدعم',          en: 'Support' },
  { id: 'emergency',   ar: 'الطوارئ',        en: 'Emergency' },
];

export function QuickActions() {
  const { lang, isRTL } = useApp();
  const [cat, setCat] = useState('all');
  const filtered = cat === 'all' ? SERVICES : SERVICES.filter((s) => s.category === cat);

  return (
    <div className="p-12">
      <div className="flex items-center justify-between mb-6 gap-5 flex-wrap">
        <h1 className="text-4xl font-bold text-ink">
          {lang === 'ar' ? 'كيف أقدر أساعدك؟' : 'How can I help?'}
        </h1>
        <div className="relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-ink-subtle ${isRTL ? 'right-5' : 'left-5'}`} />
          <input
            placeholder={lang === 'ar' ? 'بحث: اكتب اسم خدمة' : 'Search a service'}
            className={`h-16 w-[440px] ${isRTL ? 'pr-14 pl-5' : 'pl-14 pr-5'} rounded-2xl bg-surface-2 border border-border-soft text-lg focus:outline-none focus:bg-surface focus:shadow-focus`}
          />
        </div>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`h-14 px-6 rounded-full text-lg font-medium border transition ${
              cat === c.id
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-ink-muted border-border-soft hover:bg-surface-2'
            }`}
          >
            {lang === 'ar' ? c.ar : c.en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((s) => {
          const Icon = ICONS[s.icon] ?? Building2;
          const colorCls = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.students;
          return (
            <Link
              key={s.id}
              to={`/service/${s.id}`}
              className="group bg-surface border border-border-soft rounded-3xl p-7 h-[220px] hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 ${colorCls}`}>
                <Icon className="w-7 h-7" />
              </span>
              <div className="text-xl font-semibold text-ink mb-1 leading-tight">
                {lang === 'ar' ? s.nameAr : s.nameEn}
              </div>
              <div className="text-base text-ink-muted">
                {lang === 'ar' ? s.building : s.buildingEn}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
