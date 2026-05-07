import { Link, useParams } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { Chip, StatusDot } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import { ar } from '../lib/numerals';

export function Hours() {
  const { lang } = useApp();
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id) ?? SERVICES.find((s) => s.id === 'cafeteria')!;

  return (
    <div className="p-12">
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
          <Coffee className="w-9 h-9" />
        </span>
        <h1 className="text-4xl font-bold text-ink">
          {lang === 'ar' ? `${service.nameAr} مفتوحة الآن` : `${service.nameEn} is open now`}
        </h1>
        <Chip tone="open" icon={<StatusDot tone="open" />}>
          {lang === 'ar' ? 'مفتوح' : 'Open'}
        </Chip>
      </div>

      <ul className="mt-6 space-y-2 text-2xl text-ink-muted max-w-3xl">
        <li>
          {lang === 'ar' ? 'ساعات العمل: ' : 'Hours: '}
          <span className="num text-ink">
            {service.hours.from} — {service.hours.to}
          </span>
        </li>
        <li>
          {lang === 'ar' ? `تقع بالقرب من ${service.building}` : `Near ${service.buildingEn}`}
        </li>
        <li>
          {lang === 'ar'
            ? `تبعد عنك ${ar(service.walkMin)} دقائق مشي`
            : `About ${service.walkMin} min walk`}
        </li>
      </ul>

      <div className="mt-10 bg-surface border border-border-soft rounded-3xl p-8">
        <div className="flex items-center justify-between text-lg text-ink-muted mb-3">
          <span>{lang === 'ar' ? 'اليوم' : 'Today'}</span>
          <span className="num">
            {service.hours.from} ─ {service.hours.to}
          </span>
        </div>
        <div className="relative h-3 bg-surface-2 rounded-full border border-border-soft overflow-visible">
          <div className="absolute inset-y-0 left-0 right-1/3 bg-success/30 rounded-full" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-success/15 rounded-full" />
          <div className="absolute -top-2" style={{ left: '55%' }}>
            <div className="w-7 h-7 rounded-full bg-primary border-4 border-surface live-dot" />
          </div>
        </div>
        <div className="mt-3 text-base text-ink-muted">
          <span className="num">{lang === 'ar' ? `الآن ${ar('2:45')} م` : 'Now 2:45 PM'}</span>
        </div>
      </div>

      <div className="mt-10 flex gap-4 flex-wrap">
        <Link to={`/map/${service.id}`}>
          <Button variant="primary">{lang === 'ar' ? 'عرض الموقع' : 'View location'}</Button>
        </Link>
        <Link to="/services">
          <Button variant="secondary">{lang === 'ar' ? 'خدمات قريبة' : 'Nearby services'}</Button>
        </Link>
        <Link to="/">
          <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
        </Link>
      </div>
    </div>
  );
}
