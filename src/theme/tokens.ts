import { Platform, useWindowDimensions } from 'react-native';

export const COLORS = {
  // Core Brand Palette
  emerald: '#0A3622',
  emeraldDeep: '#062416',
  emeraldLight: '#124D31',
  emeraldMid: '#0E4A2F',
  ivory: '#FAF8F5',
  ivoryWarm: '#F3EFE7',
  ivoryCard: '#FFFFFF',
  obsidian: '#141414',
  obsidianSoft: '#1E1E1E',
  obsidianCard: '#1A1A1A',
  gold: '#C5A059',
  goldBright: '#DFBE78',
  goldLight: '#E8D4A2',
  goldMuted: 'rgba(197, 160, 89, 0.22)',
  goldBorder: 'rgba(197, 160, 89, 0.42)',
  goldSubtle: 'rgba(197, 160, 89, 0.12)',

  // Text & Neutrals
  textPrimary: '#141414',
  textSecondary: '#4A463F',
  textMuted: '#787167',
  textOnDark: '#FAF8F5',
  textOnDarkMuted: '#C7C1B5',

  // Borders & Semantic
  borderSubtle: '#E6DFD3',
  borderEmerald: 'rgba(10, 54, 34, 0.16)',
  success: '#0E5C38',
  successSoft: '#E8F3EC',
  warning: '#9A6F21',

  // New luxury accents
  roseTint: '#F5E6E0',
  platinumSheen: 'rgba(255,255,255,0.06)',
} as const;

export const FONTS = {
  serifDisplay: Platform.select({
    ios: 'Cinzel_600SemiBold',
    android: 'Cinzel_600SemiBold',
    default: 'Cinzel_600SemiBold',
  }),
  serifBold: 'Cinzel_700Bold',
  serifEditorial: 'PlayfairDisplay_600SemiBold',
  serifEditorialItalic: 'PlayfairDisplay_500Medium_Italic',
  sansRegular: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemiBold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#0A1F14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 5,
  },
  cardElevated: {
    shadowColor: '#0A1F14',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 7,
  },
  luxuryDark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 10,
  },
  goldGlow: {
    shadowColor: '#C5A059',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  subtle: {
    shadowColor: '#0A1F14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const RADII = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/**
 * Responsive sizing helper adapting typography, padding, and card density
 * across all smartphone dimensions (iPhone SE/mini, standard, Pro Max, Android compact to large).
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 375 || height < 700;
  const isLarge = width >= 414;
  const maxContentWidth = Math.min(width, 540);
  const horizontalPadding = isCompact ? 14 : isLarge ? 22 : 18;

  const scaleFont = (size: number) => {
    if (isCompact) return Math.round(size * 0.92);
    if (isLarge) return Math.round(size * 1.04);
    return size;
  };

  return {
    width,
    height,
    isCompact,
    isLarge,
    maxContentWidth,
    horizontalPadding,
    scaleFont,
  };
}
