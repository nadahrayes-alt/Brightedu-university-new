import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../context';

export function DashboardLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useApp();

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Desktop sidebar (≥md) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

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

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
