// هوية SmartFlow: "نشيط وشبابي" — بنفسجي أساسي + كهرماني للـ Streak/المكافآت.
// راجع SmartFlow-Tech-Requirements.md لو احتجت تغيّر الهوية لاحقاً.

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#FAFAFF',
    tint: '#6C5CE7',
    tabIconDefault: '#A8A5C4',
    tabIconSelected: '#6C5CE7',
    card: '#F5F4FB',
    border: '#E6E3F5',
    secondary: '#FFB020', // كهرماني — Streak، المكافآت، الاحتفاء بالدرجات
    onSecondary: '#1A1A2E', // نص/أيقونات فوق secondary — دائماً داكن (الكهرماني فاتح بالوضعين)
    subtle: '#6B6B85',
    surface: '#FFFFFF',
    cardElevated: '#F1EEFC',
    destructive: '#FF4D6D',
    muted: '#D9D6EC',
    onTint: '#FFFFFF',
  },
  dark: {
    text: '#F2F1FA',
    background: '#14121F',
    tint: '#7A6FF0',
    tabIconDefault: '#5F5A7A',
    tabIconSelected: '#7A6FF0',
    card: '#1E1B2E',
    border: '#2E2A45',
    secondary: '#FFC24D',
    onSecondary: '#1A1A2E',
    subtle: '#9490B0',
    surface: '#1C1929',
    cardElevated: '#241F38',
    destructive: '#FF6B85',
    muted: '#3A3552',
    onTint: '#FFFFFF',
  },
} as const

export type ThemeColors = typeof Colors.light | typeof Colors.dark
