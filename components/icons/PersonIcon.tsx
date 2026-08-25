import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A simple person silhouette — Home header's "Profile" access, and the Coach tab. */
export function PersonIcon({ size = 24, color = '#2F4864' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={3.5} stroke={color} strokeWidth={1.7} />
      <Path
        d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
