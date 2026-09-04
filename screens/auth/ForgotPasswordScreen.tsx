import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Icon } from '../../components/icons/Icons';
import { Input } from '../../components/Input';
import { BodyText, Heading } from '../../components/Typography';
import type { AuthStackParamList } from '../../navigation/types';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { c } from '../../tokens/theme';
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
  const dispatch = useAppDispatch();
  const forgotPasswordStatus = useAppSelector(state => state.auth.forgotPasswordStatus);
  const forgotPasswordError = useAppSelector(state => state.auth.forgotPasswordError);
  // Set right before dispatching forgotPasswordRequested, cleared once that
  // dispatch's outcome has been handled below — mirrors EmailFormScreen's
  // pendingAuthRef, since the dispatch is fire-and-forget and the saga does
  // the actual POST /auth/forgot-password. The response never echoes the
  // email back (it's always { ok: true }), so this also carries the
  // normalized address forward to ResetLinkSent on success.
  const pendingRef = useRef(false);
  const pendingEmailRef = useRef('');

  useEffect(() => {
    if (!pendingRef.current || forgotPasswordStatus === 'loading') return;
    pendingRef.current = false;
    setSubmitting(false);
    if (forgotPasswordStatus === 'error') {
      setBanner(forgotPasswordError ?? 'Something went wrong. Please try again.');
    } else if (forgotPasswordStatus === 'success') {
      navigation.navigate('ResetLinkSent', { email: pendingEmailRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPasswordStatus]);

  function handleChange(value: string) {
    setEmail(value);
    if (banner) setBanner(null);
    if (error) setError(isValidEmail(value) ? undefined : error);
  }

  function handleSubmit() {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(undefined);
    setBanner(null);
    const normalized = email.trim().toLowerCase();
    pendingEmailRef.current = normalized;
    pendingRef.current = true;
    setSubmitting(true);
    // Never reveal whether the address has an account — same response either way.
    dispatch(authActions.forgotPasswordRequested({ email: normalized }));
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
      <View className="gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-soft">
          <Icon name="shield" size={28} color={c.brandPrimary} />
        </View>
        <View className="gap-2">
          <Heading level="h1">Reset your password</Heading>
          <BodyText className="text-text-muted">
            Tell us the email you signed up with and we'll send you a link to set a new password.
          </BodyText>
        </View>
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
