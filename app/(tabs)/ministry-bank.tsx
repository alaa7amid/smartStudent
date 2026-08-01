import { ScrollView, View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

// FR-20/FR-21 — يظهر فعلياً فقط للمراحل المنتهية بعد التسجيل (FR-2). بدون
// حسابات بعد (المرحلة 2)، هذا التبويب حالة "مقفول" صادقة — مو محتوى وهمي.
export default function MinistryBankScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('ministryBank.title')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('ministryBank.description')}</Text>

      <View
        style={{
          alignItems: 'center',
          gap: Spacing.md,
          backgroundColor: colors.cardElevated,
          borderRadius: 20,
          borderCurve: 'continuous',
          padding: Spacing.xl,
          marginTop: Spacing.md,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="lock-closed" size={28} color={colors.subtle} />
        </View>
        <Text style={{ ...Typography['heading-sm'], color: colors.text, textAlign: 'center' }}>
          {t('ministryBank.lockedTitle')}
        </Text>
        <Text style={{ ...Typography.body, color: colors.subtle, textAlign: 'center' }}>
          {t('ministryBank.lockedBody')}
        </Text>
      </View>
    </ScrollView>
  )
}
