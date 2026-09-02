import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

/**
 * Subscribes to every incoming URL — the one that cold-launched the app (if
 * any), plus every one it receives while running — for as long as the
 * caller is mounted, and calls `onUrl` for each one.
 *
 * Deliberately app-root-owned rather than scoped to the auth screen: a
 * verify-email/reset-password link is just as likely to be tapped after the
 * app was fully closed, or while showing some other screen entirely, as
 * while sitting on the auth stack — see App.tsx's AppShell for how it
 * decides whether to handle a link immediately or stash it until the auth
 * stack actually exists to navigate within.
 *
 * `onUrl` is read through a ref so this never needs to re-subscribe when the
 * caller passes a fresh closure each render (it captures whatever `screen`
 * currently is) — resubscribing would risk losing the cold-launch URL to a
 * transient unmount/remount.
 */
export function useAuthDeepLinks(onUrl: (url: string) => void): void {
  const onUrlRef = useRef(onUrl);
  onUrlRef.current = onUrl;

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) onUrlRef.current(url);
    });
    const subscription = Linking.addEventListener('url', ({ url }) => onUrlRef.current(url));
    return () => subscription.remove();
  }, []);
}
