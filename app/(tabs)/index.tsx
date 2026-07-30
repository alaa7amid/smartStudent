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
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl }}
    >
      <View style={{ gap: Spacing.lg }}>
        <Text style={{ ...Typography['heading-lg'], color: colors.text }}>
          {t('tabs.home')}
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
          }}
        >
          <Icon name="camera" size={20} color={colors.onTint} />
          <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
            {t('capture.title')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
