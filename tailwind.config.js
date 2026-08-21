  /** @type {import('tailwindcss').Config} */
// Theming pulled 1:1 from tokens/tokens.json (the contract) — keep this file in
// sync with that source, don't hand-edit values away from it. Light-only: the
// Lifefull design system defines a single palette, no dark variant.
module.exports = {
  content: ['./App.tsx', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Full ramps — reach for these when a semantic alias doesn't fit.
        orange: {
          50: '#FCF1E7', 100: '#F8DCC1', 200: '#F2C194', 300: '#EDA868', 400: '#E89450',
          500: '#E3853B', 600: '#C76E2A', 700: '#A2571F', 800: '#7C4218',
        },
        navy: {
          50: '#EBEEF2', 100: '#CCD5E0', 200: '#9FAFC3', 300: '#6F84A0', 400: '#4A6480',
          500: '#2F4864', 600: '#253A52', 700: '#1C2C3E', 800: '#141F2C', 900: '#0D141C',
        },
        olive: {
          50: '#F1F2EA', 100: '#DFE2CC', 200: '#C4C9A1', 300: '#A8AE79', 400: '#989D6E',
          500: '#8D9163', 600: '#71754C', 700: '#54583A',
        },
        teal: {
          50: '#EAF1F4', 100: '#CFE0E7', 200: '#A5C4CF', 300: '#7BA7B7', 400: '#6B98AB',
          500: '#5F8CA0', 600: '#4A7081', 700: '#375562',
        },
        plum: {
          50: '#F0EDF2', 100: '#DCD5E2', 200: '#C0B4C9', 300: '#A595B1', 400: '#9A88A6',
          500: '#8E7C9B', 600: '#71627D', 700: '#554A5E',
        },
        neutral: {
          0: '#FFFFFF', 50: '#F8F6F1', 100: '#F1EDE5', 200: '#E4DDD0', 300: '#CFC6B5',
          400: '#ABA08C', 500: '#837868', 600: '#5F574A', 700: '#423D33', 800: '#2A2620', 900: '#19160F',
        },
        red: { 100: '#F6D9D1', 500: '#C24A2F', 700: '#8F3320' },

        // Semantic aliases — prefer these in screen code, per theme.ts's `c` object.
        // Orange is primary action/emphasis ONLY. Navy is ink, never a large fill.
        brand: {
          DEFAULT: '#A2571F', // brandPrimary
          hover: '#7C4218',
          active: '#7C4218',
          soft: '#FCF1E7',
          ink: '#2F4864',
          'ink-hover': '#253A52',
        },
        text: {
          strong: '#1C2C3E',
          heading: '#2F4864',
          body: '#423D33',
          muted: '#5F574A',
          subtle: '#6E6557',
          inverse: '#FFFFFF',
          link: '#4A7081',
          secondary: '#2A2620',
          'on-brand': '#FFFFFF',
        },
        surface: {
          app: '#F8F6F1',
          card: '#FFFFFF',
          sunken: '#F1EDE5',
          raised: '#FFFFFF',
          ink: '#2F4864',
          'ink-deep': '#1C2C3E',
        },
        border: {
          subtle: '#E4DDD0',
          DEFAULT: '#CFC6B5',
          strong: '#ABA08C',
          brand: '#E3853B',
        },
        ring: { focus: 'rgba(95,140,160,0.55)' },

        success: { DEFAULT: '#71754C', soft: '#F1F2EA' },
        info: { DEFAULT: '#4A7081', soft: '#EAF1F4' },
        warning: { DEFAULT: '#E3853B', soft: '#FCF1E7' },
        accent: { DEFAULT: '#8E7C9B', soft: '#F0EDF2' },
        danger: { DEFAULT: '#C24A2F', soft: '#F6D9D1' },
      },

      // RN doesn't reliably map fontWeight -> the right physical file for a
      // custom font (esp. on iOS), so each weight we actually use is its own
      // family key pointing at that weight's exact PostScript name (see
      // assets/fonts/ + react-native.config.js for the linked files).
      fontFamily: {
        sans: ['Barlow-Regular'], // Body & UI text — "Barlow Book"
        'sans-bold': ['Barlow-Bold'], // Display & Headings — bold, tight tracking
        condensed: ['BarlowSemiCondensed-SemiBold'], // Eyebrows — uppercase labels
        'condensed-bold': ['BarlowSemiCondensed-Bold'], // Stats — condensed numerals
      },

      // 12pt hard floor — the audience skews older, legibility beats density.
      // Line-height and letter-spacing are kept as separate scales below (see
      // theme.ts's `type` table for the specific role combinations — e.g. h1
      // pairs 2xl with leading-tight and tracking-tight).
      fontSize: {
        '2xs': '12px', xs: '13px', sm: '15px', base: '16px',
        md: '17px', // Sage's conversational messages only
        lg: '18px', xl: '22px', '2xl': '24px', '3xl': '36px', '4xl': '48px', '5xl': '60px', '6xl': '76px',
      },
      lineHeight: {
        none: '1', tight: '1.12', snug: '1.28', normal: '1.5', relaxed: '1.65',
      },
      // Source values are em (scale with the element's own font-size), matching
      // web CSS semantics. RN's native letterSpacing is absolute points — if a
      // NativeWind release on your setup doesn't convert em on native, compute
      // px per size with theme.ts's `track(em, fontSize)` instead of these classes.
      letterSpacing: {
        tight: '-0.02em', snug: '-0.01em', normal: '0em', wide: '0.03em', eyebrow: '0.14em',
      },

      // Note: Tailwind's default spacing scale (1=4px, 2=8px, 4=16px, 8=32px,
      // 16=64px, 32=128px...) already matches tokens.json's `space` scale
      // exactly — nothing to override there.

      borderRadius: {
        xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', pill: '999px',
      },

      // From tokens.json's `shadow` map. NativeWind's shadow plugin reads the alpha
      // straight off the rgba() color (shadowOpacity is always 1 on its side), and
      // looks up `elevation` (below) by matching this same value to get Android's
      // number — keep the two maps' keys in lockstep.
      boxShadow: {
        xs: '0px 1px 2px rgba(20, 31, 44, 0.06)',
        sm: '0px 1px 3px rgba(20, 31, 44, 0.08)',
        md: '0px 4px 14px rgba(20, 31, 44, 0.09)',
        lg: '0px 12px 30px rgba(20, 31, 44, 0.12)',
        xl: '0px 24px 56px rgba(20, 31, 44, 0.16)',
        brand: '0px 8px 22px rgba(227, 133, 59, 0.28)', // warm-orange glow, primary emphasis only
      },
      elevation: {
        xs: 1, sm: 2, md: 4, lg: 8, xl: 14, brand: 6,
      },

      // From tokens.json's `layout` map.
      screens: {
        tablet: '700px',
      },
      maxWidth: {
        reading: '620px', // the one reading-column width every screen shares on tablet
      },
      height: {
        'control-sm': '32px', 'control-md': '40px', 'control-lg': '48px',
      },
      minHeight: {
        'tap-min': '44px', // minimum touch target
      },
      minWidth: {
        'tap-min': '44px',
      },
    },
  },
  plugins: [],
};
