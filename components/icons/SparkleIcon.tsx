import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** A four-point sparkle — used for "highlight/what's next" callouts (e.g. Your First Week). */
export function SparkleIcon({ size = 24, color = '#E3853B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c.5 3.2 1.3 5 2.6 6.4C15.9 10.7 17.8 11.5 21 12c-3.2.5-5.1 1.3-6.4 2.6-1.3 1.3-2.1 3.2-2.6 6.4-.5-3.2-1.3-5.1-2.6-6.4C8.1 13.3 6.2 12.5 3 12c3.2-.5 5.1-1.3 6.4-2.6C10.7 8 11.5 6.2 12 3z"
        fill={color}
      />
    </Svg>
  );
}
