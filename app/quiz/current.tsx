import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { useQuizStore } from '@/store/quiz-store'
import type { QuizQuestion } from '@/services/quiz'

// عرض تفاعلي (FR-9) لاختبار الديمو الحالي بالمتجر. التصحيح (FR-10) يجي
// بالمرحلة 2 مع الحسابات — هنا بس تسجيل الإجابات وعرضها.
export default function CurrentQuizScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const quiz = useQuizStore((s) => s.currentQuiz)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!quiz) router.replace('/capture')
  }, [quiz, router])

  if (!quiz) return null

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  if (submitted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: Spacing.xl,
          paddingTop: insets.top + Spacing.xl,
          justifyContent: 'center',
          alignItems: 'center',
          gap: Spacing.md,
        }}
      >
        <Text style={{ ...Typography['heading-lg'], color: colors.text, textAlign: 'center' }}>
          {t('quiz.submittedTitle')}
        </Text>
        <Text style={{ ...Typography.body, color: colors.subtle, textAlign: 'center' }}>
          {t('quiz.submittedBody')}
        </Text>
        <View style={{ height: Spacing.lg }} />
        <TouchableOpacity
          onPress={() => router.replace('/capture')}
          style={{
            backgroundColor: colors.tint,
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.xl,
            borderRadius: 16,
            borderCurve: 'continuous',
          }}
        >
          <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('quiz.startNew')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('quiz.title')}</Text>

      {quiz.questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          total={quiz.questions.length}
          value={answers[question.id]}
          onChange={(value) => setAnswer(question.id, value)}
          colors={colors}
        />
      ))}

      <TouchableOpacity
        onPress={() => setSubmitted(true)}
        style={{
          backgroundColor: colors.tint,
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          borderRadius: 16,
          borderCurve: 'continuous',
          alignItems: 'center',
          marginTop: Spacing.md,
        }}
      >
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('quiz.submit')}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function QuestionCard({
  question,
  index,
  total,
  value,
  onChange,
  colors,
}: {
  question: QuizQuestion
  index: number
  total: number
  value: string | undefined
  onChange: (value: string) => void
  colors: ReturnType<typeof useThemeColors>
}) {
  const { t } = useTranslation()

  return (
    <View
      style={{
        gap: Spacing.sm,
        backgroundColor: colors.cardElevated,
        padding: Spacing.lg,
        borderRadius: 16,
        borderCurve: 'continuous',
      }}
    >
      <Text style={{ ...Typography.caption, color: colors.subtle }}>
        {t('quiz.questionOf', { current: index + 1, total })}
      </Text>
      <Text style={{ ...Typography['body-md'], color: colors.text }}>{question.prompt}</Text>

      {question.status === 'unreadable' ? (
        <Text style={{ ...Typography.caption, color: colors.destructive }}>
          {t('quiz.unreadableQuestion')}
        </Text>
      ) : question.type === 'mcq' && question.options ? (
        <View style={{ gap: Spacing.sm }}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              style={{
                borderWidth: 1,
                borderColor: value === option ? colors.tint : colors.border,
                backgroundColor: value === option ? colors.tint : colors.surface,
                borderRadius: 10,
                borderCurve: 'continuous',
                padding: Spacing.md,
              }}
            >
              <Text style={{ ...Typography.body, color: value === option ? colors.onTint : colors.text }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : question.type === 'true_false' ? (
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {(['true', 'false'] as const).map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(opt)}
              style={{
                flex: 1,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: value === opt ? colors.tint : colors.border,
                backgroundColor: value === opt ? colors.tint : colors.surface,
                borderRadius: 10,
                borderCurve: 'continuous',
                padding: Spacing.md,
              }}
            >
              <Text style={{ ...Typography.body, color: value === opt ? colors.onTint : colors.text }}>
                {t(`quiz.${opt}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TextInput
          value={value ?? ''}
          onChangeText={onChange}
          placeholder={t('quiz.shortAnswerPlaceholder')}
          placeholderTextColor={colors.subtle}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            borderCurve: 'continuous',
            padding: Spacing.md,
            color: colors.text,
            backgroundColor: colors.surface,
            ...Typography.body,
          }}
        />
      )}
    </View>
  )
}
