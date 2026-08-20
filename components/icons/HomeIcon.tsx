import Svg, { Path } from 'react-native-svg';

export type IconProps = {
  size?: number;
  color?: string;
};

export function HomeIcon({ size = 24, color = '#54583A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12l8-7 8 7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 11v7a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
