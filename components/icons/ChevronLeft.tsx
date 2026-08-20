import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export function ChevronLeft({ size = 22, color = '#2F4864' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
