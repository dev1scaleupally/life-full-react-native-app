import { createContext, useContext } from 'react';
import type { AuthAccount } from '../services/auth/types';

export type AuthResolutionHandler = (account: AuthAccount) => void;

const AuthResolutionContext = createContext<AuthResolutionHandler | null>(null);

export const AuthResolutionProvider = AuthResolutionContext.Provider;

/**
 * How a screen hands a resolved account back up once sign-in/sign-up (and,
 * for email, verification) is done. See navigation/types.ts's
 * RootStackParamList comment for what a real consumer does with it.
 */
export function useAuthResolution(): AuthResolutionHandler {
  const handler = useContext(AuthResolutionContext);
  if (!handler) {
    throw new Error('useAuthResolution must be used within an AuthResolutionProvider');
  }
  return handler;
}
