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

export function Heading({ level = 'h1', className = '', ...rest }: HeadingProps) {
  return (
    <Text
      accessibilityRole="header"
      className={twMerge(headingClasses[level], className)}
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

export function BodyText({ size = 'base', className = '', ...rest }: BodyTextProps) {
  return <Text className={twMerge(bodyClasses[size], className)} {...rest} />;
}

export type EyebrowProps = TextProps;

export function Eyebrow({ className = '', ...rest }: EyebrowProps) {
  return (
    <Text
      className={twMerge(
        'font-condensed text-sm uppercase leading-none tracking-eyebrow text-text-muted',
        className
      )}
      {...rest}
    />
  );
}

export type StatProps = TextProps;

export function Stat({ className = '', ...rest }: StatProps) {
  return (
    <Text
      className={twMerge(
        'font-condensed-bold text-center text-5xl leading-none text-text-heading',
        className
      )}
      {...rest}
    />
  );
}
