import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A folded map — used for the Profile screen's "Location" row. */
export function MapIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5 4.5 6v13.5L9 18l6 1.5 4.5-1.5V4.5L15 6 9 4.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 4.5V18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M15 6v13.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
