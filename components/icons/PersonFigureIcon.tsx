import Svg, { Circle, Path } from 'react-native-svg';

export type PersonFigureIconProps = {
  /** Rendered height in points; width follows the glyph's aspect ratio. @default 80 */
  height?: number;
  color?: string;
};

// Intrinsic aspect ratio of the glyph (viewBox 60 x 104).
const ASPECT_RATIO = 60 / 104;

/**
 * A standing figure glyph. Used in a row of three to mark progress through a
 * multi-part reflection — filled for the current/completed part, neutral for
 * what's ahead.
 */
export function PersonFigureIcon({
  height = 80,
  color = '#E3853B',
}: PersonFigureIconProps) {
  return (
    <Svg
      width={height * ASPECT_RATIO}
      height={height}
      viewBox="0 0 60 104"
      fill={color}
    >
      <Circle cx={30} cy={14} r={13} />
      <Path d="M30 30c9 0 15 4 17 11l5 23c1 5-7 7-9 2l-4-13v13l4 32c1 6-9 7-10 1l-3-22-3 22c-1 6-11 5-10-1l4-32V53l-4 13c-2 5-10 3-9-2l5-23c2-7 8-11 17-11z" />
    </Svg>
  );
}
