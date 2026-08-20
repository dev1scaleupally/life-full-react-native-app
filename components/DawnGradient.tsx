import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

/**
 * Full-bleed "dawn" background — navy ink fading through plum into a warm
 * sunrise orange. Built with react-native-svg (already a project dependency)
 * rather than adding a separate gradient library.
 */
export function DawnGradient() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#141F2C" />
          <Stop offset="0.45" stopColor="#253A52" />
          <Stop offset="0.72" stopColor="#71627D" />
          <Stop offset="1" stopColor="#EDA868" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dawn)" />
    </Svg>
  );
}
