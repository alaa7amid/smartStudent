import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { ScoreCard } from '@/components/quiz/score-card'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { useQuizStore } from '@/store/quiz-store'
import { gradeQuiz, type QuizQuestion, type QuestionResult } from '@/services/quiz'

// عرض تفاعلي (FR-9) + تصحيح حقيقي مقيّد بالمصدر (FR-10) لاختبار الديمو الحالي.
export default function CurrentQuizScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const quiz = useQuizStore((s) => s.currentQuiz)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const scoreCardRef = useRef<View>(null)

  const gradeMutation = useMutation({
    mutationFn: () => gradeQuiz(quiz!.quizId, answers),
    onError: () => setErrorMessage(t('common.networkError')),
  })

  // FR-15 — يلتقط كرت النتيجة كصورة ويفتح قائمة المشاركة النيتف.
  const shareMutation = useMutation({
    mutationFn: async () => {
      if (!(await Sharing.isAvailableAsync())) throw new Error('sharing unavailable')
      const uri = await captureRef(scoreCardRef, { format: 'png', quality: 1 })
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('scoreCard.share') })
    },
    onError: () => setErrorMessage(t('scoreCard.shareFailed')),
  })

  useEffect(() => {
    if (!quiz) router.replace('/capture')
  }, [quiz, router])

  if (!quiz) return null

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const result = gradeMutation.data

  if (result) {
    if (result.status !== 'graded') {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            padding: Spacing.xl,
            paddingTop: insets.top + Spacing.xl,
            justifyContent: 'center',
            gap: Spacing.md,
          }}
        >
          <Text style={{ ...Typography['heading-sm'], color: colors.destructive }}>{result.message}</Text>
        </View>
      )
    }

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
      >
        <ScoreCard ref={scoreCardRef} score={result.score} total={result.total} subject={quiz.subject} />

        <TouchableOpacity
          onPress={() => {
            setErrorMessage(null)
            shareMutation.mutate()
          }}
          disabled={shareMutation.isPending}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
            backgroundColor: colors.secondary,
            paddingVertical: Spacing.lg,
            borderRadius: 16,
            borderCurve: 'continuous',
          }}
        >
          {shareMutation.isPending
            ? <ActivityIndicator color={colors.onSecondary} />
            : <Icon name="share-social" size={20} color={colors.onSecondary} />}
          <Text style={{ ...Typography['body-md'], color: colors.onSecondary }}>
            {t('scoreCard.share')}
          </Text>
        </TouchableOpacity>

        {result.currentStreak != null && result.currentStreak > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.sm,
              backgroundColor: colors.cardElevated,
              borderRadius: 14,
              borderCurve: 'continuous',
              padding: Spacing.md,
            }}
          >
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={{ ...Typography.body, color: colors.text }}>
              {t('quiz.streakCount', { count: result.currentStreak })}
            </Text>
          </View>
        )}

        {result.sosNotes.length > 0 && <SosCard notes={result.sosNotes} colors={colors} t={t} />}

        {errorMessage && (
          <Text style={{ ...Typography.caption, color: colors.destructive }}>{errorMessage}</Text>
        )}

        <Text style={{ ...Typography['heading-sm'], color: colors.text, marginTop: Spacing.md }}>
          {t('quiz.reviewTitle')}
        </Text>

        {result.perQuestion.map((r, i) => {
          const question = quiz.questions.find((q) => q.id === r.questionId)
          if (!question) return null
          return <ResultCard key={r.questionId} index={i} question={question} result={r} colors={colors} t={t} />
        })}

        <TouchableOpacity
          onPress={() => router.replace('/capture')}
          style={{
            backgroundColor: colors.tint,
            paddingVertical: Spacing.lg,
            borderRadius: 16,
            borderCurve: 'continuous',
            alignItems: 'center',
            marginTop: Spacing.md,
          }}
        >
          <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('quiz.startNew')}</Text>
        </TouchableOpacity>
      </ScrollView>
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

      {errorMessage && (
        <Text style={{ ...Typography.caption, color: colors.destructive }}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        onPress={() => {
          setErrorMessage(null)
          gradeMutation.mutate()
        }}
        disabled={gradeMutation.isPending}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          backgroundColor: gradeMutation.isPending ? colors.muted : colors.tint,
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          borderRadius: 16,
          borderCurve: 'continuous',
          marginTop: Spacing.md,
        }}
      >
        {gradeMutation.isPending && <ActivityIndicator color={colors.onTint} />}
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
          {gradeMutation.isPending ? t('quiz.grading') : t('quiz.submit')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

// FR-12 — SOS Micro-Notes: تظهر تلقائياً عند درجة < 5/10، مبنية حصراً على
// الأسئلة اللي غلط فيها الطالب (مو معرفة عامة).
function SosCard({
  notes,
  colors,
  t,
}: {
  notes: string[]
  colors: ReturnType<typeof useThemeColors>
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  return (
    <View
      style={{
        gap: Spacing.md,
        backgroundColor: colors.cardElevated,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 20,
        borderCurve: 'continuous',
        padding: Spacing.lg,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Icon name="bulb" size={20} color={colors.secondary} />
        <Text style={{ ...Typography['heading-sm'], color: colors.text }}>{t('quiz.sosTitle')}</Text>
      </View>
      <Text style={{ ...Typography.caption, color: colors.subtle }}>{t('quiz.sosSubtitle')}</Text>

      {notes.map((note, i) => (
        <View key={note} style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.secondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ ...Typography['caption-sm'], color: colors.onSecondary }}>{i + 1}</Text>
          </View>
          <Text style={{ ...Typography.body, color: colors.text, flex: 1 }}>{note}</Text>
        </View>
      ))}
    </View>
  )
}

function ResultCard({
  index,
  question,
  result,
  colors,
  t,
}: {
  index: number
  question: QuizQuestion
  result: QuestionResult
  colors: ReturnType<typeof useThemeColors>
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  return (
    <View
      style={{
        gap: Spacing.sm,
        backgroundColor: colors.cardElevated,
        borderWidth: 1,
        borderColor: result.correct ? colors.tint : colors.destructive,
        padding: Spacing.lg,
        borderRadius: 16,
        borderCurve: 'continuous',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <Icon
          name={result.correct ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={result.correct ? colors.tint : colors.destructive}
        />
        <Text style={{ ...Typography.caption, color: colors.subtle }}>
          {t('quiz.questionOf', { current: index + 1, total: '' })}
        </Text>
      </View>
      <Text style={{ ...Typography['body-md'], color: colors.text }}>{question.prompt}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>
        {t('quiz.yourAnswer')}: {result.studentAnswer || t('quiz.noAnswer')}
      </Text>
      {!result.correct && (
        <Text style={{ ...Typography.body, color: colors.tint }}>
          {t('quiz.correctAnswer')}: {result.correctAnswer}
        </Text>
      )}
    </View>
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
