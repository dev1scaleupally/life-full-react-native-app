import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A five-point star — Settings' "Subscription" row. */
export function StarIcon({ size = 24, color = '#A2571F' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5l2.5 5.6 6 .6-4.5 4 1.3 5.9L12 16.8l-5.3 2.8 1.3-5.9-4.5-4 6-.6L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
