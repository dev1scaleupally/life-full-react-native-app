import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export function CompassIcon({ size = 24, color = '#5F8CA0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path
        d="M14.8 9.2l-1.6 3.2-3.2 1.6 1.6-3.2 3.2-1.6z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
