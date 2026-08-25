import Svg, { Circle } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** Concentric rings — used for the Profile screen's "Former role" row. */
export function TargetIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={12} r={4.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={12} r={1.2} fill={color} />
    </Svg>
  );
}
