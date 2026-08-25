import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** An edit pencil — used next to "About You" on the Profile screen. */
export function PencilIcon({ size = 24, color = '#A2571F' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.5 4.5 19 9l-9.5 9.5H5v-4.5l9.5-9.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12.8 6.2 17 10.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
