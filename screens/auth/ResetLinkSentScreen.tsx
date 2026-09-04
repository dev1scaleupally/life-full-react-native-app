import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import type { AuthStackParamList } from '../../navigation/types';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BodyText } from '../../components/Typography';
import { WaitingScreen } from './WaitingScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetLinkSent'>;

const RESEND_SECONDS = 42;

export function ResetLinkSentScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const { remaining, restart, isDone } = useCountdown(RESEND_SECONDS);
  const dispatch = useAppDispatch();
  const forgotPasswordStatus = useAppSelector(state => state.auth.forgotPasswordStatus);
  const forgotPasswordError = useAppSelector(state => state.auth.forgotPasswordError);
  // Mirrors EmailVerifyScreen's pendingResendRef — the dispatch is
  // fire-and-forget, the saga does the actual POST /auth/forgot-password.
  const pendingResendRef = useRef(false);

  useEffect(() => {
    if (!pendingResendRef.current || forgotPasswordStatus === 'loading') return;
    pendingResendRef.current = false;
    if (forgotPasswordStatus === 'error') {
      setBanner(forgotPasswordError ?? 'Something went wrong. Please try again.');
    } else if (forgotPasswordStatus === 'success') {
      setConfirmation('New link sent. It may take a minute to arrive.');
      restart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPasswordStatus]);

  function handleResend() {
    setBanner(null);
    setConfirmation(null);
    pendingResendRef.current = true;
    dispatch(authActions.forgotPasswordRequested({ email }));
  }

  return (
    <WaitingScreen
      onBack={() => navigation.goBack()}
      icon="mail"
      headline="Check your email"
      body={
        <BodyText className="text-center">
          If an account exists for{' '}
          <BodyText className="font-sans-bold text-text-heading">{email}</BodyText>, a link to set
          a new password is on its way. It works for one hour.
        </BodyText>
      }
      ctaLabel={
        forgotPasswordStatus === 'loading'
          ? 'Sending…'
          : isDone
            ? 'Resend the link'
            : `Resend the link in ${remaining}s`
      }
      ctaDisabled={!isDone || forgotPasswordStatus === 'loading'}
      onPressCta={handleResend}
      confirmation={confirmation}
      error={banner}
      hint="Nothing yet? Check your spam folder — the sender is hello@joinlifefull.com."
    />
  );
}
