import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import * as SplashScreen from 'expo-splash-screen'
import {
  useFonts,
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo'
import 'react-native-reanimated'
import i18n, { languageReady } from '@/i18n'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { useThemeStore } from '@/store/theme-store'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
})

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colors = useThemeColors()

  const [fontsLoaded] = useFonts({
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  })

  const [langReady, setLangReady] = useState(false)
  useEffect(() => {
    languageReady.then(() => setLangReady(true))
  }, [])

  // Gate on theme rehydration too, so the persisted light/dark preference is
  // applied before first paint (no flash of the wrong theme).
  const themeHydrated = useThemeStore((s) => s.hasHydrated)

  useEffect(() => {
    if (fontsLoaded && langReady && themeHydrated) SplashScreen.hideAsync()
  }, [fontsLoaded, langReady, themeHydrated])

  if (!fontsLoaded || !langReady || !themeHydrated)
    return <View style={{ flex: 1, backgroundColor: colors.background }} />

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
