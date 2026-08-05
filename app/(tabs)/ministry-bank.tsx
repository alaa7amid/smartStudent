import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import * as WebBrowser from 'expo-web-browser'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { MINISTRY_LINK_GROUPS, type MinistryLink } from '@/constants/ministry-links'

// FR-20 — قائمة روابط خارجية يتصفّحها الطالب بنفسه، بدل بنك أسئلة داخلي.
// السبب: محتوى الأسئلة الحقيقي مبعثر (صور ممسوحة بمواقع غير رسمية) ووضع
// الحقوق غير مؤكَّد — راجع السؤال المفتوح Q-7 بـ SmartFlow-SRS-v1.md. لا نعيد
// نشر/نبني قاعدة بيانات من هالمحتوى قبل ما ينحسم الوضع القانوني.
export default function MinistryBankScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('ministryBank.title')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('ministryBank.description')}</Text>

      <View
        style={{
          flexDirection: 'row',
          gap: Spacing.sm,
          backgroundColor: colors.cardElevated,
          borderRadius: 14,
          borderCurve: 'continuous',
          padding: Spacing.md,
        }}
      >
        <Icon name="information-circle-outline" size={18} color={colors.subtle} />
        <Text style={{ ...Typography['caption-sm'], color: colors.subtle, flex: 1 }}>
          {t('ministryBank.disclaimer')}
        </Text>
      </View>

      {MINISTRY_LINK_GROUPS.map((group) => (
        <View key={group.gradeKey} style={{ gap: Spacing.sm }}>
          <Text style={{ ...Typography['input-label'], color: colors.text }}>{t(group.gradeKey)}</Text>
          {group.links.map((link) => (
            <LinkCard key={link.url} link={link} colors={colors} />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

function LinkCard({
  link,
  colors,
}: {
  link: MinistryLink
  colors: ReturnType<typeof useThemeColors>
}) {
  return (
    <TouchableOpacity
      onPress={() => WebBrowser.openBrowserAsync(link.url)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        borderCurve: 'continuous',
        padding: Spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ ...Typography.body, color: colors.text }}>{link.title}</Text>
        <Text style={{ ...Typography['caption-sm'], color: colors.subtle }}>{link.source}</Text>
      </View>
      <Icon name="open-outline" size={18} color={colors.tint} />
    </TouchableOpacity>
  )
}
