import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Building2, Map as MapIcon,
  Clock, FileText, X,
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface NavItem {
  to: string;
  ar: string;
  en: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  end?: boolean;
  /** Tailwind text color used for the icon (against the dark sidebar). */
  accent: string;
}

const items: NavItem[] = [
  { to: '/home',      ar: 'الرئيسية',          en: 'Welcome',         icon: LayoutDashboard, end: true, accent: 'text-primary' },
  { to: '/assistant', ar: 'المساعد الذكي',     en: 'AI Assistant',    icon: Sparkles,                accent: 'text-warning' },
  { to: '/services',  ar: 'دليل الخدمات',      en: 'Services',        icon: Building2,       badge: 8, accent: 'text-teal' },
  { to: '/map/student-affairs', ar: 'خريطة الحرم', en: 'Campus Map',  icon: MapIcon,                 accent: 'text-success' },
  { to: '/queue',     ar: 'حالة الانتظار',     en: 'Queue Status',    icon: Clock,                   accent: 'text-warning' },
  { to: '/start-request/graduation', ar: 'طلبات الوثائق', en: 'Document Requests', icon: FileText, badge: 2, accent: 'text-privacy' },
];

interface Props {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: Props) {
  const { sidebarCollapsed, lang, isRTL, setMobileSidebarOpen } = useApp();
  const collapsed = mobile ? false : sidebarCollapsed;
  const width = collapsed ? 'w-[112px]' : 'w-[320px]';
  const accentSide = isRTL ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full';

  // Hide on mobile (when not in mobile-overlay mode). On md+ render as a flex column.
  const visibility = mobile ? 'flex' : 'hidden md:flex';
  // Floating panel: rounded corners + soft shadow. Outer layout owns spacing.
  const shape = mobile ? '' : 'rounded-3xl shadow-2xl';

  return (
    <aside
      style={{ backgroundColor: '#0B1220' }}
      className={`${visibility} ${shape} shrink-0 overflow-hidden text-white flex-col transition-[width] duration-200 ease-out ${width}`}
    >
      {/* Brand */}
      <div className="px-6 py-7 border-b border-black flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-lg shadow-primary/30">
          B
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-lg leading-tight truncate text-slate-300">
              BrightEdu × KAU
            </div>
            <div className="text-sm text-slate-500 leading-tight truncate">
              {lang === 'ar' ? 'لوحة الحرم الذكية' : 'Smart Campus Board'}
            </div>
          </div>
        )}
        {mobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="w-12 h-12 rounded-xl hover:bg-sidebar-hover flex items-center justify-center text-sidebar-text"
            aria-label="close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map(({ to, ar, en, icon: Icon, badge, end, accent }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            title={collapsed ? (lang === 'ar' ? ar : en) : undefined}
            className={({ isActive }) =>
              `relative flex items-center ${collapsed ? 'justify-center' : ''} gap-4 px-4 py-4 rounded-2xl text-base transition ${
                isActive
                  ? 'bg-sidebar-active text-slate-200 font-semibold shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className={`absolute ${accentSide} top-3 bottom-3 w-1 bg-primary`} aria-hidden />
                )}
                <Icon className={`w-7 h-7 shrink-0 ${isActive ? 'text-slate-200' : 'text-slate-400'}`} strokeWidth={2} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-start truncate text-base">
                      {lang === 'ar' ? ar : en}
                    </span>
                    {badge != null && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold num min-w-[28px] text-center ${
                          isActive ? 'bg-primary text-white' : 'bg-white/10 text-sidebar-text'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && badge != null && (
                  <span className="absolute top-1.5 end-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-sidebar" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer hint */}
      {!collapsed && (
        <div className="p-4 border-t border-black">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-privacy/15 p-4 border border-black">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="text-base font-semibold text-slate-300">
                {lang === 'ar' ? 'مساعد ذكي' : 'AI Assistant'}
              </div>
            </div>
            <div className="text-sm text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'يجيب عن الأسئلة العامة ويحوّل الخاصة لجوالك بأمان.'
                : 'Answers public questions and hands off private ones to your phone safely.'}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
