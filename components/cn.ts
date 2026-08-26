/**
 * Shared className merge for every component that layers a passed-in
 * `className` on top of role/variant defaults.
 *
 * NativeWind (react-native-css-interop) resolves conflicting utilities by
 * CSS specificity/stylesheet order — NOT by where a class sits in the
 * className string. Plain string concatenation (`${defaults} ${className}`)
 * does not guarantee the passed className wins (e.g. Button's `bg-transparent`
 * default beat a passed `bg-[#fff]` because `transparent` compiles ahead of
 * the arbitrary value in the generated stylesheet). `twMerge` strips the
 * conflicting default before render instead, so the passed className always
 * wins, matching what every component's doc comments assume.
 */
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind.config.js adds custom fontSize keys ('2xs', 'md') that
// tailwind-merge doesn't know by default — register them so text-2xs/text-md
// are recognized as font-size utilities (conflicting with other text-*
// sizes) instead of falling into the generic text-color bucket.
export const cn = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-2xs', 'text-md'],
    },
  },
});
