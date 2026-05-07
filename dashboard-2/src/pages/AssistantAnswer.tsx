import { Sparkles, MapPin, Clock, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { AssistantInput } from '../components/board/AssistantInput';
import { Chip } from '../components/ui/Chip';
import { MiniMapPreview } from '../components/board/MapCanvas';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { SERVICES } from '../data/services';

export function AssistantAnswer() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id) ?? SERVICES[0];
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;

  // Public-safe general inquiry. The user's bubble is generic — it covers
  // location, hours, and service-list inquiries without ever requesting
  // a University ID or any private data.
  const userQ = lang === 'ar'
    ? `استفسار عن ${service.nameAr}`
    : `Inquiry about ${service.nameEn}`;
  const answer = lang === 'ar'
    ? `${service.nameAr} موجود في ${service.building}. أقدر أساعدك بعرض الموقع على الخريطة أو معرفة ساعات العمل.`
    : `${service.nameEn} is located at ${service.buildingEn}. I can help you view the location on the map or check the working hours.`;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <section className="lg:col-span-2 bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-5 min-h-[640px]">
          {/* User bubble */}
          <div className="self-start max-w-[80%]">
            <div className="bg-surface-2 text-ink rounded-3xl rounded-tl-md px-6 py-4 text-xl border border-border-soft">
              {userQ}
            </div>
          </div>

          {/* Assistant rich bubble — public-safe inquiry response */}
          <div className="self-end max-w-[88%]">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-3xl rounded-tr-md p-7 border border-primary/30 dark:border-primary/40">
              <header className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 text-primary font-semibold text-lg">
                  <Sparkles className="w-5 h-5" />
                  {lang === 'ar' ? 'مساعد الحرم' : 'Campus Assistant'}
                </span>
                <Chip tone="public-safe">
                  {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
                </Chip>
              </header>
              <p className="text-xl leading-relaxed mb-5">{answer}</p>

              <div className="mb-4">
                <MiniMapPreview lat={service.lat} lng={service.lng} />
              </div>
              <div className="text-base text-ink-muted mb-5">
                {lang === 'ar' ? service.nameAr : service.nameEn} ·{' '}
                {lang === 'ar' ? service.building : service.buildingEn}
              </div>

              {/* Four public-safe actions per scenario #009 */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/map/${service.id}`}
                  className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
                </Link>
                <Link
                  to={`/hours/${service.id}`}
                  className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
                >
                  <Clock className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
                </Link>
                <Link
                  to={`/service/${service.id}`}
                  className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
                >
                  <Building2 className="w-5 h-5" />
                  <span>
                    {lang === 'ar' ? `خدمات ${service.nameAr}` : `${service.nameEn} services`}
                  </span>
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface-2 text-ink border border-border-soft text-lg font-semibold hover:bg-border-soft transition"
                >
                  <ChevIcon className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'الرجوع' : 'Back'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <AssistantInput />
        </section>

        <aside className="bg-surface border border-border-soft rounded-3xl p-7">
          <h3 className="text-xl font-semibold mb-4">
            {lang === 'ar' ? 'مقترحات' : 'Suggestions'}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { ar: 'مواعيد المكتبة', en: 'Library hours', to: '/hours/library' },
              { ar: 'إصدار إثبات قيد', en: 'Issue enrollment letter', to: '/request/enrollment' },
              { ar: 'أقرب كافتيريا', en: 'Nearest cafeteria', to: '/hours/cafeteria' },
              { ar: 'ما حالة طلبي؟', en: 'My request status?', to: '/refusal' },
            ].map((c) => (
              <Link
                key={c.ar}
                to={c.to}
                className="block px-4 h-14 rounded-2xl bg-surface-2 border border-border-soft hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary text-lg text-ink-muted flex items-center"
              >
                {lang === 'ar' ? c.ar : c.en}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
