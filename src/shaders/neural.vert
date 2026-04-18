uniform float uTime;
uniform float uPulse;

varying vec3 vPosition;
varying float vPulse;

void main() {
  vPosition = position;

  // Soft oscillating displacement along the normal
  vec3 disp = normal * sin(uTime * 0.8 + position.y * 2.5) * 0.03;
  vec3 displaced = position + disp;

  vPulse = sin(uTime + position.y * 3.0) * 0.5 + 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  gl_PointSize = (3.5 + vPulse * 1.5) * (1.0 / -mvPosition.z);
}
