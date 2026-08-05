import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { submitGuardianConsent } from '@/services/student'

// FR-3 — موافقة ولي الأمر. إلزامية لأن المستخدمين قاصرون (12-17) — التزام
// قانوني، مو مجرد خطوة UX. رقم ولي الأمر اختياري (يُستخدم للتقرير الأسبوعي).
export default function GuardianConsentScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [consented, setConsented] = useState(false)
  const [guardianPhone, setGuardianPhone] = useState('')

  const mutation = useMutation({
    mutationFn: () => submitGuardianConsent(guardianPhone.trim() || undefined),
    onSuccess: () => router.replace('/(tabs)'),
  })

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.cardElevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="shield-checkmark-outline" size={28} color={colors.tint} />
      </View>

      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('auth.consentTitle')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('auth.consentBody')}</Text>

      <TouchableOpacity
        onPress={() => setConsented((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          backgroundColor: colors.cardElevated,
          borderRadius: 14,
          borderCurve: 'continuous',
          padding: Spacing.md,
        }}
      >
        <Icon
          name={consented ? 'checkbox' : 'square-outline'}
          size={24}
          color={consented ? colors.tint : colors.subtle}
        />
        <Text style={{ ...Typography.body, color: colors.text, flex: 1 }}>{t('auth.consentCheckbox')}</Text>
      </TouchableOpacity>

      <View style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography['input-label'], color: colors.text }}>
          {t('auth.guardianPhoneLabel')}
        </Text>
        <TextInput
          value={guardianPhone}
          onChangeText={setGuardianPhone}
          placeholder={t('auth.guardianPhonePlaceholder')}
          placeholderTextColor={colors.subtle}
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            borderCurve: 'continuous',
            padding: Spacing.md,
            color: colors.text,
            backgroundColor: colors.surface,
            textAlign: 'left',
            writingDirection: 'ltr',
            ...Typography.body,
          }}
        />
        <Text style={{ ...Typography['caption-sm'], color: colors.subtle }}>
          {t('auth.guardianPhoneHint')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => mutation.mutate()}
        disabled={!consented || mutation.isPending}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          backgroundColor: !consented || mutation.isPending ? colors.muted : colors.tint,
          paddingVertical: Spacing.lg,
          borderRadius: 16,
          borderCurve: 'continuous',
        }}
      >
        {mutation.isPending && <ActivityIndicator color={colors.onTint} />}
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('common.done')}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
