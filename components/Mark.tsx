import { SvgXml } from 'react-native-svg';
import { MARK_NAVY_SVG, MARK_SVG, MARK_WHITE_SVG } from './icons/brandSvgs';

type MarkVariant = 'orange' | 'navy' | 'white';

const sourceByVariant: Record<MarkVariant, string> = {
  orange: MARK_SVG,
  navy: MARK_NAVY_SVG,
  white: MARK_WHITE_SVG,
};

// Intrinsic aspect ratio of the standalone icon (viewBox 34 x 28.09).
const ASPECT_RATIO = 34 / 28.09;

export type MarkProps = {
  /** @default 'orange' */
  variant?: MarkVariant;
  /** Rendered height in points; width follows the mark's aspect ratio. @default 28 */
  height?: number;
};

/** The standalone Lifefull icon — a sunrise/peak glyph inside a broken ring. */
export function Mark({ variant = 'orange', height = 28 }: MarkProps) {
  return (
    <SvgXml
      xml={sourceByVariant[variant]}
      height={height}
      width={height * ASPECT_RATIO}
    />
  );
}
