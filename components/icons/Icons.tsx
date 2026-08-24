import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Icon set for the AuthStack (mail, apple, google, chevronLeft, check, alert,
 * shield, x). Follows the existing one-glyph-per-name convention in this
 * folder (see HomeIcon.tsx etc.) but collected behind a single `<Icon
 * name=.../>` since the auth screens reach for a lot of small glyphs inline.
 */
export type IconName =
  | 'mail'
  | 'apple'
  | 'google'
  | 'chevronLeft'
  | 'check'
  | 'alert'
  | 'shield'
  | 'x';

export type IconProps = {
  name: IconName;
  /** @default 22 */
  size?: number;
  /** Ignored by `google`, which always renders its real four-color mark. */
  color?: string;
};

export function Icon({ name, size = 22, color = '#2F4864' }: IconProps) {
  switch (name) {
    case 'mail':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M3.5 6.8l8 6 8-6"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.2-2.4-.1 0-2.5-1-2.5-3.7z"
            fill={color}
          />
          <Path
            d="M13.9 6.1c.6-.7 1-1.7.9-2.6-.9.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.4 2.5-1.2z"
            fill={color}
          />
        </Svg>
      );
    case 'google':
      // Real four-color mark — never re-tint via `color`.
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.55c2.08-1.92 3.29-4.74 3.29-8.1z"
            fill="#4285F4"
          />
          <Path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
            fill="#34A853"
          />
          <Path
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z"
            fill="#FBBC05"
          />
          <Path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.7 7.32 9.13 5.38 12 5.38z"
            fill="#EA4335"
          />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 5l-7 7 7 7"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12.5l4.5 4.5L19 7"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'alert':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3.5l9.5 16.5h-19L12 3.5z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path d="M12 10v4.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx={12} cy={17.3} r={1} fill={color} />
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3l7 2.7v5.4c0 4.6-3 8.3-7 9.6-4-1.3-7-5-7-9.6V5.7L12 3z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M9 12l2.2 2.2L15.5 10"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'x':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 6l12 12M18 6L6 18"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}
