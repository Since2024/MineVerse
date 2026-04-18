export const EXPO_INOUT = [0.76, 0, 0.24, 1] as const
export const EXPO_OUT = [0.16, 1, 0.3, 1] as const
export const EXPO_IN = [0.7, 0, 1, 0.3] as const

export const expoInOut = `cubic-bezier(${EXPO_INOUT.join(',')})`
export const expoOut = `cubic-bezier(${EXPO_OUT.join(',')})`

// GSAP-format strings
export const GSAP_EXPO_INOUT = `power4.inOut`
export const GSAP_EXPO_OUT = `power4.out`

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}
