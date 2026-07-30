// Replace these with your project's brand palette.
// Keep the same shape (light/dark schemes, same field names) so consumers don't change.

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FAFAFA',
    tint: '#007AFF',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#007AFF',
    card: '#F0F0F0',
    border: '#E0E0E0',
    secondary: '#2C2C2E',
    subtle: '#8E8E93',
    surface: '#FFFFFF',
    cardElevated: '#F5F5F7',
    destructive: '#FF3B30',
    muted: '#C7C7CC',
    onTint: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#0A84FF',
    tabIconDefault: '#636366',
    tabIconSelected: '#0A84FF',
    card: '#1A1A1E',
    border: '#2C2C30',
    secondary: '#F5F5F5',
    subtle: '#8E8E93',
    surface: '#1E1E1E',
    cardElevated: '#141416',
    destructive: '#FF453A',
    muted: '#3A3A3C',
    onTint: '#FFFFFF',
  },
} as const

export type ThemeColors = typeof Colors.light | typeof Colors.dark
