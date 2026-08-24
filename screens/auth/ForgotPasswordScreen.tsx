import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BodyText, Heading } from '../../components/Typography';
import type { AuthStackParamList } from '../../navigation/types';
import { requestPasswordReset } from '../../services/auth/authService';
import { isValidEmail } from '../../utils/validators';
import { AuthBanner } from './AuthBanner';
import { AuthShell } from './AuthShell';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ route, navigation }: Props) {
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [error, setError] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | null>(
    route.params?.expiredError ? 'That link has expired. Send another one below.' : null,
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(value: string) {
    setEmail(value);
    if (banner) setBanner(null);
    if (error) setError(isValidEmail(value) ? undefined : error);
  }

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const normalized = email.trim().toLowerCase();
      await requestPasswordReset(normalized);
      // Never reveal whether the address has an account — same response either way.
      navigation.navigate('ResetLinkSent', { email: normalized });
    } finally {
      setSubmitting(false);
    }
  }

  const isComplete = email.trim().length > 0;

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <Button size="lg" disabled={!isComplete || submitting} loading={submitting} onPress={handleSubmit}>
          Send reset link
        </Button>
      }
    >
      <View className="gap-2">
        <Heading level="h1">Reset your password</Heading>
        <BodyText className="text-text-muted">
          Tell us the email you signed up with and we'll send you a link to set a new password.
        </BodyText>
      </View>

      {banner ? <AuthBanner variant="danger">{banner}</AuthBanner> : null}

      <View>
        <Input
          label="Email"
          value={email}
          onChangeText={handleChange}
          error={error}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <BodyText size="caption" className="mt-1.5">
          If you signed in with Google or Apple, there's no Lifefull password — go back and use
          that button instead.
        </BodyText>
      </View>
    </AuthShell>
  );
}
