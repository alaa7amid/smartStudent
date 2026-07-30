# ⚙️ SmartFlow — متطلبات البناء التقنية الكاملة (Full Technical Requirements)

**الإصدار:** 1.0
**التاريخ:** 2026-07-30
**النطاق:** هذا المستند = *كيف نبني كل شي* — Frontend + Backend + قاعدة البيانات + الخدمات الخارجية + البيئة. تفصيل تنفيذي لما حدّدته SmartFlow-SRS-v1.md (الـ FR/NFR) وSmartFlow-Implementation-Plan.md (المراحل).
**لا يكرر:** الـ *ليش* (PRD) ولا معايير القبول التفصيلية لكل ميزة (SRS) — راجعهم مباشرة، هذا المستند يربط كل FR بـ **شنو بالضبط نبنيه تقنياً**.

---

## 0. البنية العامة (Architecture Overview)

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────────┐
│   Mobile App         │  HTTPS │   Backend API         │  SQL   │   PostgreSQL          │
│   (Expo/React Native)│◄──────►│   (Fastify/Node.js)   │◄──────►│   (عبر Supabase)      │
└─────────────────────┘        └──────────┬────────────┘        └─────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┬───────────────────┐
                    ▼                      ▼                      ▼                    ▼
            ┌──────────────┐      ┌───────────────┐      ┌───────────────┐   ┌─────────────────┐
            │ OpenAI API   │      │ Supabase       │      │ Twilio         │   │ Expo Push        │
            │ (GPT-5 mini/ │      │ Storage        │      │ (WhatsApp/SMS  │   │ Service (FCM)    │
            │ كامل)        │      │ (صور/PDF)      │      │ OTP)           │   │                  │
            └──────────────┘      └───────────────┘      └───────────────┘   └─────────────────┘
                                                                    +
                                                          Qi Card Payment Gateway
