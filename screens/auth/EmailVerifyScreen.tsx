import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import type { AuthStackParamList } from '../../navigation/types';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BodyText } from '../../components/Typography';
import { WaitingScreen } from './WaitingScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailVerify'>;

const RESEND_SECONDS = 42;

export function EmailVerifyScreen({ route, navigation }: Props) {
  const { email, expired: initialExpired } = route.params;
  const [expired, setExpired] = useState(!!initialExpired);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const { remaining, restart, isDone } = useCountdown(RESEND_SECONDS);
  const dispatch = useAppDispatch();
  const resendStatus = useAppSelector(state => state.auth.resendVerificationStatus);
  const resendError = useAppSelector(state => state.auth.resendVerificationError);
  // Set right before dispatching resendVerificationRequested, cleared once
  // that dispatch's outcome has been handled below — mirrors
  // EmailFormScreen's pendingRegisterRef, since the dispatch is
  // fire-and-forget and the saga does the actual POST /auth/resend-verification.
  const pendingResendRef = useRef(false);

  useEffect(() => {
    if (!pendingResendRef.current || resendStatus === 'loading') return;
    pendingResendRef.current = false;
    if (resendStatus === 'error') {
      console.error('[EmailVerifyScreen] resend-verification API error:', resendError);
      setBanner(resendError ?? 'Something went wrong. Please try again.');
    } else if (resendStatus === 'success') {
      setExpired(false);
      setConfirmation('New link sent. It may take a minute to arrive.');
      restart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resendStatus]);

  function handleResend() {
    setBanner(null);
    setConfirmation(null);
    pendingResendRef.current = true;
    dispatch(authActions.resendVerificationRequested({ email }));
  }

  // DEV-ONLY: there's no way yet to click through a real inbox during local
  // testing, so fake that click after a short wait instead of blocking the
  // flow on it. Fires from any "waiting on the real link" moment (initial
  // signup, or after a resend) and takes the exact same success path
  // deepLinks.ts takes for a real verify-email link. Never runs in a release
  // build, and skipped entirely once the link has actually expired.
  useEffect(() => {
    if (!__DEV__ || expired) return;
    const timer = setTimeout(() => {
      console.log('[EmailVerifyScreen] DEV auto-verify firing for', email);
      dispatch(authActions.verifyEmailSucceeded());
      navigation.navigate('EmailForm', { mode: 'signin', email, verifiedBanner: true });
    }, 15000);
    return () => clearTimeout(timer);
  }, [expired, email, navigation, dispatch]);

  return (
    <WaitingScreen
      onBack={() => navigation.goBack()}
      icon={expired ? 'alert' : 'mail'}
      headline={expired ? 'That link has expired' : 'Confirm your email'}
      body={
        expired ? (
          <BodyText className="text-center">
            Verification links last 24 hours. Send a fresh one to{' '}
            <BodyText className="font-sans-bold text-text-heading">{email}</BodyText> and tap it to
            finish setting up.
          </BodyText>
        ) : (
          <BodyText className="text-center">
            We sent a link to{' '}
            <BodyText className="font-sans-bold text-text-heading">{email}</BodyText>. Tap it and
            this app will pick up where you left off.
          </BodyText>
        )
      }
      ctaLabel={
        resendStatus === 'loading'
          ? 'Sending…'
          : expired
            ? 'Send a new link'
            : isDone
              ? 'Resend the link'
              : `Resend the link in ${remaining}s`
      }
      ctaDisabled={(!expired && !isDone) || resendStatus === 'loading'}
      onPressCta={handleResend}
      confirmation={confirmation}
      error={banner}
      hint="Nothing yet? Check your spam folder — the sender is hello@joinlifefull.com."
      onUseDifferentEmail={() => navigation.replace('EmailForm', { mode: 'signup', email })}
    />
  );
}
