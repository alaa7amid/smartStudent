import { useColorScheme } from 'react-native'
import { Colors, type ThemeColors } from '@/constants/Colors'
import { useThemeStore } from '@/store/theme-store'

export function useThemeColors(): ThemeColors {
  const preference = useThemeStore((s) => s.preference)
  // RN 0.86's ColorSchemeName includes 'unspecified' — treat anything
  // that isn't an explicit 'dark' as light.
  const osScheme = useColorScheme() === 'dark' ? 'dark' : 'light'
  // 'system' defers to the OS; 'light'/'dark' force a scheme.
  const scheme = preference === 'system' ? osScheme : preference
  return Colors[scheme]
}
