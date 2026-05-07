import { useNavigate, useSearchParams } from 'react-router-dom';
import { StudentIdVerificationStep } from '../components/board/StudentIdVerificationStep';
import { PrivacyBanner } from '../components/board/PrivacyBanner';

/**
 * Universal ID-verification gate. All "Continue via QR" / "أكمل من الجوال"
 * CTAs route here first; only after the masked verification screen does the
 * user reach the QR continuation page.
 */
export function Verify() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/qr';

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 max-w-5xl mx-auto">
        <StudentIdVerificationStep
          onSuccess={() => navigate(next)}
          onBack={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
