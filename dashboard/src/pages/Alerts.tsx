import { useState } from 'react';
import { Bell, AlertTriangle, AlertOctagon, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { alerts, type Alert } from '../data/mockData';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useApp, useT, useLoc, useToast } from '../context';
import type { DictKey } from '../i18n';

const severityConfig: Record<Alert['severity'], { lblKey: DictKey; cls: string; icon: typeof Bell }> = {
  critical: { lblKey: 'severity.critical', cls: 'bg-danger/10 text-danger',                           icon: AlertOctagon },
  warning:  { lblKey: 'severity.warning',  cls: 'bg-warning/10 text-warning',                         icon: AlertTriangle },
  info:     { lblKey: 'severity.info',     cls: 'bg-primary/10 text-primary-700 dark:text-primary',   icon: Info },
};

export function Alerts() {
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const navigate = useNavigate();
  const { isRTL } = useApp();
  const [filter, setFilter] = useState<'all' | Alert['severity']>('all');
  const [acting, setActing] = useState<Alert | null>(null);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const visible = (filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter)).filter((a) => !resolvedIds.has(a.id));
  const fmtMin = (m: number) => m > 60 ? `${Math.round(m / 60)} ${t('unit.hour')}` : `${m} ${t('unit.minute')}`;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const openAlert = (a: Alert) => {
    if (a.relatedRequest) navigate(`/requests?id=${a.relatedRequest}`);
    else toast(t('cta.opening'), 'info');
  };

  const resolve = (id: string, msgKey: 'cta.alertResolved' | 'cta.alertEscalated' | 'cta.alertNotified' | 'cta.alertScheduled') => {
    setResolvedIds((prev) => new Set(prev).add(id));
    setActing(null);
    toast(t(msgKey), 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      <PageHeader
        title={t('page.alerts.title')}
        subtitle={t('page.alerts.sub')}
        actions={<Button variant="primary" onClick={() => { toast(t('cta.rebalance.queued'), 'info'); navigate('/staff'); }}>{t('btn.rebalance')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <div className="text-xs text-ink-muted">{t('severity.critical')}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-3xl font-bold num text-danger">{alerts.filter(a => a.severity === 'critical').length}</div>
            <AlertOctagon className="w-7 h-7 text-danger/70" />
          </div>
        </Card>
        <Card>
          <div className="text-xs text-ink-muted">{t('severity.warning')}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-3xl font-bold num text-warning">{alerts.filter(a => a.severity === 'warning').length}</div>
            <AlertTriangle className="w-7 h-7 text-warning/70" />
          </div>
        </Card>
        <Card>
          <div className="text-xs text-ink-muted">{t('severity.informational')}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-3xl font-bold num text-primary-700 dark:text-primary">{alerts.filter(a => a.severity === 'info').length}</div>
            <Info className="w-7 h-7 text-primary/70" />
          </div>
        </Card>
        <Card>
          <div className="text-xs text-ink-muted">{t('alerts.avgResponse')}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-3xl font-bold num text-ink">9</div>
            <span className="text-xs text-ink-muted">{t('unit.minute')}</span>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1 border border-border-soft w-fit mb-4">
        {([
          { k: 'all',      lbl: 'tab.all'           as DictKey },
          { k: 'critical', lbl: 'severity.critical' as DictKey },
          { k: 'warning',  lbl: 'severity.warning'  as DictKey },
          { k: 'info',     lbl: 'severity.info'     as DictKey },
        ] as const).map((tab) => (
          <button
            key={tab.k}
            onClick={() => setFilter(tab.k as 'all')}
            className={`px-3 h-8 rounded-lg text-xs font-medium transition ${
              filter === tab.k ? 'bg-surface text-primary-700 dark:text-primary' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t(tab.lbl)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <Card padding="lg">
            <div className="py-8 text-center text-ink-muted text-sm">{t('notif.empty')}</div>
          </Card>
        )}
        {visible.map((a) => {
          const c = severityConfig[a.severity];
          const Icon = c.icon;
          return (
            <Card key={a.id} padding="md" hover>
              <div className="flex items-start gap-4 flex-wrap">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.cls}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-ink">{loc(a.titleAr, a.titleEn)}</h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${c.cls}`}>{t(c.lblKey)}</span>
                    {a.relatedRequest && (
                      <span className="text-[11px] num text-primary-700 dark:text-primary bg-primary/10 px-2 py-0.5 rounded-md whitespace-nowrap">{a.relatedRequest}</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-muted mt-1 leading-relaxed">{loc(a.detailAr, a.detailEn)}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted flex-wrap">
                    <span>{t('alerts.owner')}: <span className="text-ink">{loc(a.ownerAr, a.ownerEn)}</span></span>
                    <span>{fmtMin(a.openedMinAgo)}</span>
                    <span className="text-primary-700 dark:text-primary">{t('alerts.suggested')}: {loc(a.suggestedActionAr, a.suggestedActionEn)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="primary" onClick={() => setActing(a)}>
                    {a.severity === 'critical' ? t('btn.urgentEscalate') : t('btn.act')}
                  </Button>
                  <Button size="sm" variant="ghost" iconStart={<ChevronIcon className="w-4 h-4" />} onClick={() => openAlert(a)}>
                    {t('btn.open')}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={!!acting}
        onClose={() => setActing(null)}
        title={acting ? loc(acting.titleAr, acting.titleEn) : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActing(null)}>{t('btn.cancel')}</Button>
            <Button
              variant="primary"
              onClick={() => acting && resolve(acting.id, acting.severity === 'critical' ? 'cta.alertEscalated' : 'cta.alertResolved')}
            >
              {t('btn.execute')}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 mb-3 text-ink">
          {acting && loc(acting.detailAr, acting.detailEn)}
          <br />
          <span className="text-ink-muted text-xs">{t('alerts.suggested')}: {acting && loc(acting.suggestedActionAr, acting.suggestedActionEn)}</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <button
            onClick={() => acting && resolve(acting.id, 'cta.alertEscalated')}
            className="rounded-xl border border-border-soft p-3 hover:bg-surface-2 text-start text-ink"
          >{t('alerts.act.reassign')}</button>
          <button
            onClick={() => acting && resolve(acting.id, 'cta.alertNotified')}
            className="rounded-xl border border-border-soft p-3 hover:bg-surface-2 text-start text-ink"
          >{t('alerts.act.notify')}</button>
          <button
            onClick={() => acting && resolve(acting.id, 'cta.alertScheduled')}
            className="rounded-xl border border-border-soft p-3 hover:bg-surface-2 text-start text-ink"
          >{t('alerts.act.schedule')}</button>
          <button
            onClick={() => acting && resolve(acting.id, 'cta.alertResolved')}
            className="rounded-xl border border-border-soft p-3 hover:bg-surface-2 text-start text-ink"
          >{t('alerts.act.close')}</button>
        </div>
      </Modal>
    </div>
  );
}
