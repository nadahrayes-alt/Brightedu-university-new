import { Construction } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useT } from '../context';

export function Stub({ title, subtitle }: { title: string; subtitle: string }) {
  const t = useT();
  return (
    <div className="p-4 sm:p-6 max-w-[1100px] mx-auto">
      <PageHeader title={title} subtitle={subtitle} />
      <Card padding="lg">
        <div className="flex items-center gap-4 py-12 px-6 justify-center text-center flex-col">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Construction className="w-7 h-7" />
          </div>
          <div className="max-w-md">
            <h3 className="font-semibold text-lg text-ink mb-2">{t('stub.title')}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{t('stub.body')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
