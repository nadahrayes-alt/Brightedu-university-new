import { Users2, Sparkles, ArrowLeftRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Button } from '../components/ui/Button';
import { staff, type StaffRow } from '../data/mockData';
import { useT, useLoc, useToast } from '../context';
import type { DictKey } from '../i18n';

const roleLblKey: Record<StaffRow['role'], DictKey> = {
  reviewer:   'staff.role.reviewer',
  complaints: 'staff.role.complaints',
  documents:  'staff.role.documents',
  advisor:    'staff.role.advisor',
};

export function StaffWorkload() {
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const teamAvg = Math.round(staff.reduce((s, x) => s + x.active, 0) / staff.length);
  const overloaded  = staff.filter((s) => s.capacity > 80);
  const underloaded = staff.filter((s) => s.capacity < 45);

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
      <PageHeader
        title={t('page.staff.title')}
        subtitle={t('page.staff.sub')}
        actions={
          <Button
            variant="primary"
            iconStart={<ArrowLeftRight className="w-4 h-4" />}
            onClick={() => toast(t('cta.rebalance.queued'), 'info')}
          >
            {t('btn.suggestRebalance')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.teamSize')}          value={staff.length} accent="primary" icon={<Users2 className="w-5 h-5" />} />
        <KpiCard label={t('kpi.avgActive')}         value={teamAvg}      accent="teal" />
        <KpiCard label={t('kpi.highLoad')}          value={overloaded.length}  accent="warning" hint={t('kpi.highLoad.hint')} />
        <KpiCard label={t('kpi.availableCapacity')} value={underloaded.length} accent="success" hint={t('kpi.availableCapacity.hint')} />
      </div>

      {overloaded.length > 0 && underloaded.length > 0 && (
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-teal/5">
          <div className="flex items-start gap-3 flex-wrap">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold text-primary-700 dark:text-primary text-sm">{t('staff.suggestion.title')}</div>
              <p className="text-sm text-ink mt-1 leading-relaxed">
                <span className="font-medium">{loc(overloaded[0].nameAr, overloaded[0].nameEn)}</span>{' · '}
                <span className="num">{overloaded[0].active}</span> · {t('kpi.avgActive')}: <span className="num">{teamAvg}</span> ·{' '}
                <span className="font-medium">{loc(underloaded[0].nameAr, underloaded[0].nameEn)}</span>
              </p>
            </div>
            <Button size="sm" variant="primary" onClick={() => toast(t('cta.rebalance.applied'), 'success')}>
              {t('btn.applyDistribution')}
            </Button>
          </div>
        </Card>
      )}

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-b border-border-soft text-ink-muted">
              <tr className="text-start">
                <th className="px-4 py-3 font-medium text-start">{t('col.staffMember')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.role')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.activeReqs')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.completedToday')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.avgHandling')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.overdue')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.capacity')}</th>
                <th className="px-4 py-3 font-medium text-start">{t('col.status')}</th>
                <th className="px-4 py-3 font-medium text-start"></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => {
                const cap = s.capacity;
                const capCls = cap > 85 ? 'bg-warning' : cap > 60 ? 'bg-primary' : 'bg-success';
                return (
                  <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{loc(s.nameAr, s.nameEn)}</td>
                    <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{t(roleLblKey[s.role])}</td>
                    <td className="px-4 py-3 num text-ink">{s.active}</td>
                    <td className="px-4 py-3 num text-ink">{s.completedToday}</td>
                    <td className="px-4 py-3 num text-ink">{s.avgHandlingMin} {t('common.unit.m')}</td>
                    <td className="px-4 py-3">
                      {s.overdue > 0 ? (
                        <span className="text-xs px-2 py-1 rounded-md bg-warning/10 text-warning num">{s.overdue}</span>
                      ) : (
                        <span className="text-xs text-ink-muted num">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                          <div className={`h-full ${capCls}`} style={{ width: `${cap}%` }} />
                        </div>
                        <span className="text-xs text-ink-muted num">{cap}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-md whitespace-nowrap ${
                        s.available ? 'bg-success/10 text-success' : 'bg-surface-2 text-ink-muted'
                      }`}>
                        {s.available ? t('staff.available') : t('staff.onLeave')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button size="sm" variant="secondary" onClick={() => toast(t('cta.reassign.opened'), 'info')}>
                        {t('btn.reassign')}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
