import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * The "Graphic" alternative to DawnGradient (a flat gradient) — a literal
 * illustrated sunrise: navy sky, a warm radial glow behind the sun, the sun
 * itself, and three layered hill silhouettes rising over its lower half.
 * WelcomeScreen's top-right pill toggles between the two.
 */
export function GraphicSunrise() {
  return (
    <Svg
      viewBox="0 0 390 800"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFCB80" stopOpacity={0.85} />
          <Stop offset="38%" stopColor="#F4A24A" stopOpacity={0.42} />
          <Stop offset="70%" stopColor="#E3853B" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#E3853B" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* sky (flat navy) */}
      <Rect x="0" y="0" width="390" height="800" fill="#16294a" />

      {/* soft sun light */}
      <Circle cx="195" cy="600" r="460" fill="url(#sunGlow)" />

      {/* the sun */}
      <Circle cx="195" cy="600" r="60" fill="#F4A24A" />
      <Circle cx="195" cy="600" r="60" fill="#E3853B" fillOpacity={0.45} />

      {/* layered hills (rise over the lower half of the sun) */}
      <Ellipse cx="80" cy="720" rx="300" ry="140" fill="#4a5a33" />
      <Ellipse cx="330" cy="760" rx="300" ry="150" fill="#36452a" />
      <Ellipse cx="160" cy="820" rx="320" ry="150" fill="#243a3a" />
    </Svg>
  );
}
