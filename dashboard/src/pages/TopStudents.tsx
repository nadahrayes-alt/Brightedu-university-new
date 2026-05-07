import { useState } from 'react';
import { Sparkles, Award, FileDown, Send, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { topStudents, topStudentsKpis, topByCollege, type TopStudent } from '../data/mockData';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useApp, useT, useLoc, useToast } from '../context';
import type { DictKey } from '../i18n';

export function TopStudents() {
  const { role, lang } = useApp();
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const [reviewing, setReviewing] = useState<TopStudent | null>(null);

  const statusKey: Record<TopStudent['status'], { lblKey: DictKey; cls: string }> = {
    pending_review:  { lblKey: 'top.statusPendingReview', cls: 'bg-warning/10 text-warning' },
    approved:        { lblKey: 'top.statusApproved',      cls: 'bg-success/10 text-success' },
    message_drafted: { lblKey: 'top.statusDrafted',       cls: 'bg-primary/10 text-primary-700 dark:text-primary' },
    sent:            { lblKey: 'top.statusSent',          cls: 'bg-teal/10 text-teal' },
  };

  const tooltipStyle = { borderRadius: 12, border: '1px solid var(--tooltip-bd)', background: 'var(--tooltip-bg)', fontSize: 12, color: 'rgb(var(--ink))' };
  const axisColor = 'rgb(var(--ink-muted))';

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
      <PageHeader
        title={t('page.topStudents.title')}
        subtitle={t('page.topStudents.sub')}
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<FileDown className="w-4 h-4" />}
              onClick={() => toast(t('cta.export.done'), 'success')}
            >
              {t('btn.exportApproved')}
            </Button>
            <Button
              variant="primary"
              iconStart={<Send className="w-4 h-4" />}
              onClick={() => toast(t('cta.campaignLaunched'), 'success')}
            >
              {t('btn.sendCampaign')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.top500')}            value={topStudentsKpis.identified}        accent="primary" icon={<Award className="w-5 h-5" />} />
        <KpiCard label={t('kpi.candidates')}        value={topStudentsKpis.candidates}        accent="success" icon={<Sparkles className="w-5 h-5" />} />
        <KpiCard label={t('kpi.pendingApprovals')}  value={topStudentsKpis.pendingApprovals}  accent="warning" />
        <KpiCard label={t('kpi.draftedMessages')}   value={topStudentsKpis.messagesDrafted}   accent="teal" />
        <KpiCard label={t('kpi.campaignsSent')}     value={topStudentsKpis.campaignsSent}     accent="purple" trend={+1} hint={t('kpi.semesterHint')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-ink mb-3">{t('top.byCollege')}</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topByCollege} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey={lang === 'en' ? 'collegeEn' : 'collegeAr'} tick={{ fontSize: 11, fill: axisColor }} interval={0} angle={-15} dy={10} height={60} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#5D4FBE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-ink">{t('top.flow')}</h3>
          </div>
          <ul className="space-y-3 mt-3">
            {[
              { lbl: 'top.flow.identify' as DictKey, state: 'completed',   count: 86 },
              { lbl: 'top.flow.approve'  as DictKey, state: 'in_progress', count: 24 },
              { lbl: 'top.flow.draft'    as DictKey, state: 'in_progress', count: 120 },
              { lbl: 'top.flow.launch'   as DictKey, state: 'pending',     count: 0 },
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  step.state === 'completed' ? 'bg-success/15 text-success' :
                  step.state === 'in_progress' ? 'bg-primary/15 text-primary-700 dark:text-primary' :
                  'bg-surface-2 text-ink-muted'
                }`}>
                  {step.state === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{t(step.lbl)}</div>
                  <div className="text-xs text-ink-muted num">{step.count} {t('top.flow.itemsUnit')}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card padding="sm">
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-ink">{t('top.candidates.title')}</h3>
          {role === 'dean' && (
            <div className="text-xs text-ink-muted">{t('top.dean.note')}</div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-y border-border-soft text-ink-muted">
              <tr className="text-start">
                <th className="px-4 py-2.5 font-medium text-start">{t('col.student')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.college')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.excellence')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.activityHrs')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.volunteerHrs')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.rewardEligible')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.status')}</th>
                <th className="px-4 py-2.5 font-medium text-start"></th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((s) => (
                <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-2/40">
                  <td className="px-4 py-3 num text-xs text-ink-muted whitespace-nowrap">{s.maskedId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{loc(s.collegeAr, s.collegeEn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${s.excellence}%` }} />
                      </div>
                      <span className="num text-xs text-ink-muted">{s.excellence}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 num">{s.activityHours}</td>
                  <td className="px-4 py-3 num">{s.volunteeringHours}</td>
                  <td className="px-4 py-3">
                    {s.rewardEligible ? (
                      <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success whitespace-nowrap">{t('top.eligible')}</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-md bg-surface-2 text-ink-muted whitespace-nowrap">{t('top.underReview')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ${statusKey[s.status].cls}`}>
                      {t(statusKey[s.status].lblKey)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Button size="sm" variant="secondary" onClick={() => setReviewing(s)}>{t('btn.review')}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        title={t('top.review.title')}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReviewing(null)}>{t('btn.cancel')}</Button>
            <Button
              variant="primary"
              iconStart={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => { toast(t('toast.recognitionApproved'), 'success'); setReviewing(null); }}
            >
              {t('btn.approveRecognition')}
            </Button>
          </>
        }
      >
        {reviewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-canvas p-3 border border-border-soft">
                <div className="text-xs text-ink-muted">{t('col.college')}</div>
                <div className="font-medium mt-1 text-ink">{loc(reviewing.collegeAr, reviewing.collegeEn)}</div>
              </div>
              <div className="rounded-xl bg-canvas p-3 border border-border-soft">
                <div className="text-xs text-ink-muted">{t('top.review.excellence')}</div>
                <div className="font-medium mt-1 num text-ink">{reviewing.excellence}</div>
              </div>
              <div className="rounded-xl bg-canvas p-3 border border-border-soft">
                <div className="text-xs text-ink-muted">{t('top.review.activity')}</div>
                <div className="font-medium mt-1 num text-ink">{reviewing.activityHours}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2 text-ink">{t('top.review.draft')}</div>
              <textarea
                rows={6}
                defaultValue={`عزيزي/عزيزتي،\nيسعدنا تتويج جهودك الأكاديمية وتميّزك في الأنشطة والتطوّع.\nسيتم إدراج اسمك ضمن قائمة المتميّزين لهذا الفصل، وسنبلّغك بتفاصيل الحفل في رسالة لاحقة.\nتقديرنا واحترامنا.\n— عمادة شؤون الطلبة`}
                className="w-full bg-surface-2 border border-border-soft rounded-xl p-3 text-sm focus:outline-none focus:shadow-focus leading-7 text-ink"
              />
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
