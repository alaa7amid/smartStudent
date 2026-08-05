import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store'

export type GradeStage = string
export type StageType = 'finished' | 'unfinished'

export interface AuthStudent {
  id: string
  phone: string
  // FR-2 — تُملأ بعد شاشة اختيار المرحلة. stageType يحدد ظهور بنك الوزاري.
  gradeStage?: GradeStage | null
  stageType?: StageType | null
}

interface AuthState {
  token: string | null
  student: AuthStudent | null
  hasHydrated: boolean
  setSession: (token: string, student: AuthStudent) => void
  setStudentStage: (gradeStage: GradeStage, stageType: StageType) => void
  clearSession: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

// expo-secure-store لا يطابق واجهة StateStorage الافتراضية (AsyncStorage) —
// هذا محوّل بسيط يربطه بـ zustand/persist. بيانات حسّاسة (توكن الجلسة) —
// راجع نمط "State Management" بالـ CLAUDE.md.
const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      student: null,
      hasHydrated: false,
      setSession: (token, student) => set({ token, student }),
      setStudentStage: (gradeStage, stageType) =>
        set((state) => (state.student ? { student: { ...state.student, gradeStage, stageType } } : state)),
      clearSession: () => set({ token: null, student: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ token: state.token, student: state.student }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
)
