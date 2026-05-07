import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, CheckSquare, HeartHandshake, Sparkles,
  BarChart3, Bell, Users2, FileText, Settings, X,
} from 'lucide-react';
import { useApp } from '../../context';
import type { DictKey } from '../../i18n';

interface NavItem { to: string; key: DictKey; icon: typeof LayoutDashboard; badge?: number }

const items: NavItem[] = [
  { to: '/',             key: 'nav.overview',     icon: LayoutDashboard },
  { to: '/requests',     key: 'nav.requests',     icon: Inbox,          badge: 216 },
  { to: '/approvals',    key: 'nav.approvals',    icon: CheckSquare,    badge: 18 },
  { to: '/support',      key: 'nav.support',      icon: HeartHandshake },
  { to: '/top-students', key: 'nav.topStudents',  icon: Sparkles },
  { to: '/analytics',    key: 'nav.analytics',    icon: BarChart3 },
  { to: '/alerts',       key: 'nav.alerts',       icon: Bell,           badge: 5 },
  { to: '/staff',        key: 'nav.staff',        icon: Users2 },
  { to: '/reports',      key: 'nav.reports',      icon: FileText },
  { to: '/settings',     key: 'nav.settings',     icon: Settings },
];

interface Props {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: Props) {
  const { sidebarCollapsed, t, isRTL, setMobileSidebarOpen } = useApp();
  const collapsed = mobile ? false : sidebarCollapsed;
  const width = collapsed ? 'w-[72px]' : 'w-64';
  const accentSide = isRTL ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full';

  return (
    <aside
      className={`shrink-0 bg-sidebar text-white flex flex-col h-full transition-[width] duration-200 ease-out ${width}`}
    >
      {/* Brand */}
      <div className="px-4 py-5 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center font-bold shrink-0">
          B
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-semibold leading-tight truncate">{t('brand.name')}</div>
            <div className="text-[11px] text-sidebar-text-muted leading-tight truncate">
              {t('brand.tagline')}
            </div>
          </div>
        )}
        {mobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-sidebar-hover flex items-center justify-center text-sidebar-text"
            aria-label="close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map(({ to, key, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            title={collapsed ? t(key) : undefined}
            className={({ isActive }) =>
              `relative flex items-center ${collapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? 'bg-sidebar-active text-white font-medium'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className={`absolute ${accentSide} top-2 bottom-2 w-[3px] bg-primary`} aria-hidden />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-start truncate">{t(key)}</span>
                    {badge != null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium num ${
                          isActive ? 'bg-primary text-white' : 'bg-white/10 text-sidebar-text'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && badge != null && (
                  <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-primary ring-2 ring-sidebar" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer hint */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="rounded-xl bg-white/5 p-3 border border-sidebar-border">
            <div className="text-xs font-medium text-white">{t('brand.aiHint.title')}</div>
            <div className="text-[11px] text-sidebar-text-muted mt-1 leading-relaxed">
              {t('brand.aiHint.body')}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
