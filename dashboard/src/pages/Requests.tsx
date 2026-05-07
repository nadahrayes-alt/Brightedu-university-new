import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Plus, Download, Search, Bot } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { RequestTable } from '../components/widgets/RequestTable';
import { RequestDetailDrawer } from '../components/widgets/RequestDetailDrawer';
import { Button } from '../components/ui/Button';
import { requests, type AiTier, type RequestRow, type RequestStatus } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { useApp, useT, useToast } from '../context';
import type { DictKey } from '../i18n';

const statusTabs: { key: 'all' | RequestStatus; lbl: DictKey }[] = [
  { key: 'all',              lbl: 'tab.all' },
  { key: 'new',              lbl: 'status.new' },
  { key: 'in_review',        lbl: 'status.in_review' },
  { key: 'waiting_approval', lbl: 'status.waiting_approval' },
  { key: 'escalated',        lbl: 'status.escalated' },
  { key: 'sla_risk',         lbl: 'status.sla_risk' },
  { key: 'completed',        lbl: 'status.completed' },
];

const tierFilters: { key: 'all' | AiTier; lbl: DictKey }[] = [
  { key: 'all',    lbl: 'tier.filter.all' },
  { key: 'green',  lbl: 'tier.green' },
  { key: 'yellow', lbl: 'tier.yellow' },
  { key: 'red',    lbl: 'tier.red' },
  { key: 'black',  lbl: 'tier.black' },
];

export function Requests() {
  const t = useT();
  const toast = useToast();
  const { isRTL } = useApp();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [tab, setTab] = useState<(typeof statusTabs)[number]['key']>('all');
  const [tier, setTier] = useState<(typeof tierFilters)[number]['key']>('all');
  const [q, setQ] = useState('');

  // Open drawer when ?id=REQ-XXXX
  useEffect(() => {
    const id = params.get('id');
    if (id) {
      const found = requests.find((r) => r.id === id);
      if (found) setSelected(found);
    }
  }, [params]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (tab !== 'all' && r.status !== tab) return false;
      if (tier !== 'all' && r.tier !== tier) return false;
      if (q && !`${r.id} ${r.serviceAr} ${r.service} ${r.studentMaskedId} ${r.studentName ?? ''} ${r.studentNameEn ?? ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, tier, q]);

  const closeDrawer = () => {
    setSelected(null);
    if (params.get('id')) {
      params.delete('id');
      setParams(params, { replace: true });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title={t('page.requests.title')}
        subtitle={t('page.requests.sub')}
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Download className="w-4 h-4" />}
              onClick={() => toast(t('cta.export.queued'), 'success')}
            >
              {t('btn.export')}
            </Button>
            <Button
              variant="primary"
              iconStart={<Plus className="w-4 h-4" />}
              onClick={() => toast(t('cta.newRequest'), 'info')}
            >
              {t('btn.newRequest')}
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-1 mb-4 border-b border-border-soft overflow-x-auto">
        {statusTabs.map((tab2) => {
          const count = tab2.key === 'all' ? requests.length : requests.filter((r) => r.status === tab2.key).length;
          const active = tab === tab2.key;
          return (
            <button
              key={tab2.key}
              onClick={() => setTab(tab2.key)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition ${
                active
                  ? 'border-primary text-primary-700 dark:text-primary font-medium'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {t(tab2.lbl)}
              <span className={`ms-2 text-[11px] px-1.5 py-0.5 rounded num ${active ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-ink-muted'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <Card padding="sm" className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('requests.search.ph')}
              className={`w-full h-10 bg-surface-2 border border-border-soft rounded-xl text-sm focus:outline-none focus:bg-surface focus:shadow-focus text-ink ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1 border border-border-soft overflow-x-auto">
            {tierFilters.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTier(tf.key)}
                className={`px-3 h-8 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  tier === tf.key ? 'bg-surface text-primary-700 dark:text-primary' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t(tf.lbl)}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            iconStart={<Filter className="w-4 h-4" />}
            onClick={() => toast(t('cta.filters.openSoon'), 'info')}
          >
            {t('btn.otherFilters')}
          </Button>
          <div className="ms-auto inline-flex items-center gap-1.5 text-xs text-ink-muted bg-primary/5 px-2.5 py-1 rounded-md">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>{t('requests.aiHint')}</span>
          </div>
        </div>
      </Card>

      <RequestTable rows={filtered} onOpen={setSelected} selectedId={selected?.id} />

      <RequestDetailDrawer request={selected} onClose={closeDrawer} />
    </div>
  );
}
