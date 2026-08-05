import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { useAuthStore } from '@/store/auth-store'
import { useQuizStore } from '@/store/quiz-store'
import { fetchMyQuizzes, type SavedQuizSummary } from '@/services/student'

// FR-9 — أرشيف الاختبارات المحفوظة بالحساب. الزائر (بلا تسجيل) يشوف بس آخر
// اختبار ديمو بالذاكرة، مع دعوة للتسجيل حتى يُحفظ فعلياً.
export default function MyQuizzesScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const student = useAuthStore((s) => s.student)
  const demoQuiz = useQuizStore((s) => s.currentQuiz)

  const quizzesQuery = useQuery({
    queryKey: ['my-quizzes'],
    queryFn: fetchMyQuizzes,
    enabled: student != null,
  })

  const savedQuizzes = quizzesQuery.data ?? []

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('myQuizzes.title')}</Text>

      {student && quizzesQuery.isPending ? (
        <ActivityIndicator color={colors.tint} style={{ marginTop: Spacing.xl }} />
      ) : savedQuizzes.length > 0 ? (
        <View style={{ gap: Spacing.sm }}>
          {savedQuizzes.map((quiz) => (
            <SavedQuizCard key={quiz.id} quiz={quiz} colors={colors} t={t} />
          ))}
        </View>
      ) : demoQuiz ? (
        <View style={{ gap: Spacing.md }}>
          <TouchableOpacity
            onPress={() => router.push('/quiz/current')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              backgroundColor: colors.cardElevated,
              borderRadius: 16,
              borderCurve: 'continuous',
              padding: Spacing.lg,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.tint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="document-text" size={20} color={colors.onTint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...Typography['body-md'], color: colors.text }}>
                {t('myQuizzes.lastGenerated')}
              </Text>
              <Text style={{ ...Typography.caption, color: colors.subtle }}>
                {t('myQuizzes.questionsCount', { count: demoQuiz.questions.length })}
                {demoQuiz.subject ? ` • ${demoQuiz.subject}` : ''}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.subtle} />
          </TouchableOpacity>

          {!student && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/phone')}
              style={{
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.tint,
                borderRadius: 14,
                borderCurve: 'continuous',
                paddingVertical: Spacing.md,
              }}
            >
              <Text style={{ ...Typography['body-md'], color: colors.tint }}>
                {t('myQuizzes.signUpToSave')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.cardElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="document-text-outline" size={32} color={colors.subtle} />
          </View>
          <Text style={{ ...Typography['heading-sm'], color: colors.text, textAlign: 'center' }}>
            {t('myQuizzes.emptyTitle')}
          </Text>
          <Text style={{ ...Typography.body, color: colors.subtle, textAlign: 'center' }}>
            {t('myQuizzes.emptyBody')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/capture')}
            style={{
              marginTop: Spacing.md,
              backgroundColor: colors.tint,
              paddingVertical: Spacing.md,
              paddingHorizontal: Spacing.xl,
              borderRadius: 16,
              borderCurve: 'continuous',
            }}
          >
            <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
              {t('myQuizzes.captureNow')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

function SavedQuizCard({
  quiz,
  colors,
  t,
}: {
  quiz: SavedQuizSummary
  colors: ReturnType<typeof useThemeColors>
  t: (key: string, opts?: Record<string, unknown>) => string
}) {
  const graded = quiz.lastScore != null && quiz.lastTotal != null

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: colors.cardElevated,
        borderRadius: 16,
        borderCurve: 'continuous',
        padding: Spacing.lg,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.tint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="document-text" size={20} color={colors.onTint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ ...Typography['body-md'], color: colors.text }}>
          {quiz.subject ?? t('myQuizzes.untitledQuiz')}
        </Text>
        <Text style={{ ...Typography.caption, color: colors.subtle }}>
          {t('myQuizzes.questionsCount', { count: quiz.questionCount })}
        </Text>
      </View>
      {graded && (
        <Text
          style={{
            ...Typography['body-md'],
            color: colors.tint,
            fontVariant: ['tabular-nums'],
          }}
        >
          {quiz.lastScore}/{quiz.lastTotal}
        </Text>
      )}
    </View>
  )
}
