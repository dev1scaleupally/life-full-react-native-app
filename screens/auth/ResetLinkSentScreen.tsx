import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import type { AuthStackParamList } from '../../navigation/types';
import { requestPasswordReset } from '../../services/auth/authService';
import { BodyText } from '../../components/Typography';
import { WaitingScreen } from './WaitingScreen';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetLinkSent'>;

const RESEND_SECONDS = 42;

export function ResetLinkSentScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const { remaining, restart, isDone } = useCountdown(RESEND_SECONDS);

  async function handleResend() {
    await requestPasswordReset(email);
    setConfirmation('New link sent. It may take a minute to arrive.');
    restart();
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
      ctaLabel={isDone ? 'Resend the link' : `Resend the link in ${remaining}s`}
      ctaDisabled={!isDone}
      onPressCta={handleResend}
      confirmation={confirmation}
    />
  );
}
