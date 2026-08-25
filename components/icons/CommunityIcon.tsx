import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** Two overlapping figures — Social Architecture's glyph in tokens/theme.ts's `domains`. */
export function CommunityIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={2.6} stroke={color} strokeWidth={1.6} />
      <Path
        d="M4.2 18v-1.2c0-2.2 2.1-3.6 4.8-3.6s4.8 1.4 4.8 3.6V18"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={16} cy={9} r={2.1} stroke={color} strokeWidth={1.6} />
      <Path
        d="M14.6 13.3c2.2.2 3.9 1.5 3.9 3.5V18"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
