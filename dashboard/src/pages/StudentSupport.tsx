import { useState } from 'react';
import {
  HeartHandshake, Send, Calendar, UserCheck, MessageSquareText,
  Activity, TrendingDown, Sparkles, BookOpen, Coffee,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard } from '../components/ui/KpiCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { supportCases, supportKpis, type SupportCase } from '../data/mockData';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp, useT, useLoc, useToast } from '../context';

const signalIcon: Record<SupportCase['signalKey'], typeof Activity> = {
  engagement: Activity,
  absence:    Coffee,
  late:       Calendar,
  sudden:     TrendingDown,
};

export function StudentSupport() {
  const { role } = useApp();
  const t = useT();
  const loc = useLoc();
  const toast = useToast();
  const [draftFor, setDraftFor] = useState<SupportCase | null>(null);

  const statusKey: Record<SupportCase['status'], { lblKey: 'support.statusOpen' | 'support.statusReviewed' | 'support.statusScheduled' | 'support.statusClosed'; cls: string }> = {
    open:      { lblKey: 'support.statusOpen',      cls: 'bg-primary/10 text-primary-700 dark:text-primary' },
    reviewed:  { lblKey: 'support.statusReviewed',  cls: 'bg-success/10 text-success' },
    scheduled: { lblKey: 'support.statusScheduled', cls: 'bg-teal/10 text-teal' },
    closed:    { lblKey: 'support.statusClosed',    cls: 'bg-surface-2 text-ink-muted' },
  };

  const tooltipStyle = { borderRadius: 8, border: '1px solid var(--tooltip-bd)', background: 'var(--tooltip-bg)', fontSize: 11, color: 'rgb(var(--ink))' };

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto">
      <PageHeader title={t('page.support.title')} subtitle={t('page.support.sub')} />

      <div className="rounded-2xl bg-privacy/5 border border-privacy/15 p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-privacy/10 text-privacy flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="text-sm leading-7">
          <div className="font-semibold text-privacy">{t('support.tone.title')}</div>
          <div className="text-ink-muted text-xs leading-relaxed">{t('support.tone.body')}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label={t('kpi.needsFollowUp')}  value={supportKpis.needsFollowUp}        accent="privacy" icon={<HeartHandshake className="w-5 h-5" />} />
        <KpiCard label={t('kpi.advisorReviews')} value={supportKpis.advisorReviewsPending} accent="primary" icon={<UserCheck className="w-5 h-5" />} />
        <KpiCard label={t('kpi.followUpsDone')}   value={supportKpis.followUpsCompleted}    accent="success" trend={+12} />
        <KpiCard label={t('kpi.referrals')}       value={supportKpis.referralsSuggested}    accent="teal"    icon={<BookOpen className="w-5 h-5" />} />
      </div>

      <Card padding="sm" className="mb-6 overflow-hidden">
        <div className="px-3 py-3 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-ink">{t('support.cases.title')}</h3>
          <div className="text-xs text-ink-muted">
            {role === 'dean' ? t('support.dean.note') : t('support.maskedDefault')}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas border-y border-border-soft text-ink-muted">
              <tr className="text-start">
                <th className="px-4 py-2.5 font-medium text-start">{t('col.student')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.college')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.signal')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.trend6w')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.suggestedAction')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.advisor')}</th>
                <th className="px-4 py-2.5 font-medium text-start">{t('col.status')}</th>
                <th className="px-4 py-2.5 font-medium text-start"></th>
              </tr>
            </thead>
            <tbody>
              {supportCases.map((s) => {
                const Icon = signalIcon[s.signalKey];
                const data = s.weeks.map((v, i) => ({ w: `W${i + 1}`, v }));
                const trendCls = s.trendDir === 'down' ? 'text-warning' : s.trendDir === 'up' ? 'text-success' : 'text-ink-muted';
                const sk = statusKey[s.status];
                return (
                  <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3 num text-xs text-ink-muted whitespace-nowrap">{s.studentMaskedId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{loc(s.collegeAr, s.collegeEn)}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 ${trendCls} whitespace-nowrap`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{t(`common.signal.${s.signalKey}` as const)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="h-8 w-28">
                        <ResponsiveContainer>
                          <LineChart data={data}>
                            <Line type="monotone" dataKey="v" stroke="#6D5DF6" strokeWidth={2} dot={false} />
                            <XAxis dataKey="w" hide />
                            <YAxis hide />
                            <Tooltip formatter={(v: number) => `${v}`} contentStyle={tooltipStyle} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted">{loc(s.suggestedActionAr, s.suggestedActionEn)}</td>
                    <td className="px-4 py-3 text-xs">{loc(s.advisorAr, s.advisorEn)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ${sk.cls}`}>{t(sk.lblKey)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button size="sm" variant="secondary" iconStart={<MessageSquareText className="w-4 h-4" />} onClick={() => setDraftFor(s)}>
                        {t('btn.draftSupport')}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-ink">{t('support.recommend.title')}</h3>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed mb-3">{t('support.recommend.body')}</p>
          <ul className="space-y-2 text-sm">
            {[
              { ar: 'ورشة تنظيم وقت الامتحانات', en: 'Exam time-management workshop' },
              { ar: 'دعوة لجلسة دعم نفسي اختيارية', en: 'Optional counseling session invite' },
              { ar: 'موعد مراجعة فردية لخطة الفصل', en: '1:1 term-plan review' },
            ].map((it, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-ink">{loc(it.ar, it.en)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-2">{t('support.advisorWorkload')}</h3>
          <ul className="space-y-3 text-sm">
            {[
              { ar: 'ليلى م.', en: 'Layla M.', cases: 18, util: 78 },
              { ar: 'سعد ح.',  en: 'Saad H.',  cases: 12, util: 56 },
              { ar: 'منى ع.',  en: 'Mona A.',  cases: 9,  util: 42 },
            ].map((a, i) => (
              <li key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink">{loc(a.ar, a.en)}</span>
                  <span className="text-ink-muted num">{a.cases}</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div className="h-full bg-privacy" style={{ width: `${a.util}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink mb-2">{t('support.weeklyStory')}</h3>
          <p className="text-sm leading-7 text-ink">
            <span className="num font-semibold">27</span> · <span className="num font-semibold">14</span> · <span className="num font-semibold">3</span>
            <br />
            <span className="text-ink-muted text-xs">{t('support.weeklyBody')}</span>
          </p>
        </Card>
      </div>

      <Modal
        open={!!draftFor}
        onClose={() => setDraftFor(null)}
        title={t('support.draft.title')}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraftFor(null)}>{t('btn.cancel')}</Button>
            <Button variant="secondary" onClick={() => { toast(t('cta.draftSaved'), 'info'); setDraftFor(null); }}>
              {t('btn.saveDraft')}
            </Button>
            <Button
              variant="primary"
              iconStart={<Send className="w-4 h-4" />}
              onClick={() => { toast(t('toast.supportSent'), 'success'); setDraftFor(null); }}
            >
              {t('btn.sendViaAdvisor')}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-primary-700 dark:text-primary leading-relaxed">
            {t('support.draft.note')}: <strong>{draftFor && t(`common.signal.${draftFor.signalKey}` as const)}</strong>
          </div>
          <textarea
            rows={8}
            defaultValue={`مرحبًا،\nلاحظنا أنه قد يكون من المفيد جدولة لقاء قصير معك هذا الأسبوع لمراجعة جدول الفصل ومناقشة أي ملاحظات. الموعد اختياري ولا يؤثر على شيء أكاديميًا.\nنحن هنا للمساعدة عندما تحتاجين.\n— المرشد الأكاديمي`}
            className="w-full bg-surface-2 border border-border-soft rounded-xl p-3 text-sm focus:outline-none focus:shadow-focus leading-7 text-ink"
          />
        </div>
      </Modal>

    </div>
  );
}
