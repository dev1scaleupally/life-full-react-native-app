/**
 * Typography primitives, mapped 1:1 to tailwind.config.js's type tokens.
 * Roles follow the Lifefull type foundations: Display & Headings (bold, tight
 * tracking, navy ink), Body & UI Text (Barlow Book / regular), and Eyebrows &
 * Stats (uppercase labels + condensed numerals).
 *
 * Each component accepts a `className` to extend/override the base styles —
 * merged via `cn` (see cn.ts) so the passed className always wins over the
 * role default, regardless of NativeWind's CSS-specificity-based resolution.
 */
import { Text, type TextProps } from 'react-native';
import { cn as twMerge } from './cn';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

const headingClasses: Record<HeadingLevel, string> = {
  h1: 'font-sans-bold text-4xl leading-tight tracking-tight text-text-heading',
  h2: 'font-sans-bold text-3xl leading-tight tracking-tight text-text-heading',
  h3: 'font-sans-bold text-2xl leading-snug tracking-snug text-text-heading',
  h4: 'font-sans-bold text-xl leading-snug tracking-snug text-text-heading',
};

export type HeadingProps = TextProps & {
  /** Which step of the display scale this heading renders at. @default 'h1' */
  level?: HeadingLevel;
};

export function Heading({
  level = 'h1',
  className = '',
  // iOS's "Larger Accessibility Sizes" can scale fonts past 3x — uncapped,
  // that blows through fixed-width headings (e.g. AccountGateScreen's
  // max-w-[320px] intro copy). Capped, Dynamic Type still scales headings
  // meaningfully without breaking layout.
  maxFontSizeMultiplier = 1.3,
  ...rest
}: HeadingProps) {
  return (
    <Text
      accessibilityRole="header"
      className={twMerge(headingClasses[level], className)}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}

type BodySize = 'lg' | 'base' | 'sm' | 'caption';

const bodyClasses: Record<BodySize, string> = {
  lg: 'font-sans text-lg leading-relaxed text-text-body',
  base: 'font-sans text-base leading-normal text-text-body',
  sm: 'font-sans text-sm leading-normal text-text-body',
  caption: 'font-sans text-xs leading-snug text-text-muted',
};

export type BodyTextProps = TextProps & {
  /** Running-copy size. @default 'base' */
  size?: BodySize;
};

export function BodyText({
  size = 'base',
  className = '',
  // Same rationale as Heading — also caps Button's label (Button renders
  // its text via BodyText), which is what was overflowing the OAuth
  // buttons on AccountGateScreen under Larger Accessibility Sizes.
  maxFontSizeMultiplier = 1.5,
  ...rest
}: BodyTextProps) {
  return (
    <Text
      className={twMerge(bodyClasses[size], className)}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}

export type EyebrowProps = TextProps;

export function Eyebrow({ className = '', maxFontSizeMultiplier = 1.3, ...rest }: EyebrowProps) {
  return (
    <Text
      className={twMerge(
        'font-condensed text-sm uppercase leading-none tracking-eyebrow text-text-muted',
        className
      )}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}

export type StatProps = TextProps;

export function Stat({ className = '', maxFontSizeMultiplier = 1.2, ...rest }: StatProps) {
  return (
    <Text
      className={twMerge(
        'font-condensed-bold text-center text-5xl leading-none text-text-heading',
        className
      )}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
}
