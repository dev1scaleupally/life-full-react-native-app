import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A question mark in a circle — Settings' "Help & contact" row. */
export function HelpCircleIcon({ size = 24, color = '#5F574A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.6} />
      <Path
        d="M9.8 9.5a2.2 2.2 0 1 1 3.3 2c-.8.5-1.1.9-1.1 1.8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={16.6} r={0.9} fill={color} />
    </Svg>
  );
}
