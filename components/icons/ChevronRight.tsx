import Svg, { Path } from 'react-native-svg';

export type ChevronRightProps = {
  size?: number;
  color?: string;
};

export function ChevronRight({ size = 16, color = '#1C2C3E' }: ChevronRightProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5l7 7-7 7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
