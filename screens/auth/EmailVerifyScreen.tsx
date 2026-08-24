import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import type { AuthStackParamList } from '../../navigation/types';
import { sendVerificationEmail } from '../../services/auth/authService';
import { BodyText } from '../../components/Typography';
import { WaitingScreen } from './WaitingScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailVerify'>;

const RESEND_SECONDS = 42;

export function EmailVerifyScreen({ route, navigation }: Props) {
  const { email, expired: initialExpired } = route.params;
  const [expired, setExpired] = useState(!!initialExpired);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const { remaining, restart, isDone } = useCountdown(RESEND_SECONDS);

  async function handleResend() {
    await sendVerificationEmail(email);
    setExpired(false);
    setConfirmation('New link sent. It may take a minute to arrive.');
    restart();
  }

  return (
    <WaitingScreen
      onBack={() => navigation.goBack()}
      icon={expired ? 'alert' : 'mail'}
      headline={expired ? 'That link has expired' : 'Confirm your email'}
      body={
        expired ? (
          <BodyText className="text-center">
            Send a new link to{' '}
            <BodyText className="font-sans-bold text-text-heading">{email}</BodyText> to keep going.
          </BodyText>
        ) : (
          <BodyText className="text-center">
            We sent a link to{' '}
            <BodyText className="font-sans-bold text-text-heading">{email}</BodyText>. Tap it and
            this app will pick up where you left off.
          </BodyText>
        )
      }
      ctaLabel={expired ? 'Send a new link' : isDone ? 'Resend the link' : `Resend the link in ${remaining}s`}
      ctaDisabled={!expired && !isDone}
      onPressCta={handleResend}
      confirmation={confirmation}
      hint="Nothing yet? Check your spam folder — the sender is hello@joinlifefull.com."
      onUseDifferentEmail={() => navigation.replace('EmailForm', { mode: 'signup', email })}
    />
  );
}
