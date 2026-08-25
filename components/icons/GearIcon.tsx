import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A settings gear — Home header's "Settings" access. */
export function GearIcon({ size = 24, color = '#2F4864' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.7} />
      <Path
        d="M12 3.5v2.4M12 18.1v2.4M4.7 7.3l2 1.2M17.3 15.5l2 1.2M3.5 12h2.4M18.1 12h2.4M4.7 16.7l2-1.2M17.3 8.5l2-1.2M7.3 4.7l1.2 2M15.5 17.3l1.2 2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
