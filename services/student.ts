import { api } from '@/lib/api'

// FR-2 — المراحل الدراسية العراقية. الترتيب هنا هو ترتيب العرض بالواجهة.
export const GRADE_STAGES = [
  'grade6_primary',
  'grade1_intermediate',
  'grade2_intermediate',
  'grade3_intermediate',
  'grade4_secondary',
  'grade5_secondary_scientific',
  'grade5_secondary_literary',
  'grade6_secondary_scientific',
  'grade6_secondary_literary',
] as const

export type GradeStage = (typeof GRADE_STAGES)[number]
export type StageType = 'finished' | 'unfinished'

export interface StudentProfile {
  id: string
  phone: string
  gradeStage: GradeStage | null
  stageType: StageType | null
  guardianPhone: string | null
  hasGuardianConsent: boolean
  currentStreak: number
  bonusQuizzes: number
  quizCount: number
}

export async function fetchProfile(): Promise<StudentProfile> {
  const { data } = await api.get<{ status: string; student: StudentProfile }>('/students/me')
  return data.student
}

export async function setGradeStage(gradeStage: GradeStage) {
  const { data } = await api.patch<{ status: string; gradeStage: GradeStage; stageType: StageType }>(
    '/students/me/grade-stage',
    { gradeStage },
  )
  return data
}

// FR-3 — موافقة ولي الأمر (إلزامية، المستخدمون قاصرون).
export async function submitGuardianConsent(guardianPhone?: string) {
  const { data } = await api.post<{ status: string }>('/students/me/guardian-consent', {
    consented: true,
    ...(guardianPhone ? { guardianPhone } : {}),
  })
  return data
}

export interface SavedQuizSummary {
  id: string
  subject: string | null
  createdAt: string
  questionCount: number
  lastScore: number | null
  lastTotal: number | null
}

export async function fetchMyQuizzes(): Promise<SavedQuizSummary[]> {
  const { data } = await api.get<{ status: string; quizzes: SavedQuizSummary[] }>('/students/me/quizzes')
  return data.quizzes
}

// FR-4 — ربط اختبار الديمو بالحساب بعد التسجيل حتى ما تضيع أول تجربة.
export async function linkQuizToAccount(quizId: string) {
  const { data } = await api.post<{ status: string }>(`/quiz/${quizId}/link-account`)
  return data
}

// FR-17 — كود الدعوة الخاص بالطالب.
export async function fetchReferralCode(): Promise<string> {
  const { data } = await api.get<{ status: string; code: string }>('/students/me/referral-code')
  return data.code
}

export interface RedeemReferralSuccess {
  status: 'ok'
  bonusQuizzes: number
}

export interface RedeemReferralFailure {
  status: 'invalid_code' | 'self_use' | 'already_used' | 'invalid_input' | 'failed'
  message: string
}

export async function redeemReferral(code: string): Promise<RedeemReferralSuccess | RedeemReferralFailure> {
  const { data } = await api.post<RedeemReferralSuccess | RedeemReferralFailure>('/referrals/redeem', { code })
  return data
}
