import type { QuizReady } from '../schemas/quiz.js'

// اختبار وهمي يُرجَّع بدل نداء الذكاء الاصطناعي الحقيقي. لما نربط مزوّد AI
// لاحقاً، نستبدل هذا الملف بدالة تقرأ الصورة وتولّد الأسئلة — الشكل يبقى نفسه.
// أنواع الأسئلة الأربعة كلها ممثَّلة حتى نختبر عرض الفرونت كامل (quiz/current.tsx).
export function buildMockQuiz(): QuizReady {
  return {
    status: 'ready',
    subject: 'الفيزياء — قوانين نيوتن للحركة',
    modelUsed: 'mock-v1',
    escalated: false,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        prompt: 'ما مقدار القوة المحصّلة اللازمة لتسريع جسم كتلته 2 كجم بتسارع 5 م/ث²؟',
        options: ['10 نيوتن', '7 نيوتن', '2.5 نيوتن', '20 نيوتن'],
        status: 'ok',
      },
      {
        id: 'q2',
        type: 'true_false',
        prompt: 'ينص قانون نيوتن الأول على أن الجسم الساكن يبقى ساكناً ما لم تؤثّر عليه قوة خارجية.',
        options: null,
        status: 'ok',
      },
      {
        id: 'q3',
        type: 'fill_blank',
        prompt: 'وحدة قياس القوة في النظام الدولي هي ____.',
        options: null,
        status: 'ok',
      },
      {
        id: 'q4',
        type: 'short_answer',
        prompt: 'اذكر بكلماتك الخاصة نص قانون نيوتن الثالث للحركة.',
        options: null,
        status: 'ok',
      },
    ],
  }
}
