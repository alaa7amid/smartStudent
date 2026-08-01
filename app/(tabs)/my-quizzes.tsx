import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { useQuizStore } from '@/store/quiz-store'

// المرحلة 1: بدون حسابات بعد، فما فيه أرشيف حقيقي — نعرض بس آخر اختبار
// بالذاكرة (quiz-store) وحالة فارغة صادقة. الأرشفة الفعلية تجي بالمرحلة 2 (FR-9).
export default function MyQuizzesScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const quiz = useQuizStore((s) => s.currentQuiz)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('myQuizzes.title')}</Text>

      {quiz ? (
        <View style={{ gap: Spacing.md }}>
          <TouchableOpacity
            onPress={() => router.push('/quiz/current')}
            style={{
              backgroundColor: colors.cardElevated,
              borderRadius: 16,
              borderCurve: 'continuous',
              padding: Spacing.lg,
              gap: Spacing.sm,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
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
                  {t('myQuizzes.questionsCount', { count: quiz.questions.length })}
                  {quiz.subject ? ` • ${quiz.subject}` : ''}
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.subtle} />
            </View>
          </TouchableOpacity>

          <Text style={{ ...Typography['caption-sm'], color: colors.subtle }}>
            {t('myQuizzes.saveHint')}
          </Text>
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
