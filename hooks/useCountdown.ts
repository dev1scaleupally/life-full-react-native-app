import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Ticks a countdown from `seconds` to 0, once a second, starting immediately
 * on mount. Call `restart()` to reset it (e.g. after a resend). Used by the
 * EmailVerify / ResetLinkSent "resend the link in Ns" control.
 */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clear]);

  const restart = useCallback(() => {
    setRemaining(seconds);
    start();
  }, [seconds, start]);

  useEffect(() => {
    start();
    return clear;
    // Intentionally only on mount — `restart()` is the explicit re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { remaining, restart, isDone: remaining <= 0 };
}
