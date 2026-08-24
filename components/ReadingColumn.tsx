import type { ReactNode } from 'react';
import { View, useWindowDimensions, type ViewProps } from 'react-native';
import { layout } from '../tokens/theme';

/**
 * The one layout contract every screen shares (tokens/theme.ts `layout`):
 * an 18pt side gutter always, and a 620pt reading column that centers once
 * the screen is >=700pt wide. Non-negotiable — don't re-derive these numbers
 * inline in a screen.
 *
 *   Band — full-bleed horizontal strip (a header, a footer, a screen's own
 *          background). Spans the whole width; nest a Col inside it to get
 *          the gutter/cap.
 *   Col  — the reading column itself: 18pt horizontal padding always, capped
 *          at 620pt and centered above the 700pt breakpoint.
 *   useWide() — the same >=700pt check, for screens that need to branch
 *               layout rather than just wrap content in a Col.
 */

export function useWide(): boolean {
  const { width } = useWindowDimensions();
  return width >= layout.tabletBreakpoint;
}

export type BandProps = ViewProps & { children?: ReactNode };

export function Band({ style, children, ...rest }: BandProps) {
  return (
    <View style={[{ width: '100%' }, style]} {...rest}>
      {children}
    </View>
  );
}

export type ColProps = ViewProps & { children?: ReactNode };

export function Col({ style, children, ...rest }: ColProps) {
  const isWide = useWide();
  return (
    <View
      style={[
        {
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: layout.screenGutter,
        },
        isWide ? { maxWidth: layout.readingColumn } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
