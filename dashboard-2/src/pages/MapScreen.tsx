import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Footprints, Ruler, DoorOpen, Users, Accessibility, ArrowLeft, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { MapCanvas } from '../components/board/MapCanvas';
import { Button } from '../components/ui/Button';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import { ar } from '../lib/numerals';

export function MapScreen() {
  const { lang } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessible, setAccessible] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const service =
    SERVICES.find((s) => s.id === id) ?? {
      id: 'main-gate',
      nameAr: 'البوابة الرئيسية',
      nameEn: 'Main Gate',
      building: 'البوابة الشرقية',
      buildingEn: 'East gate',
      walkMin: 5,
      meters: 380,
      queue: { level: 'low' as const, minutes: 0 },
      lat: 21.4936,
      lng: 39.2469,
    };

  const walkMin = accessible ? service.walkMin + 2 : service.walkMin;

  function startGuiding() {
    setOverlay(true);
    window.setTimeout(() => setOverlay(false), 1500);
  }

  return (
    <div className="p-12">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
          className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h1 className="text-4xl font-bold text-ink flex items-center gap-3">
          <MapPin className="w-9 h-9 text-primary" />
          {lang === 'ar'
            ? `المسار إلى ${service.nameAr}`
            : `Route to ${service.nameEn}`}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative h-[680px]">
          <MapCanvas accessible={accessible} lat={service.lat} lng={service.lng} />
          {overlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-fade-in rounded-3xl">
              <div className="bg-surface px-8 py-6 rounded-2xl shadow-card-lg flex items-center gap-4 text-2xl font-semibold border border-border-soft">
                <ArrowIcon className="w-9 h-9 text-primary" />
                {lang === 'ar' ? 'توجه نحو البوابة الشرقية' : 'Head toward the East Gate'}
              </div>
            </div>
          )}
        </div>

        <aside className="bg-surface border border-border-soft rounded-3xl p-8 flex flex-col">
          <header className="mb-4">
            <span className="text-base text-ink-muted inline-flex items-center gap-2">
              <MapPin className="w-5 h-5" /> {lang === 'ar' ? 'الوجهة' : 'Destination'}
            </span>
            <h2 className="text-3xl font-bold text-ink leading-tight mt-2">
              {lang === 'ar' ? service.nameAr : service.nameEn}
            </h2>
            <p className="text-lg text-ink-muted">
              {lang === 'ar' ? service.building : service.buildingEn}
            </p>
          </header>

          <hr className="my-4 border-border-soft" />

          <ul className="space-y-3 text-xl">
            <li className="flex items-center gap-3">
              <Footprints className="w-6 h-6 text-primary" />
              <span>{lang === 'ar' ? `${ar(walkMin)} دقائق مشي` : `${walkMin} min walk`}</span>
            </li>
            <li className="flex items-center gap-3">
              <Ruler className="w-6 h-6 text-primary" />
              <span>{lang === 'ar' ? `${ar(service.meters)} متر` : `${service.meters} m`}</span>
            </li>
            <li className="flex items-center gap-3">
              <DoorOpen className="w-6 h-6 text-primary" />
              <span>{lang === 'ar' ? 'أقرب بوابة: الشرقية' : 'Nearest gate: East'}</span>
            </li>
            <li className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <span>
                {lang === 'ar'
                  ? 'مؤشر الازدحام: متوسط · انتظار متوقع: ١٠–١٥ دقيقة'
                  : 'Congestion: medium · Expected wait: 10–15 min'}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Accessibility className="w-6 h-6 text-success" />
              <span>{lang === 'ar' ? 'مسار ميسر متاح' : 'Accessible route available'}</span>
            </li>
          </ul>

          {accessible && (
            <p className="mt-3 text-base text-ink-muted">
              {lang === 'ar'
                ? 'يتضمن المصعد في مبنى ٢ ومنحدر مبنى ٤'
                : 'Includes elevator in Building 2 and ramp at Building 4'}
            </p>
          )}

          <hr className="my-4 border-border-soft" />

          <div className="flex flex-col gap-3 mt-auto">
            <Button block onClick={startGuiding}>
              <span>{lang === 'ar' ? 'ابدأ التوجيه' : 'Start directions'}</span>
              <ArrowIcon className="w-6 h-6" />
            </Button>
            <button
              onClick={() => setAccessible((v) => !v)}
              className={`h-14 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 border-2 transition ${
                accessible
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-2 text-ink border-border-soft hover:border-primary'
              }`}
            >
              <Accessibility className="w-6 h-6" />
              <span>{lang === 'ar' ? 'مسار ميسر' : 'Accessible route'}</span>
            </button>

            <Link
              to="/queue"
              className="text-center text-primary text-lg font-medium underline-offset-4 hover:underline mt-1"
            >
              {lang === 'ar' ? 'حالة الانتظار · خدمات قريبة' : 'Queue · nearby services'}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
