/**
 * Animation constants for PowerGridBD
 * Framer Motion easing tuples must be exactly 4 numbers for cubic-bezier
 */

export const easing = {
  /** Standard ease-out cubic bezier */
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  /** Standard ease-in-out cubic bezier */
  easeInOut: [0.42, 0, 0.58, 1] as const,
  /** Standard ease-in cubic bezier */
  easeIn: [0.55, 0.055, 0.675, 0.19] as const,
  /** Linear easing */
  linear: [0, 0, 1, 1] as const,
  /** GSAP-style power2.out approximation */
  power2Out: [0.25, 0.46, 0.45, 0.94] as const,
  /** GSAP-style power2.inOut approximation */
  power2InOut: [0.45, 0.05, 0.55, 0.95] as const,
} as const;

export type EasingTuple = readonly [number, number, number, number];

export const duration = {
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.6,
  verySlow: 1.0,
} as const;

export const stagger = {
  children: 0.08,
  cards: 0.1,
  sections: 0.15,
} as const;
