import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A calendar page — the Plan tab. */
export function CalendarIcon({ size = 24, color = '#2F4864' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={5} width={17} height={15} rx={2} stroke={color} strokeWidth={1.7} />
      <Path d="M3.5 9.5h17" stroke={color} strokeWidth={1.7} />
      <Path d="M7.5 3v4M16.5 3v4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
