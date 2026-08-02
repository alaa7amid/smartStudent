import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { ExampleQuestionCard } from '@/components/home/example-question-card'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

const STEPS: { icon: ComponentProps<typeof Ionicons>['name']; titleKey: string; bodyKey: string }[] = [
  { icon: 'camera-outline', titleKey: 'home.step1Title', bodyKey: 'home.step1Body' },
  { icon: 'sparkles-outline', titleKey: 'home.step2Title', bodyKey: 'home.step2Body' },
  { icon: 'checkmark-done-outline', titleKey: 'home.step3Title', bodyKey: 'home.step3Body' },
]

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

        <View style={{ gap: Spacing.md }}>
          <Text style={{ ...Typography['heading-md'], color: colors.text }}>
            {t('home.howItWorksTitle')}
          </Text>

          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {STEPS.map((step) => (
              <View
                key={step.titleKey}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: Spacing.xs,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  borderCurve: 'continuous',
                  padding: Spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.cardElevated,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={step.icon} size={18} color={colors.tint} />
                </View>
                <Text style={{ ...Typography.caption, color: colors.text, textAlign: 'center' }}>
                  {t(step.titleKey)}
                </Text>
                <Text style={{ ...Typography['caption-sm'], color: colors.subtle, textAlign: 'center' }}>
                  {t(step.bodyKey)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.md }}>
          <Text style={{ ...Typography['heading-md'], color: colors.text }}>
            {t('home.tryExampleTitle')}
          </Text>
          <ExampleQuestionCard />
        </View>
      </View>
    </ScrollView>
  )
}
