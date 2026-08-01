import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { useThemeStore, type ThemePreference } from '@/store/theme-store'
import { changeLanguage } from '@/i18n'

const THEME_OPTIONS: { value: ThemePreference; labelKey: string; icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline' }[] = [
  { value: 'system', labelKey: 'settings.themeSystem', icon: 'phone-portrait-outline' },
  { value: 'light', labelKey: 'settings.themeLight', icon: 'sunny-outline' },
  { value: 'dark', labelKey: 'settings.themeDark', icon: 'moon-outline' },
]

export default function ProfileScreen() {
  const { t, i18n } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.xl }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('profile.title')}</Text>

      {/* حالة الزائر — لا حسابات بعد (المرحلة 2). صادقة بدل بيانات وهمية. */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          backgroundColor: colors.cardElevated,
          borderRadius: 16,
          borderCurve: 'continuous',
          padding: Spacing.lg,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="person-outline" size={24} color={colors.subtle} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Typography['body-md'], color: colors.text }}>{t('profile.guestTitle')}</Text>
          <Text style={{ ...Typography.caption, color: colors.subtle }}>{t('profile.guestBody')}</Text>
        </View>
      </View>

      <TouchableOpacity
        disabled
        style={{
          alignItems: 'center',
          backgroundColor: colors.muted,
          paddingVertical: Spacing.md,
          borderRadius: 14,
          borderCurve: 'continuous',
        }}
      >
        <Text style={{ ...Typography['body-md'], color: colors.subtle }}>{t('profile.signUp')}</Text>
      </TouchableOpacity>

      {/* المظهر — وظيفي فعلياً، مربوط بـ theme-store */}
      <View style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography['input-label'], color: colors.text }}>{t('profile.appearance')}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {THEME_OPTIONS.map((opt) => {
            const active = preference === opt.value
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setPreference(opt.value)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 4,
                  borderWidth: 1,
                  borderColor: active ? colors.tint : colors.border,
                  backgroundColor: active ? colors.tint : colors.surface,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  paddingVertical: Spacing.md,
                }}
              >
                <Icon name={opt.icon} size={20} color={active ? colors.onTint : colors.subtle} />
                <Text style={{ ...Typography.caption, color: active ? colors.onTint : colors.text }}>
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* اللغة — وظيفي فعلياً، يبدّل RTL/LTR (راجع i18n/index.ts) */}
      <View style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography['input-label'], color: colors.text }}>{t('profile.language')}</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {(['ar', 'en'] as const).map((lang) => {
            const active = i18n.language === lang
            return (
              <TouchableOpacity
                key={lang}
                onPress={() => changeLanguage(lang)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: active ? colors.tint : colors.border,
                  backgroundColor: active ? colors.tint : colors.surface,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  paddingVertical: Spacing.md,
                }}
              >
                <Text style={{ ...Typography.body, color: active ? colors.onTint : colors.text }}>
                  {t(`settings.${lang === 'ar' ? 'arabic' : 'english'}`)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}
