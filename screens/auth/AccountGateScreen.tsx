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
  // Set right before dispatching googleLoginRequested/appleLoginRequested,
  // cleared once that dispatch's outcome has been handled below — carries
  // the real name/email the native sign-in sheet returned (the backend's
  // session response doesn't echo them back, same gap as email/password
  // sign-in). One ref for both providers since they share this same effect.
  const pendingOAuthRef = useRef<
    { provider: 'google' | 'apple'; email: string; firstName: string; lastName: string } | null
  >(null);

  useEffect(() => {
    if (!pendingOAuthRef.current || authStatus === 'loading') return;
    const profile = pendingOAuthRef.current;
    pendingOAuthRef.current = null;
    setOauthBusy(null);
    const providerLabel = profile.provider === 'google' ? 'Google' : 'Apple';
    if (authStatus === 'error') {
      console.error(`[AccountGateScreen] ${profile.provider} login API error:`, authError);
      setOauthError(authError ?? `We couldn't complete ${providerLabel} sign-in. Try again, or use email instead.`);
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
        provider: profile.provider,
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
        pendingOAuthRef.current = {
          provider: 'google',
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        };
        dispatch(authActions.googleLoginRequested({ idToken: profile.idToken }));
      } catch (err) {
        setOauthBusy(null);
        if (isUserCancelledGoogleSignIn(err)) return;
        // Was previously swallowed silently into just the on-screen banner —
        // logging the real native error/code here since "We couldn't
        // complete Google sign-in" alone gives no way to tell a config issue
        // (e.g. this build's signing cert SHA-1 not registered against the
        // OAuth client in Google Cloud Console — the classic DEVELOPER_ERROR,
        // code 10) apart from an actual network/account problem.
        console.error('[AccountGateScreen] Google sign-in error:', err);
        const message = err instanceof Error ? err.message : '';
        setOauthError(
          message.includes('not configured yet')
            ? message
            : "We couldn't complete Google sign-in. Try again, or use email instead.",
        );
      }
      return;
    }

    // Apple — same real POST /auth/apple + resolution shape as Google above.
    try {
      const profile = await signInWithApple();
      if (!profile) {
        setOauthBusy(null);
        return; // user backed out of the native sheet — not an error
      }
      pendingOAuthRef.current = {
        provider: 'apple',
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
      dispatch(
        authActions.appleLoginRequested({
          identityToken: profile.identityToken,
          // Apple only ever sends the name on the account's first
          // authorization — an empty string here isn't "no name", it's
          // "didn't send one this time", so don't pass it as if it were real.
          firstName: profile.firstName || undefined,
          lastName: profile.lastName || undefined,
        }),
      );
    } catch (err) {
      setOauthBusy(null);
      const message = err instanceof Error ? err.message : '';
      setOauthError(
        message.includes('not configured yet')
          ? message
          : "We couldn't complete Apple sign-in. Try again, or use email instead.",
      );
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
                size="md"
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
                size="md"
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
                size="md"
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
