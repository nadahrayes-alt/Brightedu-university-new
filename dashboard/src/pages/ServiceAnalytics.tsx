import { Fragment } from 'react';
import { Bot, FileText, QrCode, Smartphone, Activity } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Card } from '../components/ui/Card';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line,
  LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  channelMix, peakHeat, requestVolume, topServices, docVolume, automationOverWeeks,
} from '../data/mockData';
import { useApp, useT } from '../context';

export function ServiceAnalytics() {
  const t = useT();
  const { lang, isRTL } = useApp();
  const max = Math.max(...peakHeat.data.map((d) => d.v));

  const tooltipStyle = { borderRadius: 12, border: '1px solid var(--tooltip-bd)', background: 'var(--tooltip-bg)', fontSize: 12, color: 'rgb(var(--ink))' };
  const axisColor = 'rgb(var(--ink-muted))';
  const gridColor = 'var(--chart-grid)';

  const days = lang === 'en' ? peakHeat.daysEn : peakHeat.daysAr;
  const dayKeyOf = (idx: number) => peakHeat.daysAr[idx]; // data key remains Arabic

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      <PageHeader title={t('page.analytics.title')} subtitle={t('page.analytics.sub')} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.kioskSessions')} value={4820} accent="primary" icon={<Activity className="w-5 h-5" />} trend={+8} />
        <KpiCard label={t('kpi.mobileUse')}     value={3120} accent="teal"    icon={<Smartphone className="w-5 h-5" />} trend={+14} />
        <KpiCard label={t('kpi.whatsappSent')}  value={1130} accent="success" trend={+6} />
        <KpiCard label={t('kpi.qrChecks')}      value={2430} accent="purple"  icon={<QrCode className="w-5 h-5" />} trend={+22} />
        <KpiCard label={t('kpi.certsIssued')}   value={612}  accent="primary" icon={<FileText className="w-5 h-5" />} trend={+11} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-ink mb-3">{t('card.volumeAutomation')}</h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer>
              <AreaChart data={requestVolume}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F5BFF" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#2F5BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity={0.30} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="h" tick={{ fontSize: 11, fill: axisColor }} reversed={isRTL} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: axisColor }} />
                <Area name={t('card.legend.total')}     type="monotone" dataKey="requests"  stroke="#2F5BFF" fill="url(#gA)" strokeWidth={2} />
                <Area name={t('card.legend.automated')} type="monotone" dataKey="automated" stroke="#16A34A" fill="url(#gB)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-3">{t('card.channelMix')}</h3>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={channelMix} dataKey="value" nameKey={lang === 'en' ? 'name' : 'nameAr'} innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
                  {channelMix.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {channelMix.map((c) => (
              <div key={c.name} className="flex items-center text-xs">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c.color }} />
                <span className="ms-2 text-ink-muted flex-1">{lang === 'en' ? c.name : c.nameAr}</span>
                <span className="num font-medium text-ink">{c.value.toLocaleString('en-US')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-ink mb-3">{t('card.peak')}</h3>
          <div className="overflow-x-auto">
            <div className="grid gap-1 min-w-[480px]" style={{ gridTemplateColumns: `auto repeat(${peakHeat.hours.length}, minmax(36px, 1fr))` }}>
              <div />
              {peakHeat.hours.map((h) => (
                <div key={h} className="text-[10px] text-ink-muted text-center num">{h}</div>
              ))}
              {days.map((displayName, idx) => {
                const dayKey = dayKeyOf(idx);
                return (
                  <Fragment key={dayKey}>
                    <div className="text-[11px] text-ink-muted self-center">{displayName}</div>
                    {peakHeat.hours.map((h) => {
                      const cell = peakHeat.data.find((x) => x.day === dayKey && x.hour === h)!;
                      const intensity = cell.v / max;
                      return (
                        <div
                          key={`${dayKey}-${h}`}
                          title={`${cell.v}`}
                          className="h-7 rounded-md"
                          style={{ backgroundColor: `rgba(47, 91, 255, ${0.1 + intensity * 0.7})` }}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="text-xs text-ink-muted mt-3 inline-flex items-center gap-2">
            <span>{t('peak.lower')}</span>
            <div className="w-32 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(47,91,255,0.1), rgba(47,91,255,0.8))' }} />
            <span>{t('peak.higher')}</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-success" />
            <h3 className="font-semibold text-ink">{t('card.automationOverWeeks')}</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={automationOverWeeks}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey={lang === 'en' ? 'wEn' : 'wAr'} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} domain={[20, 80]} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <div className="text-[11px] text-ink-muted">{t('autoMet.7wAgo')}</div>
              <div className="font-semibold num text-ink">38%</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-muted">{t('autoMet.now')}</div>
              <div className="font-semibold num text-success">64%</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-muted">{t('autoMet.hoursSaved')}</div>
              <div className="font-semibold num text-ink">126</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-ink mb-3">{t('card.topServices')}</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topServices} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis dataKey={lang === 'en' ? 'nameEn' : 'nameAr'} type="category" width={120} tick={{ fontSize: 12, fill: 'rgb(var(--ink))' }} axisLine={false} tickLine={false} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name={t('card.requestVolumeUnit')} fill="#2F5BFF" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-3">{t('card.docVolume')}</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={docVolume}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey={lang === 'en' ? 'dEn' : 'dAr'} tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} orientation={isRTL ? 'right' : 'left'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: axisColor }} />
                <Bar dataKey="certs" name={t('docVol.certs')} fill="#007C8A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="qr"    name={t('docVol.qr')}    fill="#5D4FBE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
