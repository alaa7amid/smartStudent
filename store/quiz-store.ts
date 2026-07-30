import { create } from 'zustand'
import type { QuizReady } from '@/services/quiz'

interface QuizState {
  currentQuiz: QuizReady | null
  setCurrentQuiz: (quiz: QuizReady) => void
}

// اختبار الديمو الحالي فقط — مؤقّت بالذاكرة، بدون persist. لما تنضاف الحسابات
// (المرحلة 2) هذا يترقّى لحفظ فعلي بـ AsyncStorage + ربط بالسيرفر (FR-9).
export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
}))
