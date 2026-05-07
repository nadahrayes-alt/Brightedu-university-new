import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { InactivityWatcher } from '../../lib/SessionContext';

/**
 * Public Wayfinding Kiosk layout — portrait orientation.
 * No sidebar (the sidebar made the product feel like a desktop dashboard).
 * Top bar carries brand + clock + language toggle; the bottom nav is the
 * primary navigation, sized for touch (≥ 80×80 per item).
 */
export function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-canvas overflow-hidden">
      <InactivityWatcher />
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
