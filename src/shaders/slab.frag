// Project slab shader: screenshot texture + scanlines + hover ripple
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;  // 0 → 1 on hover
uniform vec2 uMouse;   // mouse in UV space

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // UV ripple from mouse position when hovered
  vec2 delta = uv - uMouse;
  float dist = length(delta);
  float ripple = uHover * sin(dist * 20.0 - uTime * 4.0) * 0.015 * smoothstep(0.5, 0.0, dist);
  uv += ripple * normalize(delta + 0.001);

  // Scanline overlay
  float scanline = sin(uv.y * 600.0 + uTime * 0.5) * 0.03 + 1.0;

  vec4 tex = texture2D(uTexture, uv);
  tex.rgb *= scanline;

  // Vignette on the slab edges
  vec2 vig = vUv * (1.0 - vUv);
  float vignette = pow(vig.x * vig.y * 15.0, 0.3);
  tex.rgb *= vignette;

  gl_FragColor = tex;
}
