import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BodyText, Heading } from '../../components/Typography';
import type { AuthStackParamList } from '../../navigation/types';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { isValidPassword, MIN_PASSWORD_LENGTH } from '../../utils/validators';
import { AuthBanner } from './AuthBanner';
import { AuthShell } from './AuthShell';
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewPassword'>;

type Errors = { password?: string; confirmPassword?: string };

export function NewPasswordScreen({ route, navigation }: Props) {
  const { token } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const resetPasswordStatus = useAppSelector(state => state.auth.resetPasswordStatus);
  const resetPasswordError = useAppSelector(state => state.auth.resetPasswordError);
  const resetPasswordEmail = useAppSelector(state => state.auth.resetPasswordEmail);
  const resetPasswordExpiredEmail = useAppSelector(state => state.auth.resetPasswordExpiredEmail);
  // Mirrors EmailFormScreen's pendingAuthRef — dispatch is fire-and-forget,
  // the saga does the actual POST /auth/reset-password.
  const pendingRef = useRef(false);

  function validate(pw: string, confirm: string): Errors {
    const next: Errors = {};
    if (!pw) next.password = 'Enter a new password.';
    else if (!isValidPassword(pw)) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!confirm) next.confirmPassword = 'Confirm your new password.';
    else if (confirm !== pw) next.confirmPassword = "Passwords don't match.";
    return next;
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (submittedOnce) setErrors(validate(value, confirmPassword));
  }

  function handleConfirmChange(value: string) {
    setConfirmPassword(value);
    if (submittedOnce) setErrors(validate(password, value));
  }

  useEffect(() => {
    if (!pendingRef.current || resetPasswordStatus === 'loading') return;
    pendingRef.current = false;
    setSubmitting(false);
    if (resetPasswordStatus === 'error') {
      if (resetPasswordExpiredEmail) {
        // 410 — route back to ForgotPassword with the email prefilled and
        // the expired banner, same shape as EmailVerifyScreen's 410 case.
        navigation.replace('ForgotPassword', { email: resetPasswordExpiredEmail, expiredError: true });
      } else {
        console.error('[NewPasswordScreen] reset-password API error:', resetPasswordError);
        setBanner(resetPasswordError ?? "That link isn't valid anymore. Request a new one from the sign-in screen.");
      }
    } else if (resetPasswordStatus === 'success' && resetPasswordEmail) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'EmailForm', params: { mode: 'signin', email: resetPasswordEmail, resetBanner: true } }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetPasswordStatus]);

  function handleSubmit() {
    const nextErrors = validate(password, confirmPassword);
    setErrors(nextErrors);
    setSubmittedOnce(true);
    if (nextErrors.password || nextErrors.confirmPassword) return;

    setSubmitting(true);
    pendingRef.current = true;
    dispatch(authActions.resetPasswordRequested({ token, password }));
  }

  const isComplete = password.length > 0 && confirmPassword.length > 0;

  return (
    <AuthShell
      footer={
        <Button size="lg" disabled={!isComplete || submitting} loading={submitting} onPress={handleSubmit}>
          Save new password
        </Button>
      }
    >
      <View className="gap-2">
        <Heading level="h1">Set a new password</Heading>
        <BodyText className="text-text-muted">
          Choose something you'll remember. You'll use it next time you sign in.
        </BodyText>
      </View>

      {banner ? <AuthBanner variant="danger">{banner}</AuthBanner> : null}

      <View className="gap-4">
        <Input
          label="New password"
          value={password}
          onChangeText={handlePasswordChange}
          error={errors.password}
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          rightElement={
            <PasswordVisibilityToggle shown={showPassword} onToggle={() => setShowPassword(s => !s)} />
          }
        />
        <Input
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={handleConfirmChange}
          error={errors.confirmPassword}
          secureTextEntry={!showConfirm}
          textContentType="newPassword"
          rightElement={
            <PasswordVisibilityToggle shown={showConfirm} onToggle={() => setShowConfirm(s => !s)} />
          }
        />
      </View>
    </AuthShell>
  );
}
