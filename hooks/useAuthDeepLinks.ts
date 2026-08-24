import { useEffect } from 'react';
import { Linking } from 'react-native';
import { handleAuthDeepLink } from '../services/auth/deepLinks';

/** Subscribes to lifefull:// verify/reset links for as long as the caller is mounted. */
export function useAuthDeepLinks(): void {
  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) handleAuthDeepLink(url);
    });
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleAuthDeepLink(url);
    });
    return () => subscription.remove();
  }, []);
}
