import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Attract } from './pages/Attract';
import { Welcome } from './pages/Welcome';
import { LangModal } from './pages/LangModal';
import { Assistant } from './pages/Assistant';
import { AssistantAnswer } from './pages/AssistantAnswer';
import { QuickActions } from './pages/QuickActions';
import { ServicesDirectory } from './pages/ServicesDirectory';
import { ServiceDetail } from './pages/ServiceDetail';
import { MapScreen } from './pages/MapScreen';
import { Queue } from './pages/Queue';
import { Hours } from './pages/Hours';
import { StartRequest } from './pages/StartRequest';
import { GraduationFlow } from './pages/GraduationFlow';
import { EnrollmentFlow } from './pages/EnrollmentFlow';
import { Verify } from './pages/Verify';
import { QRContinuation } from './pages/QRContinuation';
import { QRSuccess } from './pages/QRSuccess';
import { QRExpired } from './pages/QRExpired';
import { Refusal } from './pages/Refusal';
import { RoomAvailability } from './pages/RoomAvailability';
import { TodaysEvents } from './pages/TodaysEvents';
import { ErrorScreen } from './pages/ErrorScreen';
import { SessionEnded } from './pages/SessionEnded';
import { TimeoutModal } from './components/board/TimeoutModal';

function TimeoutPage() {
  return (
    <>
      <Welcome />
      <TimeoutModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* S00 · Attract / Touch-to-Start (kiosk idle screen, no chrome) */}
        <Route index element={<Attract />} />

        <Route element={<DashboardLayout />}>
          {/* S01 · Welcome (board home, entered after touching the attract screen) */}
          <Route path="/home" element={<Welcome />} />

          {/* S02 · Language modal */}
          <Route path="/lang" element={<LangModal />} />

          {/* S03 · Assistant empty */}
          <Route path="/assistant" element={<Assistant />} />

          {/* S04 · Assistant Q+A */}
          <Route path="/assistant/answer/:id" element={<AssistantAnswer />} />

          {/* S05 · Quick actions grid */}
          <Route path="/quick-actions" element={<QuickActions />} />

          {/* S06 · Services directory */}
          <Route path="/services" element={<ServicesDirectory />} />

          {/* S07 · Service detail */}
          <Route path="/service/:id" element={<ServiceDetail />} />

          {/* S08 / S09 · Map (accessibility toggled inside) */}
          <Route path="/map/:id" element={<MapScreen />} />

          {/* S10 · Queue */}
          <Route path="/queue" element={<Queue />} />

          {/* S11 · Hours */}
          <Route path="/hours/:id" element={<Hours />} />

          {/* Graduation cert flow — multi-step (yellow tier with staff approval) */}
          <Route path="/request/graduation" element={<GraduationFlow />} />

          {/* Enrollment letter flow — green tier (auto-issued after verification, scenario #005) */}
          <Route path="/request/enrollment" element={<EnrollmentFlow />} />

          {/* S12 · Start request (generic; legacy /start-request/graduation, /enrollment routes for back-compat) */}
          <Route path="/start-request/graduation" element={<GraduationFlow />} />
          <Route path="/start-request/enrollment" element={<EnrollmentFlow />} />
          <Route path="/start-request/:kind" element={<StartRequest />} />

          {/* Universal ID-verification gate. Every private-flow CTA must route
              through here before reaching the QR continuation screen. */}
          <Route path="/verify" element={<Verify />} />

          {/* S13 · QR continuation */}
          <Route path="/qr" element={<QRContinuation />} />

          {/* S14 · QR scanned success */}
          <Route path="/qr/success" element={<QRSuccess />} />

          {/* S15 · QR expired */}
          <Route path="/qr/expired" element={<QRExpired />} />

          {/* Public-safe room availability (Scenario #054 — parallel to "Reserve a hall"). */}
          <Route path="/rooms/availability" element={<RoomAvailability />} />

          {/* Public-safe today's events list (Scenario #053 — Event FAQ Bot). */}
          <Route path="/events/today" element={<TodaysEvents />} />

          {/* S16 · Sensitive data refusal */}
          <Route path="/refusal" element={<Refusal />} />

          {/* S17 · Error / Service unavailable */}
          <Route path="/error" element={<ErrorScreen />} />

          {/* S18 · Timeout modal over a stable backdrop */}
          <Route path="/timeout" element={<TimeoutPage />} />

          {/* S19 · Session ended */}
          <Route path="/ended" element={<SessionEnded />} />

        </Route>

        {/* Catch-all → Attract (kiosk reset) */}
        <Route path="*" element={<Attract />} />
      </Routes>
    </AppProvider>
  );
}
