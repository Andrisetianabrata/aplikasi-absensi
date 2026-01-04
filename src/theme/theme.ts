import { Platform } from 'react-native';

export const COLORS = {
  primary: '#4338ca', // Deep Blue/Indigo
  background: '#F5F7FA', // Off-white/Light Gray
  card: '#FFFFFF',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    muted: '#94A3B8',
    light: '#FFFFFF',
  },
  status: {
    success: '#10B981', // Emerald Green
    danger: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue
  },
  border: '#E2E8F0',
  danger: {
    bg: '#FEF2F2',
    text: '#991B1B',
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const FONTS = {
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  } as const,
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  shadows: SHADOWS,
  fonts: FONTS,
};
