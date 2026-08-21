import { StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export function DawnGradient() {
  return (
    <Svg
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      preserveAspectRatio="none"
    >
      <Defs>
        {/* Main vertical gradient */}
        <LinearGradient
          id="dawn"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <Stop offset="0%" stopColor="rgb(11, 26, 48)" />
          <Stop offset="34%" stopColor="rgb(27, 39, 71)" />
          <Stop offset="58%" stopColor="rgb(62, 53, 96)" />
          <Stop offset="80%" stopColor="rgb(138, 78, 77)" />
          <Stop offset="93%" stopColor="rgb(201, 104, 59)" />
          <Stop offset="100%" stopColor="rgb(230, 138, 67)" />
        </LinearGradient>

        {/* Bottom radial warm glow */}
        <RadialGradient
          id="sunGlow"
          cx="50%"
          cy="96%"
          rx="135%"
          ry="78%"
          gradientUnits="objectBoundingBox"
        >
          <Stop
            offset="0%"
            stopColor="rgb(255, 202, 128)"
            stopOpacity={0.62}
          />
          <Stop
            offset="56%"
            stopColor="rgb(255, 168, 99)"
            stopOpacity={0}
          />
        </RadialGradient>
      </Defs>

      {/* Base gradient */}
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#dawn)"
      />

      {/* Radial glow overlay */}
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#sunGlow)"
      />
    </Svg>
  );
}