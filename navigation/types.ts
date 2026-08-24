export type AuthMode = 'signup' | 'signin';

export type AuthStackParamList = {
  AccountGate: { mode?: AuthMode } | undefined;
  EmailForm: {
    mode: AuthMode;
    /** Carried over from AccountGate, EmailVerify's "use a different address", or a verify/reset deep link. */
    email?: string;
    /** Shows the "Your email is verified" olive row (arrives via the verify deep link). */
    verifiedBanner?: boolean;
    /** Shows the "Your password is updated" olive row (arrives from NewPassword). */
    resetBanner?: boolean;
  };
  EmailVerify: {
    email: string;
    /** Set when the verify deep link is opened >24h after it was sent. */
    expired?: boolean;
  };
  ForgotPassword: {
    email?: string;
    /** Set when a reset deep link is opened >1h after it was sent. */
    expiredError?: boolean;
  };
  ResetLinkSent: { email: string };
  NewPassword: { email: string; token: string };
};

/**
 * Where AuthStack sits once a real RootNavigator exists (not built in this
 * handoff). Routing from here is a function of account + subscription
 * state, never screen order:
 *
 *   new account, unverified          -> stays in AuthStack (EmailVerify)
 *   new / never-subscribed account   -> Paywall (firstRun mode) -> AppTabs
 *   existing, active subscription    -> AppTabs directly
 *   existing, expired/canceled       -> Paywall (resume mode)  -> AppTabs
 *
 * See navigation/RootNavigator.tsx's `onAuthResolved` — that's the handoff
 * point a real RootNavigator would branch on.
 */
export type RootStackParamList = {
  AuthStack: undefined;
  // Paywall: { mode: 'firstRun' | 'resume' }; -- not built in this handoff
  // AppTabs: undefined;                        -- not built in this handoff
};
