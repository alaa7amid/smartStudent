import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

export default function HomeScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: Spacing.xl, paddingTop: insets.top + Spacing.lg }}
    >
      <View style={{ gap: Spacing.xl }}>
        <Text style={{ ...Typography['heading-lg'], color: colors.text }}>
          {t('tabs.home')}
        </Text>

        <View
          style={{
            alignItems: 'center',
            gap: Spacing.lg,
            backgroundColor: colors.cardElevated,
            borderRadius: 24,
            borderCurve: 'continuous',
            padding: Spacing.xl,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.tint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="sparkles" size={32} color={colors.onTint} />
          </View>

          <Text style={{ ...Typography['heading-md'], color: colors.text, textAlign: 'center' }}>
            {t('capture.title')}
          </Text>
          <Text style={{ ...Typography.body, color: colors.subtle, textAlign: 'center' }}>
            {t('capture.subtitle')}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/capture')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.sm,
              backgroundColor: colors.tint,
              paddingVertical: Spacing.lg,
              paddingHorizontal: Spacing.xl,
              borderRadius: 16,
              borderCurve: 'continuous',
              width: '100%',
            }}
          >
            <Icon name="camera" size={20} color={colors.onTint} />
            <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
              {t('capture.takePhoto')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
