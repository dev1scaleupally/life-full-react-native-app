import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export function LightbulbIcon({ size = 24, color = '#8E7C9B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a6 6 0 0 0-3 11.2c.6.35 1 1 1 1.8h4c0-.8.4-1.45 1-1.8A6 6 0 0 0 12 3z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 18h4M10.5 20.5h3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
