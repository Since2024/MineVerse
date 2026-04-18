// Flow shader for neural network connection lines
// UV offset along line creates travelling-data-pulse illusion
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  // Repeating pulse travelling along U axis
  float pulse = fract(vUv.x - uTime * 0.4);
  float beam = smoothstep(0.0, 0.15, pulse) * smoothstep(0.35, 0.15, pulse);

  // Fade at line ends
  float fade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);

  float alpha = (beam * 0.9 + 0.1) * fade * uOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
