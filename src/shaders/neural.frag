uniform float uTime;
uniform vec3 uColorA;  // #6C5CE7 violet
uniform vec3 uColorB;  // #00D4FF cyan

varying vec3 vPosition;
varying float vPulse;

void main() {
  // Soft circular point
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float alpha = smoothstep(0.5, 0.1, d) * (0.6 + vPulse * 0.4);
  vec3 color = mix(uColorA, uColorB, vPulse);

  gl_FragColor = vec4(color, alpha);
}
