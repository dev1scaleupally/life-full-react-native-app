export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'never_subscribed';

export type AuthProvider = 'email' | 'google' | 'apple';

export type AuthAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  provider: AuthProvider;
};

export type AuthErrorCode = 'account_exists' | 'invalid_credentials';

export type AuthResult =
  | { ok: true; account: AuthAccount }
  | { ok: false; error: AuthErrorCode };
