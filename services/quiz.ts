import { api } from '@/lib/api'

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'true_false' | 'fill_blank' | 'short_answer'
  prompt: string
  options: string[] | null
  status: 'ok' | 'unreadable'
}

export interface QuizReady {
  status: 'ready'
  quizId: string
  subject: string | null
  questions: QuizQuestion[]
  modelUsed: string
  escalated: boolean
}

export interface QuizUnreadable {
  status: 'unreadable'
  modelUsed: string
  escalated: boolean
}

export interface QuizFailure {
  status: 'failed_upload' | 'failed_ai' | 'invalid_json'
  message: string
}

export type GenerateQuizResponse = QuizReady | QuizUnreadable | QuizFailure

// FR-5, FR-6, FR-7 — يرفع صورة/PDF ويرجّع اختبار مولَّد. imageUri من
// expo-image-picker (كاميرا أو معرض).
export async function generateQuiz(imageUri: string): Promise<GenerateQuizResponse> {
  const formData = new FormData()
  formData.append('file', {
    uri: imageUri,
    name: 'page.jpg',
    type: 'image/jpeg',
  } as unknown as Blob)

  const { data } = await api.post<GenerateQuizResponse>('/quiz/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// FR-7.1 (المستوى 3) — ملاذ أخير لما الخط يفشل مرتين: الطالب يكتب النص يدوياً.
export async function generateQuizFromText(text: string): Promise<GenerateQuizResponse> {
  const { data } = await api.post<GenerateQuizResponse>('/quiz/generate-from-text', { text })
  return data
}

export interface QuestionResult {
  questionId: string
  correct: boolean
  correctAnswer: string
  studentAnswer: string
}

export interface GradeQuizSuccess {
  status: 'graded'
  score: number
  total: number
  perQuestion: QuestionResult[]
  sosNotes: string[] // FR-12 — يمتلئ فقط عند درجة < 5/10
  currentStreak: number | null // FR-16 — null للطلاب غير المسجَّلين
}

export interface GradeQuizFailure {
  status: 'invalid_input' | 'not_found' | 'failed_ai'
  message: string
}

export type GradeQuizResponse = GradeQuizSuccess | GradeQuizFailure

// FR-10 — التصحيح المقيّد بالمصدر. answers مفاتيحها questionId.
export async function gradeQuiz(
  quizId: string,
  answers: Record<string, string>,
): Promise<GradeQuizResponse> {
  const { data } = await api.post<GradeQuizResponse>(`/quiz/${quizId}/grade`, { answers })
  return data
}
