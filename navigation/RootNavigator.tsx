import { NavigationContainer } from '@react-navigation/native';
import type { AuthAccount } from '../services/auth/types';
import { AuthResolutionProvider } from './AuthResolutionContext';
import { AuthStack } from './AuthStack';
import { navigationRef } from './navigationRef';
import type { AuthMode } from './types';

export type RootNavigatorProps = {
  /**
   * Handoff point: fires once AuthStack resolves an account — sign-up after
   * verification, plain sign-in, or an OAuth provider. A real RootNavigator
   * would branch here on `account.subscriptionStatus` and push Paywall
   * (firstRun / resume mode) and then AppTabs — see navigation/types.ts's
   * RootStackParamList comment. Neither is built in this handoff, so the
   * caller decides what happens next.
   */
  onAuthResolved: (account: AuthAccount) => void;
  /** Which AccountGate copy/verb to land on — e.g. 'signin' from Welcome's "Sign in" link. @default 'signup' */
  initialMode?: AuthMode;
  /** Fires once AuthStack has actually mounted and navigationRef is ready to
   * `.navigate(...)` — App.tsx's AppShell uses this to replay a deep link
   * that arrived before the auth stack existed yet (app was cold-launched
   * by it, or a different screen was showing), instead of racing
   * navigationRef.isReady() from outside the component tree. */
  onReady?: () => void;
};

export function RootNavigator({ onAuthResolved, initialMode, onReady }: RootNavigatorProps) {
  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <AuthResolutionProvider value={onAuthResolved}>
        <AuthStack initialMode={initialMode} />
      </AuthResolutionProvider>
    </NavigationContainer>
  );
}
