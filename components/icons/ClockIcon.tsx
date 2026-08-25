import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A clock face — used for the Profile screen's "Retirement" row. */
export function ClockIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.6} />
      <Path d="M12 7.5v4.7l3 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
