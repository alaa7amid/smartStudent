import { Router } from 'express'
import multer from 'multer'
import { buildMockQuiz } from '../mock/quiz-data.js'
import { generateFromTextBodySchema } from '../schemas/quiz.js'

// نخزّن الصورة في الذاكرة فقط — في مرحلة الموك ما نحتاج نحفظها على القرص.
// حد أقصى 15MB يكفي لصورة صفحة من كاميرا الجوال.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

export const quizRouter = Router()

// FR-5/6/7 — يستقبل صورة الصفحة (multipart/form-data، الحقل اسمه "file"
// مطابق لـ services/quiz.ts) ويرجّع اختباراً مولَّداً. حالياً موك.
quizRouter.post('/generate', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'failed_upload',
      message: 'لم يتم استلام أي صورة. حاول التقاط الصورة من جديد.',
    })
  }

  // محاكاة زمن معالجة الذكاء الاصطناعي (NFR-1) حتى تظهر شاشة "جاري التوليد".
  setTimeout(() => {
    res.json(buildMockQuiz())
  }, 1500)
})

// FR-7.1 (المستوى 3) — الملاذ النصي الأخير لما يفشل قراءة الصورة مرتين.
quizRouter.post('/generate-from-text', (req, res) => {
  const parsed = generateFromTextBodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      status: 'failed_ai',
      message: 'النص المُدخل قصير جداً. اكتب فقرة من الملزمة على الأقل.',
    })
  }

  setTimeout(() => {
    res.json(buildMockQuiz())
  }, 1500)
})
