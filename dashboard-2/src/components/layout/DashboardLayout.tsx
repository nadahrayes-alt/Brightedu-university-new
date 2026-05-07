import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../lib/AppContext';
import { InactivityWatcher } from '../../lib/SessionContext';

export function DashboardLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  return (
    <div className="flex h-screen w-screen bg-surface-2 p-4 gap-4 overflow-hidden">
      <InactivityWatcher />

      {/* Desktop sidebar — handles its own md:flex visibility */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            aria-label="close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative ms-auto h-full">
            <Sidebar mobile onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main floating panel */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 rounded-3xl bg-canvas shadow-xl border border-border-soft">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
