/**
 * JapanUni Design Tokens
 * Single source of truth for all design values
 */

export const colors = {
  // Brand colors - Sakura theme
  sakura: {
    50: '#fff5f7',
    100: '#ffe4ec',
    200: '#ffc9d9',
    300: '#ffa3b8',
    400: '#f97a96',
    500: '#e85d8a',
    600: '#c93d6a',
    700: '#a02d52',
    800: '#832644',
    900: '#6d223a',
    950: '#3d0d1d',
  },

  // Neutral colors - Ink theme
  ink: {
    50: '#f8f9fb',
    100: '#eef1f6',
    200: '#dce2ec',
    300: '#bcc8d8',
    400: '#8fa4c0',
    500: '#6b83a3',
    600: '#526885',
    700: '#42536b',
    800: '#1a1f2e',
    900: '#0f1219',
    950: '#080a0f',
  },

  // Semantic colors
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // Surface colors (for glass morphism)
  surface: {
    light: 'rgba(255, 255, 255, 0.75)',
    dark: 'rgba(8, 10, 15, 0.70)',
    border: {
      light: 'rgba(255, 255, 255, 0.20)',
      dark: 'rgba(255, 255, 255, 0.10)',
    },
    hover: {
      light: 'rgba(255, 255, 255, 0.90)',
      dark: 'rgba(26, 31, 46, 0.80)',
    },
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
} as const;

export const typography = {
  fontFamily: {
    sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
    display: ['"Outfit"', 'system-ui', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
    widest: '0.1em',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Glass morphism shadows
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  glassHover: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
  // Colored shadows
  sakura: '0 10px 30px -10px rgba(232, 93, 138, 0.4)',
  sakuraHover: '0 15px 40px -10px rgba(232, 93, 138, 0.5)',
} as const;

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
  spring: '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

// Animation keyframes
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideDown: {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideLeft: {
    '0%': { opacity: '0', transform: 'translateX(20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  slideRight: {
    '0%': { opacity: '0', transform: 'translateX(-20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  scaleOut: {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.95)' },
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
} as const;

export const animation = {
  none: 'none',
  fadeIn: 'fadeIn 200ms ease-out',
  fadeOut: 'fadeOut 200ms ease-in',
  slideUp: 'slideUp 300ms ease-out',
  slideDown: 'slideDown 300ms ease-out',
  slideLeft: 'slideLeft 300ms ease-out',
  slideRight: 'slideRight 300ms ease-out',
  scaleIn: 'scaleIn 200ms ease-out',
  scaleOut: 'scaleOut 200ms ease-in',
  spin: 'spin 1s linear infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  shimmer: 'shimmer 2s linear infinite',
  // Spring animations
  spring: 'spring 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  springFast: 'spring 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// Component-specific tokens
export const componentTokens = {
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0 0.75rem',
      md: '0 1.25rem',
      lg: '0 1.5rem',
      xl: '0 2rem',
    },
    fontSize: {
      sm: '0.8125rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
    },
    borderRadius: '0.75rem', // 12px
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: '0 1rem',
    fontSize: '0.875rem',
    borderRadius: '0.75rem',
  },
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: '1rem', // 16px
    gap: '1rem',
  },
  modal: {
    maxWidth: {
      sm: '24rem',
      md: '32rem',
      lg: '48rem',
      xl: '64rem',
      full: 'calc(100% - 2rem)',
    },
    borderRadius: '1.5rem', // 24px
  },
  tooltip: {
    maxWidth: '16rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '0.5rem',
    gap: '0.375rem',
  },
  dropdown: {
    minWidth: '12rem',
    maxWidth: '24rem',
    padding: '0.5rem',
    borderRadius: '0.75rem',
    itemPadding: '0.5rem 0.75rem',
    itemFontSize: '0.875rem',
  },
  avatar: {
    size: {
      xs: '1.5rem',   // 24px
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
      xl: '4rem',     // 64px
      '2xl': '5rem',  // 80px
    },
  },
  badge: {
    height: '1.25rem',
    padding: '0 0.5rem',
    fontSize: '0.6875rem',
    fontWeight: '600',
    borderRadius: '9999px',
  },
} as const;

// Export all tokens as a single object for easy importing
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  container,
  keyframes,
  animation,
  componentTokens,
} as const;

export type Tokens = typeof tokens;
export type ColorScale = keyof typeof colors.sakura;
export type SemanticColor = keyof typeof colors.success;
export type Spacing = keyof typeof spacing;
export type FontSize = keyof typeof typography.fontSize;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Transition = keyof typeof transitions;
export type ZIndex = keyof typeof zIndex;
export type Breakpoint = keyof typeof breakpoints;