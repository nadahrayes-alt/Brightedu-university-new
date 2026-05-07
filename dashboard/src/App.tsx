import { Routes, Route } from 'react-router-dom';
import { AppProvider, useT } from './context';
import { AuthProvider } from './auth';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastContainer } from './components/ui/ToastContainer';
import { RequireAuth, RedirectIfAuthed } from './components/RequireAuth';
import { Overview } from './pages/Overview';
import { Requests } from './pages/Requests';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { StudentSupport } from './pages/StudentSupport';
import { TopStudents } from './pages/TopStudents';
import { ServiceAnalytics } from './pages/ServiceAnalytics';
import { Alerts } from './pages/Alerts';
import { StaffWorkload } from './pages/StaffWorkload';
import { Stub } from './pages/Stub';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';

function ReportsStub() {
  const t = useT();
  return <Stub title={t('nav.reports')} subtitle={t('stub.body')} />;
}
function SettingsStub() {
  const t = useT();
  return <Stub title={t('nav.settings')} subtitle={t('stub.body')} />;
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"           element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
          <Route path="/signup"          element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />
          <Route path="/forgot-password" element={<RedirectIfAuthed><ForgotPassword /></RedirectIfAuthed>} />

          {/* Protected app routes */}
          <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="/requests"     element={<Requests />} />
            <Route path="/approvals"    element={<ApprovalQueue />} />
            <Route path="/support"      element={<StudentSupport />} />
            <Route path="/top-students" element={<TopStudents />} />
            <Route path="/analytics"    element={<ServiceAnalytics />} />
            <Route path="/alerts"       element={<Alerts />} />
            <Route path="/staff"        element={<StaffWorkload />} />
            <Route path="/reports"      element={<ReportsStub />} />
            <Route path="/settings"     element={<SettingsStub />} />
          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </AppProvider>
  );
}
