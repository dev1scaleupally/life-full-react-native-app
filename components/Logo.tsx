import { SvgXml } from 'react-native-svg';
import {
  LOGO_FULL_NAVY_SVG,
  LOGO_FULL_SVG,
  LOGO_FULL_WHITE_MARK_SVG,
  LOGO_FULL_WHITE_SVG,
} from './icons/brandSvgs';

type LogoVariant = 'default' | 'navy' | 'white' | 'white-mark';

const sourceByVariant: Record<LogoVariant, string> = {
  default: LOGO_FULL_SVG, // orange mark + navy wordmark — light backgrounds
  navy: LOGO_FULL_NAVY_SVG, // monochrome navy
  white: LOGO_FULL_WHITE_SVG, // white wordmark, mark stays orange — dark backgrounds
  'white-mark': LOGO_FULL_WHITE_MARK_SVG, // fully white/reversed
};

// Intrinsic aspect ratio of the full lockup (viewBox 203.07 x 28.09).
const ASPECT_RATIO = 203.07 / 28.09;

export type LogoProps = {
  /** @default 'default' */
  variant?: LogoVariant;
  /** Rendered height in points; width follows the logo's aspect ratio. @default 28 */
  height?: number;
};

/** The full "mark + wordmark" Lifefull lockup. */
export function Logo({ variant = 'default', height = 28 }: LogoProps) {
  return (
    <SvgXml
      xml={sourceByVariant[variant]}
      height={height}
      width={height * ASPECT_RATIO}
    />
  );
}
