import { z } from 'zod'

// هذي المخطّطات مطابقة حرفياً لأنواع الفرونت في services/quiz.ts.
// لو غيّرت شكل الرد، غيّره هناك وهنا معاً حتى يبقى الطرفان متوافقين.

export const quizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq', 'true_false', 'fill_blank', 'short_answer']),
  prompt: z.string(),
  options: z.array(z.string()).nullable(),
  status: z.enum(['ok', 'unreadable']),
})

export const quizReadySchema = z.object({
  status: z.literal('ready'),
  subject: z.string().nullable(),
  questions: z.array(quizQuestionSchema),
  modelUsed: z.string(),
  escalated: z.boolean(),
})

export const quizUnreadableSchema = z.object({
  status: z.literal('unreadable'),
  modelUsed: z.string(),
  escalated: z.boolean(),
})

export const quizFailureSchema = z.object({
  status: z.enum(['failed_upload', 'failed_ai', 'invalid_json']),
  message: z.string(),
})

export const generateQuizResponseSchema = z.union([
  quizReadySchema,
  quizUnreadableSchema,
  quizFailureSchema,
])

export type QuizQuestion = z.infer<typeof quizQuestionSchema>
export type QuizReady = z.infer<typeof quizReadySchema>
export type GenerateQuizResponse = z.infer<typeof generateQuizResponseSchema>

// جسم طلب المسار النصي (FR-7.1 المستوى 3): الطالب يكتب النص يدوياً.
export const generateFromTextBodySchema = z.object({
  text: z.string().min(3),
})
