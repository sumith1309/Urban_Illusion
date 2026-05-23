// Eye fragment shader — concentric jewelled rings with stipple,
// cobalt outer ring → pale-pearl band → cyan iris → black pupil.
// Subtle drift uniform offsets the pupil toward the cursor (the "gaze").

precision highp float;

uniform float uTime;
uniform vec2  uGaze;    // -1..1, x/y offset of pupil
uniform float uReveal;  // 0..1 crossfade-in from poster

varying vec2 vUv;

// Cheap hash for stipple speckle
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);

  // Concentric rings (matches the poster composition)
  vec3 cobalt = vec3(0.118, 0.227, 0.541);  // #1E3A8A
  vec3 navy   = vec3(0.043, 0.106, 0.247);  // #0B1B3F
  vec3 pearl  = vec3(0.937, 0.902, 0.831);  // #EFE6D4
  vec3 iris   = vec3(0.659, 0.816, 0.878);  // #A8D0E0
  vec3 pupil  = vec3(0.039);

  // Outer cobalt disc with subtle radial gradient
  vec3 col = mix(cobalt, navy, smoothstep(0.20, 0.42, r));

  // Pearl band (the jewelled inner ring)
  float pearlMask = smoothstep(0.27, 0.265, r) * (1.0 - smoothstep(0.18, 0.175, r));
  col = mix(col, pearl, pearlMask);

  // Iris
  vec2 gaze = uGaze * 0.025;
  float irisR = length(uv - gaze);
  float irisMask = 1.0 - smoothstep(0.13, 0.135, irisR);
  vec3 irisColor = mix(iris, vec3(0.310, 0.486, 0.592), smoothstep(0.04, 0.13, irisR));
  col = mix(col, irisColor, irisMask);

  // Pupil (also drifts with gaze)
  float pupilR = length(uv - gaze);
  col = mix(col, pupil, 1.0 - smoothstep(0.045, 0.05, pupilR));

  // Highlight catch (top-left)
  float hl = smoothstep(0.018, 0.0, length(uv - gaze - vec2(-0.022, -0.028)));
  col = mix(col, vec3(1.0), hl * 0.85);

  // Stipple grain on the disc only
  if (r < 0.42) {
    float s = hash(floor(vUv * 240.0) + floor(uTime * 0.5));
    col += (s - 0.5) * 0.04;
  }

  // Soft shimmer — slow time-driven hue lift on the pearl band
  float shimmer = sin(uTime * 0.6 + r * 18.0) * 0.04;
  col += shimmer * pearlMask;

  // Outside disc → transparent so the SVG poster shows through
  float discAlpha = 1.0 - smoothstep(0.41, 0.46, r);
  float a = discAlpha * uReveal;

  gl_FragColor = vec4(col, a);
}
