import { forwardRef } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

interface ScoreCardProps {
  score: number
  total: number
  subject: string | null
}

// FR-15 — كرت النتيجة القابل للمشاركة (محرك النمو الأساسي، PRD بند 17).
// **بدون علامة مائية** عمداً — هذا المحتوى الوحيد المشجَّع للمشاركة، بعكس
// محتوى الأسئلة المحمي (NFR-4.1). التصميم إيجابي حتى بالدرجات الواطية حتى ما
// يحرج الطالب ويمنعه من المشاركة.
export const ScoreCard = forwardRef<View, ScoreCardProps>(function ScoreCard(
  { score, total, subject },
  ref,
) {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const ratio = total > 0 ? score / total : 0

  const headlineKey =
    ratio >= 0.9 ? 'scoreCard.headlinePerfect'
      : ratio >= 0.7 ? 'scoreCard.headlineStrong'
        : ratio >= 0.5 ? 'scoreCard.headlineGood'
          : 'scoreCard.headlineImproving'

  const emoji = ratio >= 0.9 ? '🔥' : ratio >= 0.7 ? '🌟' : ratio >= 0.5 ? '💪' : '📈'

  return (
    <View
      ref={ref}
      collapsable={false} // لازم لـ react-native-view-shot حتى يلتقط الـ View
      style={{
        backgroundColor: colors.tint,
        borderRadius: 24,
        borderCurve: 'continuous',
        padding: Spacing.xl,
        gap: Spacing.md,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 48 }}>{emoji}</Text>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.onTint,
          borderRadius: 20,
          borderCurve: 'continuous',
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          minWidth: 160,
        }}
      >
        <Text
          style={{
            fontFamily: 'Cairo_700Bold',
            fontSize: 44,
            color: colors.tint,
            fontVariant: ['tabular-nums'],
          }}
        >
          {score}/{total}
        </Text>
      </View>

      <Text style={{ ...Typography['heading-md'], color: colors.onTint, textAlign: 'center' }}>
        {t(headlineKey)}
      </Text>

      {subject && (
        <Text style={{ ...Typography.caption, color: colors.onTint, textAlign: 'center', opacity: 0.9 }}>
          {subject}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.xs,
          marginTop: Spacing.sm,
          paddingTop: Spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.onTint,
        }}
      >
        <Icon name="sparkles" size={14} color={colors.onTint} />
        <Text style={{ ...Typography['caption-sm'], color: colors.onTint }}>
          {t('scoreCard.brand')}
        </Text>
      </View>
    </View>
  )
})
