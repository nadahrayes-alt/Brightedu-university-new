import { Inbox, Clock, Bot, AlertTriangle, CheckCircle2, HeartHandshake, Timer, Activity } from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Card } from '../components/ui/Card';
import {
  overviewKpis, requestVolume, automationDonut, topServices, alerts, supportCases, slaCompliance,
} from '../data/mockData';
import { AiTierBadge } from '../components/ui/Badges';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useApp, useT, useLoc, useToast } from '../context';

export function Overview() {
  const { role, range, isRTL } = useApp();
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const navigate = useNavigate();

  const trendMul = range === '24h' ? 1 : range === '7d' ? 6.4 : 27;
  const total     = Math.round(overviewKpis.totalToday * trendMul);
  const completed = Math.round(overviewKpis.completedToday * trendMul);
  const hours     = Math.round(overviewKpis.hoursSaved * trendMul);

  const subtitle =
    role === 'dean'      ? t('page.overview.sub.dean')  :
    role === 'supervisor'? t('page.overview.sub.sup')   :
                           t('page.overview.sub.staff');

  const tooltipStyle = { borderRadius: 12, border: '1px solid var(--tooltip-bd)', background: 'var(--tooltip-bg)', fontSize: 12, color: 'rgb(var(--ink))' };
  const axisColor = 'rgb(var(--ink-muted))';
  const gridColor = 'var(--chart-grid)';

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title={t('page.overview.title')}
        subtitle={subtitle}
        actions={
          <>
            <Button variant="secondary" onClick={() => toast(t('cta.export.queued'), 'success')}>
              {t('btn.export.report')}
            </Button>
            <Button variant="primary" onClick={() => navigate('/requests')}>
              {t('btn.allRequests')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.totalToday')} value={total.toLocaleString('en-US')}     trend={+12} accent="primary" icon={<Inbox className="w-5 h-5" />}        hint={t('kpi.compareHint')} />
        <KpiCard label={t('kpi.completed')}  value={completed.toLocaleString('en-US')} trend={+9}  accent="success" icon={<CheckCircle2 className="w-5 h-5" />} />
        <KpiCard label={t('kpi.pending')}    value={overviewKpis.pending}              trend={-4}  accent="primary" icon={<Clock className="w-5 h-5" />} />
        <KpiCard label={t('kpi.slaAtRisk')}  value={overviewKpis.slaAtRisk}            trend={+2}  accent="warning" icon={<AlertTriangle className="w-5 h-5" />} />
        <KpiCard label={t('kpi.avgCompletion')}    value={overviewKpis.avgCompletionMin} unit={t('kpi.unit.minutes')} trend={-7} accent="teal"    icon={<Timer className="w-5 h-5" />} />
        <KpiCard label={t('kpi.automationRate')}   value={overviewKpis.automationRate}   unit="%"                     trend={+5} accent="success" icon={<Bot className="w-5 h-5" />} />
        <KpiCard label={t('kpi.hoursSaved')}        value={hours}                          unit={t('kpi.unit.hours')}    trend={+18} accent="purple"  icon={<Activity className="w-5 h-5" />} />
        <KpiCard label={t('kpi.supportAlerts')}     value={overviewKpis.supportAlerts}     trend={+3}                              accent="privacy" icon={<HeartHandshake className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2" padding="md">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
            <h3 className="font-semibold text-ink">{t('card.requestsTrend')}</h3>
            <div className="flex items-center gap-3 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" />{t('card.legend.total')}</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-teal" />{t('card.legend.automated')}</span>
            </div>
          </div>
          <div className="h-56 sm:h-64 mt-3">
            <ResponsiveContainer>
              <AreaChart data={requestVolume} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#2F5BFF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2F5BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#007C8A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#007C8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="h" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} reversed={isRTL} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="requests"  stroke="#2F5BFF" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="automated" stroke="#007C8A" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-1">{t('card.automationMix')}</h3>
          <p className="text-xs text-ink-muted mb-3">{t('card.automationMix.sub')}</p>
          <div className="h-44 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={automationDonut} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
                  {automationDonut.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold num text-ink">{automationDonut[0].value}%</div>
              <div className="text-[11px] text-ink-muted">{t('mix.fully')}</div>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {automationDonut.map((d) => (
              <div key={d.name} className="flex items-center text-xs">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                <span className="ms-2 text-ink-muted flex-1">{loc(d.nameAr, d.nameEn)}</span>
                <span className="num font-medium text-ink">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-ink">{t('card.topServices')}</h3>
            <Link to="/analytics" className="text-xs text-primary-700 dark:text-primary hover:underline">{t('btn.viewAnalytics')}</Link>
          </div>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={topServices} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} orientation="bottom" />
                <YAxis dataKey={isRTL ? 'nameAr' : 'nameEn'} type="category" width={120} tick={{ fontSize: 12, fill: 'rgb(var(--ink))' }} axisLine={false} tickLine={false} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#2F5BFF" radius={isRTL ? [0, 8, 8, 0] : [0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-3">{t('card.sla')}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink-muted">{t('sla.compliant')}</span>
                <span className="num font-semibold text-success">{slaCompliance.compliant}%</span>
              </div>
              <div className="h-2 bg-success/10 rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${slaCompliance.compliant}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink-muted">{t('sla.atRisk')}</span>
                <span className="num font-semibold text-warning">{slaCompliance.atRisk}%</span>
              </div>
              <div className="h-2 bg-warning/10 rounded-full overflow-hidden">
                <div className="h-full bg-warning" style={{ width: `${slaCompliance.atRisk * 6}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink-muted">{t('sla.breached')}</span>
                <span className="num font-semibold text-danger">{slaCompliance.breached}%</span>
              </div>
              <div className="h-2 bg-danger/10 rounded-full overflow-hidden">
                <div className="h-full bg-danger" style={{ width: `${slaCompliance.breached * 14}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border-soft">
            <div className="text-xs text-ink-muted mb-2">{t('card.tierLegend')}</div>
            <div className="flex flex-wrap gap-2">
              <AiTierBadge tier="green" />
              <AiTierBadge tier="yellow" />
              <AiTierBadge tier="red" />
              <AiTierBadge tier="black" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-ink">{t('card.alertsNeedAction')}</h3>
            <Link to="/alerts" className="text-xs text-primary-700 dark:text-primary hover:underline">{t('btn.viewAll')}</Link>
          </div>
          <ul className="space-y-2.5">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => navigate(a.relatedRequest ? `/requests?id=${a.relatedRequest}` : '/alerts')}
                  className="w-full text-start flex items-start gap-3 p-3 rounded-xl border border-border-soft hover:bg-surface-2/60 transition"
                >
                  <span className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                    a.severity === 'critical' ? 'bg-danger' :
                    a.severity === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink truncate">{loc(a.titleAr, a.titleEn)}</div>
                    <div className="text-xs text-ink-muted mt-0.5 leading-relaxed line-clamp-1">{loc(a.detailAr, a.detailEn)}</div>
                  </div>
                  <div className="text-[11px] text-ink-muted whitespace-nowrap num">
                    {a.openedMinAgo > 60
                      ? `${Math.round(a.openedMinAgo / 60)}${t('common.unit.h')}`
                      : `${a.openedMinAgo}${t('common.unit.m')}`}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-ink">{t('card.studentSupport')}</h3>
              <p className="text-xs text-ink-muted mt-0.5">{role === 'dean' ? t('card.studentSupport.sub.dean') : t('card.studentSupport.sub')}</p>
            </div>
            <Link to="/support" className="text-xs text-primary-700 dark:text-primary hover:underline">{t('btn.viewAll')}</Link>
          </div>
          <ul className="space-y-2.5">
            {supportCases.slice(0, 4).map((s) => {
              const sigKey = `common.signal.${s.signalKey}` as const;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => navigate('/support')}
                    className="w-full text-start flex items-center gap-3 p-3 rounded-xl border border-border-soft hover:bg-surface-2/60 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-privacy/10 text-privacy flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-ink truncate">{t(sigKey)}</div>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {role === 'dean' ? loc(s.collegeAr, s.collegeEn) : `${loc(s.collegeAr, s.collegeEn)} · ${s.studentMaskedId}`}
                      </div>
                    </div>
                    <div className="text-[11px] text-ink-muted">{loc(s.advisorAr, s.advisorEn)}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
