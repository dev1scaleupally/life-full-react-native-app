import { useCallback, useState } from 'react';

/**
 * Tiny press-state helper. NativeWind on this setup doesn't reliably support
 * `active:` pseudo-class variants on Pressable, so pressed-state styling is
 * driven from plain React state instead — spread the returned handlers onto
 * a Pressable and branch your className on `pressed`.
 */
export function usePressed() {
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);
  return { pressed, onPressIn, onPressOut };
}
