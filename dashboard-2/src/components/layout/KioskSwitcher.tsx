import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, MapPin } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { KIOSKS, findKioskById } from '../../data/mock';

export function KioskSwitcher() {
  const { lang, isRTL, currentKioskId, setCurrentKioskId } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const current = findKioskById(currentKioskId) ?? KIOSKS[0];

  // Group kiosks by campus.
  const byCampus = KIOSKS.reduce<Record<string, typeof KIOSKS>>((acc, k) => {
    (acc[k.campus] ||= []).push(k);
    return acc;
  }, {});

  const campusLabels: Record<string, { ar: string; en: string }> = {
    'kau-jeddah': { ar: 'حرم جدة الرئيسي', en: 'KAU Jeddah Main Campus' },
    'kau-rabigh': { ar: 'فرع رابغ', en: 'Rabigh Branch' },
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`hidden sm:flex items-center gap-3 ${isRTL ? 'border-r' : 'border-l'} border-border-soft hover:bg-surface-2 rounded-2xl px-3 py-1.5 transition`}
      >
        <ChevronDown className={`w-5 h-5 text-ink-muted transition ${open ? 'rotate-180' : ''}`} />
        <div className="text-end hidden md:block">
          <div className="text-base font-semibold text-ink leading-tight max-w-[260px] truncate">
            {lang === 'ar' ? current.nameAr : current.nameEn}
          </div>
          <div className="text-sm text-ink-muted leading-tight num">
            {current.id}
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple text-white flex items-center justify-center font-semibold text-base">
          {current.short}
        </div>
      </button>

      {open && (
        <div className={`absolute mt-3 w-[400px] bg-surface border border-border-soft rounded-2xl shadow-2xl z-50 overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}>
          <div className="px-5 py-4 border-b border-border-soft">
            <div className="text-base font-semibold text-ink">
              {lang === 'ar' ? 'تبديل اللوحة' : 'Switch kiosk'}
            </div>
            <div className="text-sm text-ink-muted">
              {lang === 'ar' ? 'اختر لوحة نشطة لعرضها' : 'Pick an active kiosk to view'}
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {Object.entries(byCampus).map(([campus, kiosks]) => (
              <div key={campus} className="py-2">
                <div className="px-5 py-2 text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  {lang === 'ar' ? campusLabels[campus]?.ar : campusLabels[campus]?.en}
                </div>
                {kiosks.map((k) => {
                  const active = k.id === current.id;
                  return (
                    <button
                      key={k.id}
                      onClick={() => {
                        setCurrentKioskId(k.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-start hover:bg-surface-2 transition ${
                        active ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                        active
                          ? 'bg-gradient-to-br from-primary to-purple text-white'
                          : 'bg-surface-2 text-ink-muted'
                      }`}>
                        {k.short}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-base leading-tight truncate ${active ? 'font-semibold text-ink' : 'text-ink'}`}>
                          {lang === 'ar' ? k.nameAr : k.nameEn}
                        </div>
                        <div className="text-sm text-ink-muted truncate inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {lang === 'ar' ? k.buildingAr : k.buildingEn}
                          <span className="text-ink-subtle">·</span>
                          <span className="num">{k.id}</span>
                        </div>
                      </div>
                      {active && <Check className="w-5 h-5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-border-soft text-xs text-ink-muted text-center">
            {lang === 'ar'
              ? `${KIOSKS.length} لوحة نشطة في الحرم`
              : `${KIOSKS.length} active kiosks on campus`}
          </div>
        </div>
      )}
    </div>
  );
}
