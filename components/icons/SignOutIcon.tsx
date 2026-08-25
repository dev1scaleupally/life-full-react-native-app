import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A door with an exit arrow — Settings' "Sign out" row. */
export function SignOutIcon({ size = 24, color = '#C24A2F' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 4.5h-4A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5h4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5 8.5 17.5 12l-4 3.5M17.5 12H9.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
