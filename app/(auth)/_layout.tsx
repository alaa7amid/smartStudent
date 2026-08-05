import { Stack } from 'expo-router'
import { useThemeColors } from '@/hooks/use-theme-colors'

export default function AuthLayout() {
  const colors = useThemeColors()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="grade-stage" />
      <Stack.Screen name="guardian-consent" />
    </Stack>
  )
}
