import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A wallet with a card slot — Resource Awareness's glyph in tokens/theme.ts's `domains`. */
export function WalletIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={6.5} width={17} height={12} rx={2} stroke={color} strokeWidth={1.6} />
      <Path
        d="M3.5 10.5h13a2.5 2.5 0 0 0 2.5-2.5v-1"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={16.2} cy={14.5} r={1.3} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}
