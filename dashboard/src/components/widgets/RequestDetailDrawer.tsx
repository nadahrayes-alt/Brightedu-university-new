import { useState } from 'react';
import { X, FileText, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquareText, Send } from 'lucide-react';
import type { RequestRow } from '../../data/mockData';
import { AiTierBadge, ChannelBadge, PriorityBadge, SlaTimer, StatusChip, AccessBadge } from '../ui/Badges';
import { Button } from '../ui/Button';
import { AiSummaryPanel } from './AiSummaryPanel';
import { RulesChecklist } from './RulesChecklist';
import { AuditTrail } from './AuditTrail';
import { Modal } from '../ui/Modal';
import { useApp, useT, useLoc, useToast } from '../../context';

interface Props {
  request: RequestRow | null;
  onClose: () => void;
}

export function RequestDetailDrawer({ request, onClose }: Props) {
  const { role, isRTL } = useApp();
  const t = useT();
  const loc = useLoc();
  const pushToast = useToast();
  const [confirm, setConfirm] = useState<null | 'approve' | 'escalate' | 'request_info' | 'reject'>(null);
  const [escalationReason, setEscalationReason] = useState('');

  if (!request) return null;

  const isBlackTier = request.tier === 'black';
  const showStudentDetails = role === 'staff' && !isBlackTier;
  const isLeadership = role === 'dean';

  const handleConfirm = () => {
    const map: Record<string, { msg: string; kind: 'success' | 'info' | 'warning' | 'error' }> = {
      approve:      { msg: t('toast.approved'),      kind: 'success' },
      escalate:     { msg: t('toast.escalated'),     kind: 'warning' },
      request_info: { msg: t('toast.requestedInfo'), kind: 'info' },
      reject:       { msg: t('toast.rejected'),      kind: 'error' },
    };
    const action = map[confirm!];
    pushToast(action.msg, action.kind);
    setConfirm(null);
    onClose();
  };

  // Drawer slides from start side; in RTL that's the left edge (since sidebar is on right)
  // Actually for an inbox, drawer should slide in from the start of reading direction.
  // In RTL: left edge. In LTR: right edge.
  const drawerSide = isRTL ? 'left-0' : 'right-0';

  return (
    <>
      <div className="fixed inset-0 z-40">
        <button
          aria-label="close"
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <aside className={`absolute top-0 ${drawerSide} h-full w-full max-w-[640px] bg-canvas border-s border-border-soft overflow-y-auto`}>
          <div className="sticky top-0 z-10 bg-surface border-b border-border-soft px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-ink-muted num">{request.id}</span>
                <span className="text-ink-muted">·</span>
                <ChannelBadge ch={request.channel} />
              </div>
              <h2 className="text-lg font-semibold text-ink leading-tight mt-1 truncate">
                {loc(request.serviceAr, request.service)}
              </h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-surface-2 flex items-center justify-center text-ink-muted shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-surface border-b border-border-soft flex items-center gap-2 flex-wrap">
            <AiTierBadge tier={request.tier} />
            <StatusChip status={request.status} />
            <PriorityBadge p={request.priority} />
            <SlaTimer minutes={request.slaMinutesLeft} />
            {isBlackTier && <AccessBadge labelKey="access.restrictedRole" />}
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {isLeadership && (
              <div className="rounded-xl bg-privacy/5 border border-privacy/20 p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-privacy shrink-0 mt-0.5" />
                <div className="text-sm text-ink">
                  <div className="font-semibold text-privacy mb-0.5">{t('drawer.leadershipBanner.title')}</div>
                  <div className="text-ink-muted text-xs leading-relaxed">{t('drawer.leadershipBanner.body')}</div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border-soft bg-surface p-5">
              <div className="text-xs text-ink-muted mb-2">{t('drawer.studentSection')}</div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium text-ink">
                    {showStudentDetails && request.studentName
                      ? loc(request.studentName, request.studentNameEn)
                      : <>—<span className="text-ink-muted text-sm font-normal ms-2">{t('drawer.maskedNote')}</span></>}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5 num">{request.studentMaskedId}</div>
                </div>
                <div className="text-xs text-ink-muted">
                  <span>{loc(request.collegeAr, request.college)}</span>
                </div>
              </div>
            </div>

            {!isLeadership && <AiSummaryPanel summary={loc(request.aiSummaryAr, request.aiSummaryEn)} />}
            {!isLeadership && <RulesChecklist rules={request.rules} />}

            {request.evidence && request.evidence.length > 0 && !isLeadership && (
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <div className="text-sm font-semibold text-ink mb-3">{t('drawer.evidence')}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {request.evidence.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-2 border border-border-soft text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="truncate">{loc(e.nameAr, e.name)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLeadership && (
              <div className="rounded-2xl border border-border-soft bg-surface p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareText className="w-4 h-4 text-teal" />
                  <div className="text-sm font-semibold text-ink">{t('drawer.notifPreview')}</div>
                </div>
                <div className="text-sm text-ink leading-7 bg-canvas rounded-xl p-3 border border-border-soft">
                  {loc(request.notificationPreviewAr, request.notificationPreviewEn)}
                </div>
              </div>
            )}

            <AuditTrail entries={request.audit} />
          </div>

          {!isLeadership && (
            <div className="sticky bottom-0 bg-surface border-t border-border-soft px-4 sm:px-6 py-4 flex items-center gap-2 flex-wrap">
              <Button
                variant="success"
                iconStart={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => setConfirm('approve')}
                disabled={request.tier === 'red' && !request.rules.every((r) => r.passed)}
              >
                {t('btn.approve')}
              </Button>
              <Button variant="secondary" onClick={() => setConfirm('request_info')}>{t('btn.requestInfo')}</Button>
              <Button variant="privacy" iconStart={<AlertTriangle className="w-4 h-4" />} onClick={() => setConfirm('escalate')}>
                {t('btn.escalate')}
              </Button>
              <Button variant="ghost" onClick={() => setConfirm('reject')}>{t('btn.reject')}</Button>
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={confirm === 'approve'}
        onClose={() => setConfirm(null)}
        title={t('modal.approve.title')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>{t('btn.cancel')}</Button>
            <Button variant="success" iconStart={<CheckCircle2 className="w-4 h-4" />} onClick={handleConfirm}>
              {t('btn.confirmApprove')}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm leading-7">
          <p>{t('modal.approve.body')} <span className="num font-semibold">{request.id}</span>.</p>
          <div className="rounded-xl bg-canvas p-3 border border-border-soft text-xs text-ink-muted">
            {t('modal.approve.audit')}
          </div>
        </div>
      </Modal>

      <Modal
        open={confirm === 'escalate'}
        onClose={() => setConfirm(null)}
        title={t('modal.escalate.title')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>{t('btn.cancel')}</Button>
            <Button variant="privacy" iconStart={<Send className="w-4 h-4" />} onClick={handleConfirm} disabled={!escalationReason.trim()}>
              {t('btn.escalate')}
            </Button>
          </>
        }
      >
        <label className="text-sm font-medium text-ink mb-2 block">{t('modal.escalate.reason')}</label>
        <textarea
          value={escalationReason}
          onChange={(e) => setEscalationReason(e.target.value)}
          rows={4}
          className="w-full bg-surface-2 border border-border-soft rounded-xl p-3 text-sm focus:outline-none focus:shadow-focus text-ink"
          placeholder={t('modal.escalate.ph')}
        />
      </Modal>

      <Modal
        open={confirm === 'request_info'}
        onClose={() => setConfirm(null)}
        title={t('modal.requestInfo.title')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>{t('btn.cancel')}</Button>
            <Button variant="primary" iconStart={<Send className="w-4 h-4" />} onClick={handleConfirm}>{t('btn.send')}</Button>
          </>
        }
      >
        <p className="text-sm leading-7 mb-3">{t('modal.requestInfo.body')}</p>
        <textarea
          rows={4}
          defaultValue=""
          placeholder="…"
          className="w-full bg-surface-2 border border-border-soft rounded-xl p-3 text-sm focus:outline-none focus:shadow-focus text-ink"
        />
      </Modal>

      <Modal
        open={confirm === 'reject'}
        onClose={() => setConfirm(null)}
        title={t('modal.reject.title')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>{t('btn.cancel')}</Button>
            <Button variant="danger" onClick={handleConfirm}>{t('btn.confirmReject')}</Button>
          </>
        }
      >
        <p className="text-sm leading-7 mb-3">{t('modal.reject.body')}</p>
        <textarea
          rows={4}
          className="w-full bg-surface-2 border border-border-soft rounded-xl p-3 text-sm focus:outline-none focus:shadow-focus text-ink"
          placeholder={t('modal.reject.ph')}
        />
      </Modal>

    </>
  );
}
