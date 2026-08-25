import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Icon } from '../../components/icons/Icons';
import { Mark } from '../../components/Mark';
import { Band, Col } from '../../components/ReadingColumn';
import { BodyText, Heading } from '../../components/Typography';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthResolution } from '../../navigation/AuthResolutionContext';
import { signInWithApple } from '../../services/auth/appleAuth';
import { upsertOAuthAccount } from '../../services/auth/authService';
import { isUserCancelledGoogleSignIn, signInWithGoogle } from '../../services/auth/googleAuth';
import { authActions } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { layout } from '../../tokens/theme';
import { AuthBanner } from './AuthBanner';

type Props = NativeStackScreenProps<AuthStackParamList, 'AccountGate'>;

export function AccountGateScreen({ route, navigation }: Props) {
  const [mode, setMode] = useState<'signup' | 'signin'>(route.params?.mode ?? 'signup');
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthBusy, setOauthBusy] = useState<'google' | 'apple' | null>(null);
  const resolveAuth = useAuthResolution();
  const dispatch = useAppDispatch();
  // Shared with EmailFormScreen's real auth dispatches — one submit flow per
  // screen instance either way, so there's never a mix-up.
  const authStatus = useAppSelector(state => state.auth.status);
  const authError = useAppSelector(state => state.auth.error);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.userId);
  const emailVerified = useAppSelector(state => state.auth.emailVerified);
  const isSignup = mode === 'signup';
  const verb = isSignup ? 'Continue' : 'Sign in';
  // Set right before dispatching googleLoginRequested, cleared once that
  // dispatch's outcome has been handled below — carries the real
  // name/email Google's own sign-in sheet returned (the backend's session
  // response doesn't echo them back, same gap as email/password sign-in).
  const pendingGoogleRef = useRef<{ email: string; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    if (!pendingGoogleRef.current || authStatus === 'loading') return;
    const profile = pendingGoogleRef.current;
    pendingGoogleRef.current = null;
    setOauthBusy(null);
    if (authStatus === 'error') {
      console.error('[AccountGateScreen] google login API error:', authError);
      setOauthError(authError ?? "We couldn't complete Google sign-in. Try again, or use email instead.");
      return;
    }
    if (isAuthenticated && userId) {
      resolveAuth({
        id: userId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        emailVerified: emailVerified ?? true,
        subscriptionStatus: 'never_subscribed',
        provider: 'google',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

  async function handleOAuth(provider: 'google' | 'apple') {
    setOauthError(null);
    setOauthBusy(provider);

    if (provider === 'google') {
      try {
        const profile = await signInWithGoogle();
        if (!profile) {
          setOauthBusy(null);
          return; // user backed out of the native sheet — not an error
        }
        // Resolved by the effect above, once authStatus leaves 'loading' —
        // dispatch is fire-and-forget, the saga does the actual POST /auth/google.
        pendingGoogleRef.current = {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        };
        dispatch(authActions.googleLoginRequested({ idToken: profile.idToken }));
      } catch (err) {
        setOauthBusy(null);
        if (isUserCancelledGoogleSignIn(err)) return;
        const message = err instanceof Error ? err.message : '';
        setOauthError(
          message.includes('not configured yet')
            ? message
            : "We couldn't complete Google sign-in. Try again, or use email instead.",
        );
      }
      return;
    }

    // Apple: still on the mock backend (services/auth/authService) — not yet
    // switched over to authActions.appleLoginRequested.
    try {
      const profile = await signInWithApple();
      if (!profile) return; // user backed out of the native sheet — not an error
      const result = await upsertOAuthAccount({ provider, ...profile });
      if (result.ok) {
        resolveAuth(result.account);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setOauthError(
        message.includes('not configured yet')
          ? message
          : "We couldn't complete Apple sign-in. Try again, or use email instead.",
      );
    } finally {
      setOauthBusy(null);
    }
  }

  return (
    <View className="flex-1 bg-[#fff]">
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 ">
        <Band className="flex-1 bg-[#f5eadd]">
          <Col className="flex-1 items-center pb-6 pt-[84px]">
            <View className="items-center gap-4">
              <Mark height={42} />
              <Heading level="h1" className="text-center">
                {isSignup ? 'Join Lifefull' : 'Welcome back'}
              </Heading>
              <BodyText size="lg" className="max-w-[320px] text-center text-text-body">
                {isSignup
                  ? 'Create an account to save your starting point and pick up where you left off.'
                  : 'Sign in to pick up where you left off.'}
              </BodyText>
            </View>

            {oauthError ? (
              <View className="mt-7 w-full">
                <AuthBanner variant="danger">{oauthError}</AuthBanner>
              </View>
            ) : null}

            <View className="mt-7 w-full gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-[1.5px] bg-[#fff] shadow-xs"
                leftIcon={<Icon name="google" size={18} />}
                loading={oauthBusy === 'google'}
                disabled={oauthBusy !== null}
                onPress={() => handleOAuth('google')}
              >
                {`${verb} with Google`}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-[1.5px] bg-[#fff] shadow-xs"
                leftIcon={<Icon name="apple" size={18} />}
                loading={oauthBusy === 'apple'}
                disabled={oauthBusy !== null}
                onPress={() => handleOAuth('apple')}
              >
                {`${verb} with Apple`}
              </Button>

              <View className="flex-row items-center gap-3 py-1">
                <View className="h-px flex-1 bg-border-subtle" />
                <BodyText size="sm" className="font-sans-bold text-text-subtle">
                  or
                </BodyText>
                <View className="h-px flex-1 bg-border-subtle" />
              </View>

              <Button
                variant="secondary"
                size="lg"
                className="w-full border-[1.5px] bg-[#fff] shadow-xs"
                leftIcon={<Icon name="mail" size={18} />}
                disabled={oauthBusy !== null}
                onPress={() => navigation.navigate('EmailForm', { mode })}
              >
                {`${verb} with email`}
              </Button>
            </View>

            <Pressable
              accessibilityRole="link"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => setMode(isSignup ? 'signin' : 'signup')}
              style={{ minHeight: layout.tapMin, justifyContent: 'center', marginTop: 22 }}
            >
              <BodyText className="text-center text-text-muted">
                {isSignup ? 'Already with us? ' : 'New to Lifefull? '}
                <Text className="font-sans-bold text-brand-ink">
                  {isSignup ? 'Sign in' : 'Create account'}
                </Text>
              </BodyText>
            </Pressable>
          </Col>
        </Band>

        <Band className="border-t border-border-subtle bg-surface-card pt-[14px] px-8">
          <Col className="pb-4">
            <BodyText size="caption" className="text-center text-text-subtle">
              By {isSignup ? 'creating an account' : 'signing in'}, you agree to our{' '}
              <BodyText size="caption" className="text-brand-ink underline">
                {'Terms of Use'}
              </BodyText>{' '}
              and{' '}
              <BodyText size="caption" className="text-brand-ink underline">
                {'Privacy Policy'}
              </BodyText>
              .
            </BodyText>
          </Col>
        </Band>
      </SafeAreaView>
    </View>
  );
}
