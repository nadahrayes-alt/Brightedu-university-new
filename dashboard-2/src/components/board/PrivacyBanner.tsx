import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

export function PrivacyBanner() {
  const { lang } = useApp();
  return (
    <div className="flex items-center gap-3 px-12 py-4 bg-privacy/10 dark:bg-privacy/20 border-b-4 border-privacy">
      <ShieldCheck className="w-6 h-6 text-privacy" />
      <span className="text-xl text-ink">
        {lang === 'ar'
          ? 'لن يتم عرض أي بيانات شخصية على هذه الشاشة.'
          : 'No personal data will be shown on this screen.'}
      </span>
    </div>
  );
}
