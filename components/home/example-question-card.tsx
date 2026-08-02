import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

// مثال ثابت وتفاعلي بالصفحة الرئيسية — يشرح "لحظة السحر" (صورة → اختبار →
// تصحيح فوري) بدون أي استدعاء API. مو بيانات مستخدم حقيقية — معلَّم بوضوح
// "مثال" حتى ما يُفهم كسجل فعلي (نفس مبدأ الصدق بالبيانات المتّبع بباقي التطبيق).
const CORRECT_OPTION = '10 نيوتن'
const OPTIONS = ['10 نيوتن', '7 نيوتن', '2.5 نيوتن', '20 نيوتن']

export function ExampleQuestionCard() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const [selected, setSelected] = useState<string | null>(null)

  const isCorrect = selected === CORRECT_OPTION

  return (
    <View
      style={{
        gap: Spacing.md,
        backgroundColor: colors.cardElevated,
        borderRadius: 20,
        borderCurve: 'continuous',
        padding: Spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          alignSelf: 'flex-start',
          backgroundColor: colors.secondary,
          paddingHorizontal: Spacing.md,
          paddingVertical: 4,
          borderRadius: 999,
        }}
      >
        <Icon name="flask-outline" size={14} color={colors.onSecondary} />
        <Text style={{ ...Typography['caption-sm'], color: colors.onSecondary }}>
          {t('home.exampleBadge')}
        </Text>
      </View>

      <Text style={{ ...Typography['body-md'], color: colors.text }}>
        {t('home.exampleQuestion')}
      </Text>

      <View style={{ gap: Spacing.sm }}>
        {OPTIONS.map((option) => {
          const isSelected = selected === option
          const showCorrect = selected != null && option === CORRECT_OPTION
          const showWrong = isSelected && !isCorrect

          return (
            <TouchableOpacity
              key={option}
              onPress={() => setSelected(option)}
              disabled={selected != null}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: showCorrect ? colors.tint : showWrong ? colors.destructive : colors.border,
                backgroundColor: showCorrect
                  ? colors.tint
                  : showWrong
                    ? colors.destructive
                    : colors.surface,
                borderRadius: 10,
                borderCurve: 'continuous',
                padding: Spacing.md,
              }}
            >
              <Text
                style={{
                  ...Typography.body,
                  color: showCorrect || showWrong ? colors.onTint : colors.text,
                }}
              >
                {option}
              </Text>
              {showCorrect && <Icon name="checkmark-circle" size={18} color={colors.onTint} />}
              {showWrong && <Icon name="close-circle" size={18} color={colors.onTint} />}
            </TouchableOpacity>
          )
        })}
      </View>

      {selected != null && (
        <Text style={{ ...Typography.caption, color: colors.subtle }}>
          {isCorrect ? t('home.exampleFeedbackCorrect') : t('home.exampleFeedbackWrong')}
        </Text>
      )}
    </View>
  )
}
