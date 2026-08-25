import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A notification bell — Settings' "Commitment reminders" row. */
export function BellIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 10.5a6 6 0 1 1 12 0v3.2l1.5 2.3H4.5L6 13.7v-3.2Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
