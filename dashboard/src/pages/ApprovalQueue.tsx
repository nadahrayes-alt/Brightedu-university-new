import { useMemo, useState } from 'react';
import { CheckSquare, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiTierBadge, ChannelBadge, SlaTimer } from '../components/ui/Badges';
import { requests, type RequestRow } from '../data/mockData';
import { RequestDetailDrawer } from '../components/widgets/RequestDetailDrawer';
import { KpiCard } from '../components/ui/KpiCard';
import { useApp, useT, useLoc, useToast } from '../context';

export function ApprovalQueue() {
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const { isRTL } = useApp();
  const baseQueue = requests.filter(
    (r) => r.status === 'waiting_approval' || (r.tier === 'yellow' && r.status === 'in_review'),
  );
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<RequestRow | null>(null);

  const visible = useMemo(() => baseQueue.filter((r) => !approvedIds.has(r.id)), [baseQueue, approvedIds]);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const ready = visible.filter((r) => r.rules.every((x) => x.passed));

  const approveOne = (id: string) => {
    setApprovedIds((prev) => new Set(prev).add(id));
    toast(t('cta.rowApproved'), 'success');
  };

  const approveAllReady = () => {
    if (ready.length === 0) return;
    setApprovedIds((prev) => {
      const next = new Set(prev);
      ready.forEach((r) => next.add(r.id));
      return next;
    });
    toast(t('cta.bulkApproved'), 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title={t('page.approvals.title')}
        subtitle={t('page.approvals.sub')}
        actions={
          <Button
            variant="primary"
            iconStart={<CheckSquare className="w-4 h-4" />}
            disabled={ready.length === 0}
            onClick={approveAllReady}
          >
            {t('btn.bulkApprove')} ({ready.length})
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.awaitingApproval')} value={visible.length}                 accent="warning" icon={<CheckSquare className="w-5 h-5" />} />
        <KpiCard label={t('kpi.readyNow')}         value={ready.length}                  accent="success" icon={<Sparkles className="w-5 h-5" />} hint={t('kpi.readyNow.hint')} />
        <KpiCard label={t('kpi.missingChecks')}    value={visible.length - ready.length} accent="warning" />
        <KpiCard label={t('kpi.dailyApprovalRate')} value={94} unit="%" trend={+3}        accent="primary" />
      </div>

      <Card padding="sm">
        <ul className="divide-y divide-border-soft">
          {visible.length === 0 && (
            <li className="px-4 py-12 text-center text-ink-muted text-sm">{t('requests.empty')}</li>
          )}
          {visible.map((r) => {
            const passed = r.rules.filter(x => x.passed).length;
            const isReady = passed === r.rules.length;
            return (
              <li key={r.id} className="p-4 hover:bg-surface-2/40 transition rounded-xl flex items-center gap-3 sm:gap-4 flex-wrap">
                <AiTierBadge tier={r.tier} />
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium text-ink truncate">{loc(r.serviceAr, r.service)}</div>
                    <span className="text-xs text-ink-muted num">· {r.id}</span>
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5 line-clamp-1">{loc(r.aiSummaryAr, r.aiSummaryEn)}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                    <ChannelBadge ch={r.channel} />
                    <span className="text-ink-muted">{loc(r.collegeAr, r.college)}</span>
                    <span className="text-ink-muted">{t('approvals.checks')}: <span className="num">{passed}/{r.rules.length}</span></span>
                  </div>
                </div>
                <SlaTimer minutes={r.slaMinutesLeft} />
                <Button variant="success" size="sm" disabled={!isReady} onClick={() => approveOne(r.id)}>
                  {t('btn.approve')}
                </Button>
                <Button variant="secondary" size="sm" iconStart={<ChevronIcon className="w-4 h-4" />} onClick={() => setOpen(r)}>
                  {t('btn.review')}
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>

      <RequestDetailDrawer request={open} onClose={() => setOpen(null)} />
    </div>
  );
}
