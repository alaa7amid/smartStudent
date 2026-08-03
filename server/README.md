# SmartFlow Server (Mock)

باك-إند SmartFlow — يستقبل صورة صفحة ويرجّع اختباراً تفاعلياً.
**مرحلة الموك:** يرجّع اختباراً وهمياً ثابتاً بدون ذكاء اصطناعي ولا API key.

## التشغيل

```bash
cd server
npm install
npm run dev        # يشغّل على http://localhost:3000 مع إعادة تحميل تلقائي
```

تأكّد أنه حيّ: افتح <http://localhost:3000> — لازم يرجّع `{ ok: true }`.

## نقاط النهاية

| المسار | الوصف |
| --- | --- |
| `GET /` | فحص صحّة |
| `POST /quiz/generate` | يستقبل صورة (`multipart/form-data`، الحقل `file`) → اختبار |
| `POST /quiz/generate-from-text` | يستقبل `{ text }` → اختبار (الملاذ النصي) |

الردود مطابقة لأنواع الفرونت في [`../services/quiz.ts`](../services/quiz.ts).

## ربطه بالفرونت

في جذر المشروع، عدّل `.env`:

```
EXPO_PUBLIC_API_URL=http://<عنوان-السيرفر>:3000
```

- **محاكي/ويب:** `http://localhost:3000`
- **جوال حقيقي عبر Expo Go:** لازم عنوان يوصله الجوال (IP جهازك على الشبكة، أو نفق).

بعد تعديل `.env` أعد تشغيل سيرفر Expo حتى تُقرأ القيمة الجديدة.

## لاحقاً: ربط ذكاء اصطناعي حقيقي

استبدل `buildMockQuiz()` في [`src/routes/quiz.ts`](src/routes/quiz.ts) بدالة تقرأ `req.file.buffer`
وترسله لنموذج Vision، وتُرجّع نفس شكل `QuizReady`. المخطّطات في
[`src/schemas/quiz.ts`](src/schemas/quiz.ts) تضمن مطابقة الرد لما ينتظره الفرونت.
