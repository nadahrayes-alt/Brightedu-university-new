import type { RequestRow } from '../../data/mockData';
import { AiTierBadge, ChannelBadge, PriorityBadge, SlaTimer, StatusChip } from '../ui/Badges';
import { useApp, useLoc, useT } from '../../context';

interface Props {
  rows: RequestRow[];
  onOpen: (row: RequestRow) => void;
  selectedId?: string;
}

export function RequestTable({ rows, onOpen, selectedId }: Props) {
  const { role } = useApp();
  const t = useT();
  const loc = useLoc();
  return (
    <div className="bg-surface border border-border-soft rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-canvas border-b border-border-soft text-ink-muted">
            <tr className="text-start">
              <th className="px-4 py-3 font-medium text-start">{t('col.id')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.service')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.tier')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.status')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.priority')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.sla')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.assigned')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.channel')}</th>
              <th className="px-4 py-3 font-medium text-start">{t('col.student')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const selected = selectedId === r.id;
              const showName = role === 'staff' && r.studentName && r.tier !== 'black';
              return (
                <tr
                  key={r.id}
                  onClick={() => onOpen(r)}
                  className={`border-b border-border-soft last:border-0 cursor-pointer transition ${
                    selected ? 'bg-primary/5' : 'hover:bg-surface-2/60'
                  }`}
                >
                  <td className="px-4 py-3 font-medium num text-primary-700 dark:text-primary whitespace-nowrap">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink leading-tight">{loc(r.serviceAr, r.service)}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{loc(r.collegeAr, r.college)}</div>
                  </td>
                  <td className="px-4 py-3"><AiTierBadge tier={r.tier} /></td>
                  <td className="px-4 py-3"><StatusChip status={r.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge p={r.priority} /></td>
                  <td className="px-4 py-3"><SlaTimer minutes={r.slaMinutesLeft} /></td>
                  <td className="px-4 py-3 text-ink-muted text-xs whitespace-nowrap">
                    {loc(r.assignedToAr ?? '', r.assignedTo)}
                  </td>
                  <td className="px-4 py-3"><ChannelBadge ch={r.channel} /></td>
                  <td className="px-4 py-3 text-xs text-ink-muted num whitespace-nowrap">
                    {showName
                      ? <span className="text-ink">{loc(r.studentName!, r.studentNameEn)}</span>
                      : r.studentMaskedId}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="px-6 py-12 text-center text-ink-muted text-sm">{t('requests.empty')}</div>
      )}
    </div>
  );
}
