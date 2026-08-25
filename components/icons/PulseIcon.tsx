import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** An ECG/heartbeat line — Physical Vitality's glyph in tokens/theme.ts's `domains`. */
export function PulseIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h3.2l1.6-3.6 2.6 7.2 2-9.6 2 6h3.6l1.4-2.4 1.6 2.4H21"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
