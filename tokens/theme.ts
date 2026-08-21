/**
 * Lifefull · theme.ts — reference React Native implementation of tokens.json.
 *
 * This is ONE way to consume the tokens, not a mandate. If you prefer NativeWind,
 * Tamagui, Restyle or your own provider, generate your config from tokens.json
 * instead and delete this file — tokens.json is the contract.
 *
 * Units are density-independent points. The web design system expressed the same
 * values in px/rem at a 16px root, so 1rem === 16.
 */

export const color = {
  orange: { 50: '#FCF1E7', 100: '#F8DCC1', 200: '#F2C194', 300: '#EDA868', 400: '#E89450', 500: '#E3853B', 600: '#C76E2A', 700: '#A2571F', 800: '#7C4218' },
  navy:   { 50: '#EBEEF2', 100: '#CCD5E0', 200: '#9FAFC3', 300: '#6F84A0', 400: '#4A6480', 500: '#2F4864', 600: '#253A52', 700: '#1C2C3E', 800: '#141F2C', 900: '#0D141C' },
  olive:  { 50: '#F1F2EA', 100: '#DFE2CC', 200: '#C4C9A1', 300: '#A8AE79', 400: '#989D6E', 500: '#8D9163', 600: '#71754C', 700: '#54583A' },
  teal:   { 50: '#EAF1F4', 100: '#CFE0E7', 200: '#A5C4CF', 300: '#7BA7B7', 400: '#6B98AB', 500: '#5F8CA0', 600: '#4A7081', 700: '#375562' },
  plum:   { 50: '#F0EDF2', 100: '#DCD5E2', 200: '#C0B4C9', 300: '#A595B1', 400: '#9A88A6', 500: '#8E7C9B', 600: '#71627D', 700: '#554A5E' },
  neutral:{ 0: '#FFFFFF', 50: '#F8F6F1', 100: '#F1EDE5', 200: '#E4DDD0', 300: '#CFC6B5', 400: '#ABA08C', 500: '#837868', 600: '#5F574A', 700: '#423D33', 800: '#2A2620', 900: '#19160F' },
  red:    { 100: '#F6D9D1', 500: '#C24A2F', 700: '#8F3320' },
} as const;

/** Semantic aliases — reference THESE in screen code, not the ramps. */
export const c = {
  brandPrimary: color.orange[700],
  brandPrimaryHover: color.orange[800],
  brandPrimaryActive: color.orange[800],
  brandPrimarySoft: color.orange[50],
  brandInk: color.navy[500],
  brandInkHover: color.navy[600],

  textStrong: color.navy[700],
  textHeading: color.navy[500],
  textBody: color.neutral[700],
  textMuted: '#5F574A',
  textSubtle: '#6E6557',
  textInverse: color.neutral[0],
  textLink: color.teal[600],
  textOnBrand: color.neutral[0],

  bgApp: color.neutral[50],
  surfaceCard: color.neutral[0],
  surfaceSunken: color.neutral[100],
  surfaceRaised: color.neutral[0],
  surfaceInk: color.navy[500],
  surfaceInkDeep: color.navy[700],

  borderSubtle: color.neutral[200],
  borderDefault: color.neutral[300],
  borderStrong: color.neutral[400],
  borderBrand: color.orange[500],
  ringFocus: 'rgba(95,140,160,0.55)',

  success: color.olive[600],
  successSoft: color.olive[50],
  info: color.teal[600],
  infoSoft: color.teal[50],
  warning: color.orange[500],
  warningSoft: color.orange[50],
  accent: color.plum[500],
  accentSoft: color.plum[50],
  danger: color.red[500],
  dangerSoft: color.red[100],
} as const;

/**
 * The four life domains.
 *
 * All four share ONE color — olive. This is deliberate and load-bearing: a color
 * never DENOTES a domain, and giving each domain its own hue invites exactly that
 * reading. Domains are told apart by GLYPH and NAME, never by tint. Do not
 * "improve" this by assigning a hue per domain, and never build logic or a legend
 * on hue. Orange (action) and navy (ink) are deliberately not used here.
 */
const domainTint = { color: color.olive[600], soft: color.olive[50], ink: color.olive[700] } as const;

export const domains = [
  { key: 'drivers',  name: 'Core Drivers',        icon: 'compass',   ...domainTint, question: 'What matters beyond your career',  artifact: 'Your Core Drivers' },
  { key: 'social',   name: 'Social Architecture', icon: 'community', ...domainTint, question: 'Who is in your life, and how close', artifact: 'Your Relationship Portfolio' },
  { key: 'vitality', name: 'Physical Vitality',   icon: 'pulse',     ...domainTint, question: 'What your energy allows you to do', artifact: 'Your Vitality Snapshot' },
  { key: 'resource', name: 'Resource Awareness',  icon: 'wallet',    ...domainTint, question: 'What you have to build with',      artifact: 'Your Resource Profile' },
] as const;

/** The five session phases the guide moves through within a domain. */
export const sessionPhases = ['Reflect', 'Expand', 'Clarify', 'Imagine', 'Commit'] as const;

export const font = {
  sans: 'Barlow',
  condensed: 'Barlow Semi Condensed',
} as const;

export const weight = { book: '400', medium: '500', semibold: '600', bold: '700' } as const;

/** 12pt hard floor — the audience skews older, legibility beats density. */
export const size = {
  '2xs': 12, xs: 13, sm: 15, base: 16,
  md: 17, // Sage's conversational messages only
  lg: 18, xl: 22, '2xl': 28, '3xl': 36, '4xl': 48, '5xl': 60, '6xl': 76,
} as const;

