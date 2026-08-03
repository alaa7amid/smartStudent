import express from 'express'
import cors from 'cors'
import { quizRouter } from './routes/quiz.js'

const app = express()
const PORT = Number(process.env.PORT ?? 3000)

// CORS مفتوح — في مرحلة التطوير الفرونت يوصل عبر tunnel من عنوان متغيّر.
app.use(cors())
app.use(express.json())

// فحص صحّة سريع: افتح http://localhost:3000/ في المتصفّح للتأكد أن السيرفر حيّ.
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'smartflow-server', mode: 'mock' })
})

// كل مسارات الاختبار تحت /quiz — مطابق لـ services/quiz.ts في الفرونت.
app.use('/quiz', quizRouter)

app.listen(PORT, () => {
  console.log(`SmartFlow server (mock) → http://localhost:${PORT}`)
})
