import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BodyText, Heading } from '../../components/Typography';
import { STORAGE_KEYS } from '../../constants/storage';
import { useAuthResolution } from '../../navigation/AuthResolutionContext';
import type { AuthStackParamList } from '../../navigation/types';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } from '../../utils/validators';
import { AuthBanner } from './AuthBanner';
import { AuthShell } from './AuthShell';
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle';
import { PressableLink } from './PressableLink';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailForm'>;

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldKey = keyof Fields;

const SIGNUP_KEYS: FieldKey[] = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
const SIGNIN_KEYS: FieldKey[] = ['email', 'password'];

export function EmailFormScreen({ route, navigation }: Props) {
  const { mode, email: emailParam, verifiedBanner, resetBanner } = route.params;
  const isSignup = mode === 'signup';
  const relevantKeys = isSignup ? SIGNUP_KEYS : SIGNIN_KEYS;

  const [fields, setFields] = useState<Fields>({
    firstName: '',
    lastName: '',
    email: emailParam ?? '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPrefillHint, setShowPrefillHint] = useState(false);
  const [firstNameEdited, setFirstNameEdited] = useState(false);
  const resolveAuth = useAuthResolution();
  const dispatch = useAppDispatch();
  // Shared by both registerRequested and loginRequested — one submit flow
  // per screen instance, so there's never a mix-up between the two.
  const authStatus = useAppSelector(state => state.auth.status);
  const authError = useAppSelector(state => state.auth.error);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.userId);
  const emailVerified = useAppSelector(state => state.auth.emailVerified);
  // Set right before dispatching registerRequested/loginRequested, cleared
  // once that dispatch's outcome (success or error) has been handled below —
  // this is what tells the effect a status change actually belongs to
  // *this* screen's submit, not e.g. the app-launch session refresh.
  const pendingAuthRef = useRef(false);

  // First name pre-fills from the onboarding flow's answers, but only while
  // it hasn't been touched — the hint disappears the moment the user edits it.
  useEffect(() => {
    if (!isSignup) return;
    AsyncStorage.getItem(STORAGE_KEYS.onboardingName).then(stored => {
      if (stored && stored.trim().length > 0) {
        setFields(f => (f.firstName ? f : { ...f, firstName: stored }));
        setShowPrefillHint(true);
      }
    });
    // Only ever runs once per mount — this screen doesn't remount on mode toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validateField(key: FieldKey, value: string, all: Fields): string | undefined {
    switch (key) {
      case 'firstName':
        return isSignup && !value.trim() ? 'Enter your first name.' : undefined;
      case 'lastName':
        return isSignup && !value.trim() ? 'Enter your last name.' : undefined;
      case 'email':
        if (!value.trim()) return 'Enter your email address.';
        return isValidEmail(value) ? undefined : 'Enter a valid email address.';
      case 'password':
        if (!value) return 'Enter your password.';
        return isSignup && !isValidPassword(value)
          ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined;
      case 'confirmPassword':
        if (!isSignup) return undefined;
        if (!value) return 'Confirm your password.';
        return value !== all.password ? "Passwords don't match." : undefined;
    }
  }

  // registerRequested/loginRequested's reducer flips status to 'loading'
  // synchronously on dispatch, so by the time this effect sees anything
  // other than 'loading' the saga has actually finished — no race with a
  // stale status left over from a previous (unrelated) auth action.
  useEffect(() => {
    if (!pendingAuthRef.current || authStatus === 'loading') return;
    pendingAuthRef.current = false;
    setSubmitting(false);
    if (authStatus === 'error') {
      console.error(`[EmailFormScreen] ${isSignup ? 'register' : 'login'} API error:`, authError);
      setBanner(authError ?? 'Something went wrong. Please try again.');
    } else if (isAuthenticated && userId) {
      if (isSignup && !emailVerified) {
        // A fresh signup: the session exists (isAuthenticated is real — the
        // backend never blocks *sign-in* on verification) but the user
        // hasn't confirmed their address yet, so route to the waiting
        // screen instead of straight into the app. Verifying signs them out
        // of this interstitial (deepLinks.ts sends them to EmailForm's
        // sign-in mode, not resolveAuth) — they resolve for real on that
        // next, deliberate sign-in.
        navigation.navigate('EmailVerify', { email: fields.email });
        return;
      }
      // Sign-in (or a signup that already came back verified) resolves
      // immediately — the backend never blocks *sign-in* on verification.
      // There's no GET /me yet, so most of AuthAccount is best-effort: real
      // for signup (the user just typed it), blank for sign-in.
      resolveAuth({
        id: userId,
        email: fields.email,
        firstName: isSignup ? fields.firstName : '',
        lastName: isSignup ? fields.lastName : '',
        emailVerified: emailVerified ?? false,
        subscriptionStatus: 'never_subscribed',
        provider: 'email',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  function handleChange(key: FieldKey, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (key === 'firstName') setFirstNameEdited(true);

    if (!submittedOnce) return;
    setErrors(e => {
      const updated = { ...e, [key]: validateField(key, value, next) };
      // Editing the password also affects whether confirmPassword still matches.
      if (key === 'password' && isSignup) {
        updated.confirmPassword = validateField('confirmPassword', next.confirmPassword, next);
      }
      return updated;
    });
  }

  function handleSubmit() {
    setBanner(null);
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const key of relevantKeys) {
      nextErrors[key] = validateField(key, fields[key], fields);
    }
    setErrors(nextErrors);
    setSubmittedOnce(true);
    if (relevantKeys.some(key => nextErrors[key])) return;

    // Resolved by the effect above, once authStatus leaves 'loading' —
    // dispatch is fire-and-forget, the saga does the actual POST request.
    setSubmitting(true);
    pendingAuthRef.current = true;
    if (isSignup) {
      dispatch(
        authActions.registerRequested({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          password: fields.password,
        }),
      );
    } else {
      dispatch(authActions.loginRequested({ email: fields.email, password: fields.password }));
    }
  }

  const isComplete = relevantKeys.every(key => fields[key].trim().length > 0);

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <View className="gap-3">
          <Button size="lg" disabled={!isComplete || submitting} loading={submitting} onPress={handleSubmit}>
            {isSignup ? 'Create account' : 'Sign in'}
          </Button>
          {isSignup ? (
            <BodyText size="caption" className="text-center">
              By creating an account, you agree to our{' '}
              <BodyText size="caption" className="text-text-link">
                {'Terms of Use'}
              </BodyText>{' '}
              and{' '}
              <BodyText size="caption" className="text-text-link">
                {'Privacy Policy'}
              </BodyText>
              .
            </BodyText>
          ) : null}
        </View>
      }
    >
      <View className="gap-2">
        <Heading level="h1">{isSignup ? 'Create your account' : 'Sign in with email'}</Heading>
        <BodyText className="text-text-muted">
          {isSignup ? "A few details and you're in." : 'Enter the email and password you signed up with.'}
        </BodyText>
      </View>

      {banner ? (
        <AuthBanner variant="danger">{banner}</AuthBanner>
      ) : verifiedBanner ? (
        <AuthBanner variant="success">
          Your email is verified. Sign in to pick up where you left off.
        </AuthBanner>
      ) : resetBanner ? (
        <AuthBanner variant="success">Your password is updated. Sign in with the new one.</AuthBanner>
      ) : null}

      <View className="gap-4">
        {isSignup ? (
          <View>
            <Input
              label="First name"
              value={fields.firstName}
              onChangeText={v => handleChange('firstName', v)}
              error={errors.firstName}
              autoCapitalize="words"
              textContentType="givenName"
            />
            {showPrefillHint && !firstNameEdited ? (
              <BodyText size="caption" className="mt-1.5">
                From your answers a moment ago — change it if you like.
              </BodyText>
            ) : null}
          </View>
        ) : null}

        {isSignup ? (
          <Input
            label="Last name"
            value={fields.lastName}
            onChangeText={v => handleChange('lastName', v)}
            error={errors.lastName}
            autoCapitalize="words"
            textContentType="familyName"
          />
        ) : null}

        <Input
          label="Email"
          value={fields.email}
          onChangeText={v => handleChange('email', v)}
          error={errors.email}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <View>
          <Input
            label="Password"
            value={fields.password}
            onChangeText={v => handleChange('password', v)}
            error={errors.password}
            secureTextEntry={!showPassword}
            textContentType={isSignup ? 'newPassword' : 'password'}
            rightElement={
              <PasswordVisibilityToggle shown={showPassword} onToggle={() => setShowPassword(s => !s)} />
            }
          />
          {!isSignup ? (
            <View className="mt-1.5 items-end">
              <PressableLink
                onPress={() => navigation.navigate('ForgotPassword', { email: fields.email })}
                label="Forgot password?"
              />
            </View>
          ) : null}
        </View>

        {isSignup ? (
          <Input
            label="Confirm password"
            value={fields.confirmPassword}
            onChangeText={v => handleChange('confirmPassword', v)}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirm}
            textContentType="newPassword"
            rightElement={
              <PasswordVisibilityToggle shown={showConfirm} onToggle={() => setShowConfirm(s => !s)} />
            }
          />
        ) : null}
      </View>
    </AuthShell>
  );
}
