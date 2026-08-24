import { NavigationContainer } from '@react-navigation/native';
import { useAuthDeepLinks } from '../hooks/useAuthDeepLinks';
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
};

export function RootNavigator({ onAuthResolved, initialMode }: RootNavigatorProps) {
  useAuthDeepLinks();
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthResolutionProvider value={onAuthResolved}>
        <AuthStack initialMode={initialMode} />
      </AuthResolutionProvider>
    </NavigationContainer>
  );
}