```

**3 مشاريع منفصلة (مستودعات Git مستقلة):**
1. **`smartStudent/`** (موجود) — تطبيق نيتف Expo/React Native.
2. **`smartflow-api/`** (يُنشأ) — Backend Fastify.
3. **قاعدة البيانات** — تُدار عبر Supabase (لا مستودع كود منفصل — لوحة تحكم + migrations بمجلد الـ Backend).

---

## 1. الفرونت اند (`smartStudent/`)

### 1.1 الحزمة التقنية (مثبَّتة أصلاً بالقالب)
React Native 0.86 / Expo SDK 57 / Expo Router / TypeScript strict / Zustand / TanStack Query / RHF+zod / i18next (عربي/RTL).

### 1.2 مكتبات إضافية يحتاجها المنتج (لسه غير مثبَّتة)

| المكتبة | الحاجة | مرتبطة بـ |
|---|---|---|
| `expo-camera` | تصوير صفحة الملزمة مباشرة | FR-5 |
| `expo-image-picker` | رفع من المعرض | FR-5 |
| `expo-document-picker` | رفع ملف PDF | FR-5 |
| `expo-notifications` | إشعارات Push (تذكير مراجعة/Streak) | FR-18 |
| `expo-speech` | قراءة صوتية (TTS) | FR-25 |
| `expo-screen-capture` | منع/كشف سكرين شوت على بنك الوزاري | NFR-4.1 |
| `expo-sharing` | مشاركة كرت النتيجة | FR-15 |
| `react-native-view-shot` | تحويل الشاشة لصورة (كرت النتيجة) | FR-15 |
| `expo-barcode-scanner` أو `expo-camera` (barcode API) | مسح باركود التفعيل | FR-22 |
| `date-fns` | حسابات Streak/تواريخ | FR-16 |

تُثبَّت بـ `npx expo install <pkg>` عند الحاجة الفعلية بكل مرحلة (لا تثبّت الكل دفعة وحدة — راجع Implementation Plan لتوزيعها حسب المراحل).

### 1.3 خريطة الشاشات (Routes) — Expo Router

> يستبدل هيكل التبويبات الحالي (`Home/Search/Notifications/Profile`) بما يطابق منتج SmartFlow فعلياً.

```
app/
├── _layout.tsx                      # Providers (Query, i18n, Auth gate)
├── (auth)/
│   ├── phone.tsx                    # إدخال رقم الهاتف — FR-1
│   ├── otp.tsx                      # تحقق OTP — FR-1
│   ├── guardian-consent.tsx         # موافقة ولي الأمر — FR-3
│   └── grade-stage.tsx              # اختيار المرحلة الدراسية — FR-2
├── (tabs)/
│   ├── _layout.tsx                  # PagerView: الرئيسية / اختباراتي / [بنك الوزاري] / حسابي
│   ├── index.tsx                    # الرئيسية: زر "صوّر ملزمتك" + بطاقة أداء + Streak
│   ├── my-quizzes.tsx                # أرشيف اختبارات الطالب
│   ├── ministry-bank.tsx             # بنك الوزاري — يظهر شرطياً (مراحل منتهية فقط) — FR-20
│   └── profile.tsx                   # الحساب + الاشتراك + دعوة صديق + إعدادات
├── capture/
│   └── index.tsx                    # كاميرا/رفع — FR-5، مسار الإنقاذ FR-7.1
├── quiz/
│   ├── [id].tsx                      # عرض الاختبار التفاعلي — FR-9
│   └── [id]/result.tsx               # النتيجة + SOS Notes + كرت المشاركة — FR-12, FR-15
├── mock-exam/
│   ├── [id].tsx                      # اختبار محاكاة بمؤقّت — FR-21
│   └── [id]/result.tsx
├── subscription/
│   ├── plans.tsx                     # اختيار الباقة (فردي/عائلي) — البند 14 بالـ PRD
│   ├── payment.tsx                   # Qi Card / COD — FR-22
│   └── barcode-scan.tsx              # مسح التفعيل
├── referral.tsx                      # دعوة صديق — FR-17
└── modal.tsx                         # (موجود أصلاً)
```

### 1.4 إدارة الحالة (Stores جديدة، بجانب `tab-store`/`theme-store` الموجودين)

| Store | المحتوى | Persist؟ |
|---|---|---|
| `store/auth-store.ts` | `token`, `student`, `hasHydrated` | ✅ `expo-secure-store` (حسّاس) |
| `store/quiz-store.ts` | حالة الاختبار الجاري حله (إجابات مؤقتة) | ✅ `AsyncStorage` (للعمل أوفلاين — FR-9) |
| `store/onboarding-store.ts` | حالة تجربة الديمو (اختبار قبل التسجيل) | ✅ `AsyncStorage` — يُربط بالحساب بعد التسجيل (FR-4) |

بيانات السيرفر (اختبارات محفوظة، أداء، اشتراك) عبر **TanStack Query** حصراً — لا Zustand.

### 1.5 متغيرات بيئة الفرونت اند (`.env.local`)

```
EXPO_PUBLIC_API_URL=              # رابط الـ Backend
EXPO_PUBLIC_QICARD_PUBLIC_KEY=    # إن وُجد مفتاح عام لواجهة الدفع
```

---

## 2. الباك اند (`smartflow-api/` — مشروع جديد)

### 2.1 الحزمة التقنية

| الطبقة | الاختيار | السبب |
|---|---|---|
| Framework | **Fastify** (Node.js + TypeScript) | محسوم بالـ PRD/SRS (بند 8) |
| ORM | **Prisma** | Migrations + Type-safety، مناسب لمطوّر سولو |
| رفع الملفات | `@fastify/multipart` | استقبال صورة/PDF |
| CORS | `@fastify/cors` | يسمح لطلبات التطبيق فقط |
| Auth | `@fastify/jwt` | توليد/تحقق جلسة بعد OTP |
| AI | `openai` (SDK الرسمي) | GPT-5 mini/كامل + Structured Outputs |
| معالجة صور | `sharp` | تباين/إضاءة/ضغط — FR-6 |
| تحقق شكل البيانات | `zod` | نفس مكتبة الفرونت اند |
| مهام مجدولة | `node-cron` | تقرير أهل أسبوعي (FR-19) + فحص ولاء (FR-14) |
| OTP (واتساب/SMS) | `twilio` | مزوّد موحّد لواتساب+SMS، أبسط لمطوّر سولو من Meta Cloud API مباشرة |
| تخزين ملفات | `@supabase/supabase-js` | رفع/حذف صور بـ Supabase Storage |
| Push | `expo-server-sdk` | إرسال إشعارات لتوكنات Expo — FR-18 |
| Logging | `pino` (مدمج بـ Fastify) | — |

### 2.2 هيكل المشروع

```
smartflow-api/
├── src/
│   ├── server.ts
│   ├── plugins/
│   │   ├── auth.ts                  # @fastify/jwt setup
│   │   ├── cors.ts
│   │   └── prisma.ts
│   ├── routes/
│   │   ├── auth.ts                  # FR-1, FR-2, FR-3
│   │   ├── quiz.ts                  # FR-5..FR-13
│   │   ├── mock-exam.ts             # FR-20, FR-21
│   │   ├── payments.ts              # FR-22
│   │   ├── referrals.ts             # FR-17
│   │   ├── devices.ts               # FR-18
│   │   └── admin.ts                 # FR-23
│   ├── services/
│   │   ├── openai.service.ts        # مصفوفة mini→كامل + Prompt Caching
│   │   ├── image.service.ts         # sharp preprocessing
│   │   ├── grading.service.ts       # Grounded Grading + تحقق رياضيات — FR-10, FR-11
│   │   ├── otp.service.ts           # توليد/إرسال/تحقق OTP عبر Twilio
│   │   ├── performance.service.ts   # avg_score/tests_count/Streak — FR-13, FR-16
│   │   ├── loyalty.service.ts       # فحص استحقاق 8/15/70% — FR-14
│   │   └── notifications.service.ts # Expo Push — FR-18
│   ├── jobs/
│   │   ├── weekly-parent-report.ts  # FR-19 (cron أسبوعي)
│   │   └── loyalty-check.ts         # FR-14 (cron عند اقتراب انتهاء الاشتراك)
│   ├── schemas/
│   │   └── quiz.schema.ts           # Zod schema — نفس شكل الاختبار (10 أسئلة)
│   ├── prompts/
│   │   └── quiz-system-prompt.ts    # System Prompt المخزَّن (Cached)
│   └── config/
│       ├── model-matrix.ts          # مصفوفة mini/كامل — البند 0.3 بالـ SRS
│       └── loyalty-thresholds.ts    # 8/15/70% كـ config قابل للضبط — NFR-6
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
└── package.json
```

### 2.3 قائمة الـ API الكاملة

| Endpoint | Method | الوصف | FR |
|---|---|---|---|
| `/auth/otp/request` | POST | إرسال OTP (واتساب أولاً، SMS احتياطي) | FR-1 |
| `/auth/otp/verify` | POST | تحقق الكود → إصدار JWT | FR-1 |
| `/auth/guardian-consent` | POST | تسجيل موافقة ولي الأمر بطابع زمني | FR-3 |
| `/students/me/grade-stage` | PATCH | تحديد/تعديل المرحلة الدراسية | FR-2 |
| `/students/me` | GET | بيانات الحساب | — |
| `/students/me` | DELETE | حذف الحساب والبيانات | NFR-4 |
| `/quiz/generate` | POST | رفع صورة/PDF → توليد اختبار (يقبل بدون تسجيل — Demo) | FR-4, FR-5, FR-6, FR-7, FR-8 |
| `/quiz/:id` | GET | جلب اختبار | — |
| `/quiz/:id/link-account` | POST | ربط اختبار Demo بالحساب بعد التسجيل | FR-4 |
| `/quiz/:id/attempt` | POST | إرسال إجابات الطالب | FR-9 |
| `/quiz/attempts/:id/grade` | POST | تصحيح Grounded + تحقق رياضيات | FR-10, FR-11 |
| `/quiz/attempts/:id` | GET | نتيجة + SOS Notes إن وُجدت | FR-12 |
| `/students/me/performance` | GET | avg_score / tests_count / Streak / بطاقة الأداء | FR-13, FR-16 |
| `/students/me/leaderboard` | GET | ترتيب أسبوعي داخلي (صف/مرحلة) | FR-14.1 |
| `/students/me/loyalty-status` | GET | حالة استحقاق كوبون الولاء | FR-14 |
| `/students/me/referral-code` | GET | كود الدعوة الخاص | FR-17 |
| `/referrals/redeem` | POST | تفعيل كود دعوة (للمدعوّ) | FR-17 |
| `/devices/register` | POST | تسجيل Expo Push Token | FR-18 |
| `/ministry/subjects` | GET | مواد بنك الوزاري (حسب المرحلة) | FR-20 |
| `/ministry/questions` | GET | فلترة حسب مادة/سنة | FR-20 |
| `/mock-exams/:id/start` | POST | بدء اختبار محاكاة (مؤقّت) | FR-21 |
| `/mock-exams/:id/submit` | POST | تسليم + تصحيح فوري | FR-21 |
| `/payments/initiate` | POST | بدء دفع (Qi Card/COD) | FR-22 |
| `/payments/qicard/webhook` | POST | تأكيد الدفع الإلكتروني من Qi Card | FR-22 |
| `/payments/activate-barcode` | POST | تفعيل اشتراك بالباركود | FR-22 |
| `/admin/subscriptions` | GET | إدارة الاشتراكات | FR-23 |
| `/admin/token-usage` | GET | كلفة التوكنز لكل مستخدم | FR-23, NFR-3 |
| `/admin/failure-rates` | GET | نسب `unreadable`/`failed_ai` | FR-23 |
| `/admin/loyalty-coupons` | GET | كوبونات الولاء الممنوحة | FR-23 |

### 2.4 المهام المجدولة (Cron Jobs)

| المهمة | التكرار | الوظيفة |
|---|---|---|
| `weekly-parent-report` | أسبوعياً | تلخيص أداء كل طالب + إرسال واتساب/SMS لولي الأمر — FR-19 |
| `loyalty-check` | يومياً (يفحص الاشتراكات المقتربة من الانتهاء) | فحص شروط 8/15/70% ومنح الكوبون — FR-14 |

### 2.5 متغيرات بيئة الباك اند (`.env`)

```
DATABASE_URL=                     # Supabase Postgres connection string
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=        # للتخزين (صور/PDF) — سري، سيرفر فقط
OPENAI_API_KEY=
JWT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
TWILIO_SMS_FROM=
QICARD_API_KEY=
QICARD_WEBHOOK_SECRET=
EXPO_ACCESS_TOKEN=                # لإرسال Push عبر expo-server-sdk
```

---

## 3. قاعدة البيانات (PostgreSQL عبر Supabase)

> نمط `jsonb` للحقول المرنة (أسئلة/إجابات) بدل تطبيع مفرط — يطابق قرار PRD بند 8، ومناسب لسرعة تطوير مطوّر سولو.

| الجدول | الأعمدة الأساسية | ملاحظات |
|---|---|---|
| **students** | `id, phone (unique), name, guardian_phone, guardian_consent_at, grade_stage, stage_type[منتهية/غير منتهية], avg_score, tests_count, current_streak, last_active_date, referral_code (unique), referred_by_id, deleted_at, created_at` | — |
| **otp_codes** | `id, phone, code_hash, channel[whatsapp/sms], expires_at, attempts, verified_at` | يُنظَّف دورياً |
| **quizzes** | `id, student_id (nullable — Demo قبل التسجيل), source_type[image/pdf], source_image_url, subject, grade_stage, status[uploaded/processing/ready/unreadable/failed_ai/invalid_json/abandoned], questions jsonb, model_used, created_at` | `source_image_url` يُحذف بعد التوليد (NFR-4) |
| **quiz_attempts** | `id, quiz_id, student_id, answers jsonb, score, status[graded/not_in_source/unreadable], sos_notes jsonb, graded_at, created_at` | — |
| **ministry_questions** | `id, subject, year, grade_stage, question jsonb, model_answer jsonb, created_at` | محتوى مُدقَّق يدوياً — FR-20 |
| **mock_exams** | `id, subject, year, grade_stage, duration_minutes, question_ids jsonb` | — |
| **mock_exam_attempts** | `id, student_id, mock_exam_id, answers jsonb, score, time_taken_seconds, created_at` | — |
| **subscriptions** | `id, student_id, plan[individual/family], price, status[active/expired], starts_at, expires_at, renewed_count, last_discount_percent` | — |
| **family_members** | `id, primary_student_id, member_student_id` | ربط الباكج العائلي |
| **payments** | `id, student_id, method[qicard/cod], amount, barcode_code (unique), barcode_used_at, status, created_at` | — |
| **loyalty_coupons** | `id, student_id, discount_percent[50/20], eligible_at, used_at, criteria_snapshot jsonb` | Snapshot للتدقيق لاحقاً |
| **referrals** | `id, referrer_id, referred_id, reward_granted_at` | — |
| **device_tokens** | `id, student_id, expo_push_token, platform, created_at` | — |
| **weekly_reports_log** | `id, student_id, sent_at, channel, content_snapshot` | سجل تدقيق الرسائل المرسلة |
| **token_usage_logs** | `id, student_id, endpoint, model, tokens_in, tokens_out, cost_usd, created_at` | NFR-3 — حرج لضبط الهامش |
| **admin_users** | `id, email, password_hash, role` | لوحة الأدمن |

**فهارس مهمة:** `students.phone`, `students.referral_code`, `payments.barcode_code`, `quizzes.student_id`, `quiz_attempts.quiz_id` — كلها unique/lookup متكرر.

---

## 4. الخدمات الخارجية (Third-Party Services)

| الخدمة | الاستخدام | ملاحظة |
|---|---|---|
| **OpenAI API** | GPT-5 mini/كامل — توليد وتصحيح | مفتاح API على الباك اند فقط، ممنوع بالفرونت اند |
| **Supabase** | PostgreSQL + Storage | مشروع Supabase واحد يخدم الاثنين |
| **Twilio** | OTP عبر واتساب + SMS احتياطي | يحتاج WhatsApp Business API approval — قد يأخذ وقت، يُبدأ مبكراً |
| **Qi Card** | الدفع الإلكتروني | يحتاج تكامل مع بوابتهم — تواصل تجاري منفصل عن الكود |
| **Expo Push Service** | إشعارات Push | مجاني، يحتاج فقط `expo-server-sdk` + Push Token |
| **Google Play Console** | نشر التطبيق | حساب مطوّر (رسوم تسجيل مرة وحدة) — يُبدأ بالمرحلة 3 |

---

## 5. الأمان ومتطلبات الحماية (ملخّص تنفيذي من NFR)

- كل استدعاء API (عدا `/auth/*` و`/quiz/generate` بحالة Demo) يتطلب JWT صالح.
- مفاتيح AI/Storage/Payment **على الباك اند فقط** — لا تُضمَّن بكود التطبيق أبداً.
- حذف/أرشفة الصور الخام فور توليد الاختبار (`quizzes.source_image_url` يُمسح من Storage بعد نجاح `status=ready`).
- Rate limiting على `/auth/otp/request` و`/quiz/generate` (منع إساءة الاستخدام والكلفة الزائدة — NFR-3).
- `expo-screen-capture` مفعَّل على شاشات بنك الوزاري فقط (`ministry-bank`, `mock-exam/*`).
- زر "حذف حسابي" (`DELETE /students/me`) يحذف فعلياً لا Soft-delete فقط للبيانات الحسّاسة (الصور محذوفة أصلاً؛ الإجابات/الدرجات تُجهَّل identifiers).

---

## 6. قائمة تحقق الجاهزية قبل أول سطر كود إنتاجي

- [ ] بوابة المرحلة 0 (REQ-0) اجتازت — جودة قراءة GPT-5 مثبَّتة.
- [ ] حساب OpenAI API بحد إنفاق (Billing limit) مفعَّل.
- [ ] مشروع Supabase جديد — DB + Storage bucket للصور.
- [ ] حساب Twilio + طلب WhatsApp Business API (يأخذ وقت مراجعة — يُبدأ مبكراً).
- [ ] `smartflow-api/` مُنشأ بهيكل القسم 2.2.
- [ ] `.env` بالفرونت اند والباك اند مُعبّأين (لا قيم افتراضية بالكود).
- [ ] Prisma schema أولي (`students`, `quizzes`, `quiz_attempts`) + أول migration.

---

*مرجع كامل: SmartFlow-PRD.md (لماذا) + SmartFlow-SRS-v1.md (متطلبات مفصّلة FR/NFR) + SmartFlow-Implementation-Plan.md (تسلسل المراحل). هذا المستند = التفصيل التقني الكامل لكل الثلاثة.*