export const leading = { none: 1, tight: 1.12, snug: 1.28, normal: 1.5, relaxed: 1.65 } as const;

/** em values from the web system. RN letterSpacing is absolute points — use track(). */
export const trackingEm = { tight: -0.02, snug: -0.01, normal: 0, wide: 0.03, eyebrow: 0.14 } as const;

/** Convert an em tracking value to RN points at a given font size. */
export const track = (em: number, fontSize: number) => em * fontSize;
/** Convert a line-height ratio to RN's absolute lineHeight. */
export const lh = (ratio: number, fontSize: number) => Math.round(ratio * fontSize);

export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96, 32: 128 } as const;

export const layout = {
  /** The one reading-column width every screen shares on tablet. */
  readingColumn: 620,
  tabletBreakpoint: 700,
  screenGutter: 18,
  controlHeight: { sm: 32, md: 40, lg: 48 },
  tapMin: 44,
} as const;

export const radius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, pill: 999 } as const;

/**
 * Navy-tinted elevation, never pure black. iOS reads shadow*; Android reads only
 * elevation — both are included so one spread covers both platforms.
 */
type Shadow = {
  shadowColor: string; shadowOpacity: number; shadowRadius: number;
  shadowOffset: { width: number; height: number }; elevation: number;
};
const sh = (opacity: number, r: number, h: number, elevation: number, col = '#141F2C'): Shadow => ({
  shadowColor: col, shadowOpacity: opacity, shadowRadius: r, shadowOffset: { width: 0, height: h }, elevation,
});

export const shadow = {
  xs: sh(0.06, 2, 1, 1),
  sm: sh(0.08, 3, 1, 2),
  md: sh(0.09, 14, 4, 4),
  lg: sh(0.12, 30, 12, 8),
  xl: sh(0.16, 56, 24, 14),
  /** Warm glow for primary emphasis. */
  brand: sh(0.28, 22, 8, 6, '#E3853B'),
} as const;

export const motion = {
  duration: { fast: 120, base: 200, slow: 320 },
  /** Bezier control points — feed to Easing.bezier(...). */
  easing: {
    standard: [0.2, 0.6, 0.2, 1],
    out: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
} as const;

/** Ready-made text roles, so screens don't re-derive type from primitives. */
export const type = {
  display:  { fontFamily: font.sans, fontWeight: weight.bold,     fontSize: size['3xl'], lineHeight: lh(leading.tight, size['3xl']), letterSpacing: track(trackingEm.tight, size['3xl']), color: c.brandInk },
  h1:       { fontFamily: font.sans, fontWeight: weight.bold,     fontSize: size['2xl'], lineHeight: lh(leading.tight, size['2xl']), letterSpacing: track(trackingEm.tight, size['2xl']), color: c.brandInk },
  h2:       { fontFamily: font.sans, fontWeight: weight.bold,     fontSize: size.xl,     lineHeight: lh(leading.snug,  size.xl),     letterSpacing: track(trackingEm.tight, size.xl),     color: c.brandInk },
  h3:       { fontFamily: font.sans, fontWeight: weight.bold,     fontSize: size.lg,     lineHeight: lh(leading.snug,  size.lg),     letterSpacing: track(trackingEm.snug,  size.lg),     color: c.brandInk },
  body:     { fontFamily: font.sans, fontWeight: weight.book,     fontSize: size.base,   lineHeight: lh(leading.normal, size.base),  color: c.textBody },
  bodyLg:   { fontFamily: font.sans, fontWeight: weight.book,     fontSize: size.lg,     lineHeight: lh(leading.normal, size.lg),    color: c.textBody },
  /** Sage's conversational messages only. */
  message:  { fontFamily: font.sans, fontWeight: weight.book,     fontSize: size.md,     lineHeight: lh(leading.normal, size.md),    color: c.textBody },
  small:    { fontFamily: font.sans, fontWeight: weight.book,     fontSize: size.sm,     lineHeight: lh(leading.normal, size.sm),    color: c.textBody },
  label:    { fontFamily: font.sans, fontWeight: weight.semibold, fontSize: size.sm,     lineHeight: lh(leading.snug,   size.sm),    color: c.textStrong },
  /** ALL-CAPS is reserved for the wordmark and short tracked eyebrows. */
  eyebrow:  { fontFamily: font.sans, fontWeight: weight.semibold, fontSize: size['2xs'], lineHeight: lh(leading.snug, size['2xs']), letterSpacing: track(trackingEm.eyebrow, size['2xs']), textTransform: 'uppercase' as const, color: c.textMuted },
  caption:  { fontFamily: font.sans, fontWeight: weight.book,     fontSize: size.xs,     lineHeight: lh(leading.normal, size.xs),    color: c.textMuted },
  /** Big numerals / stats use the condensed cut. */
  stat:     { fontFamily: font.condensed, fontWeight: weight.bold, fontSize: size['3xl'], lineHeight: lh(leading.none, size['3xl']), letterSpacing: track(trackingEm.tight, size['3xl']), color: c.brandInk },
} as const;

export const theme = { color, c, domains, sessionPhases, font, weight, size, leading, trackingEm, space, layout, radius, shadow, motion, type, track, lh, domainsByKey: Object.fromEntries(domains.map(d => [d.key, d])) };
export default theme;
