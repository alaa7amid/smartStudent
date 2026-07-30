import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

// User's theme preference. 'system' defers to the OS colour scheme (the default);
// 'light'/'dark' force a scheme regardless of the device setting.
export type ThemePreference = 'system' | 'light' | 'dark'

interface ThemeStore {
  preference: ThemePreference
  hasHydrated: boolean
  setPreference: (preference: ThemePreference) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      preference: 'system',
      hasHydrated: false,
      setPreference: (preference) => set({ preference }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the preference; hasHydrated is runtime-only.
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
)
