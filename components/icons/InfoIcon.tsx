import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** An "i" in a circle — Settings' "About Lifefull" row. */
export function InfoIcon({ size = 24, color = '#5F574A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={8.2} r={0.9} fill={color} />
      <Path d="M12 11.5v5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
