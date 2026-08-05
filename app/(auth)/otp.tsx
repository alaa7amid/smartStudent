import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { verifyOtp } from '@/services/auth'
import { fetchProfile, linkQuizToAccount } from '@/services/student'
import { useAuthStore } from '@/store/auth-store'
import { useQuizStore } from '@/store/quiz-store'

export default function OtpScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const setSession = useAuthStore((s) => s.setSession)

  const { phone, devCode } = useLocalSearchParams<{ phone: string; devCode?: string }>()
  const [code, setCode] = useState(devCode || '')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const data = await verifyOtp(phone, code)
      if (data.status !== 'ok') return data

      // الجلسة تُحفظ أول شي — الطلبات الجاية تحتاج التوكن بالـ interceptor.
      setSession(data.token, data.student)

      // FR-4 — اختبار الديمو المولَّد قبل التسجيل يرتبط بالحساب حتى ما يضيع.
      // فشل الربط ما يوقف تسجيل الدخول.
      const demoQuiz = useQuizStore.getState().currentQuiz
      if (demoQuiz) {
        try {
          await linkQuizToAccount(demoQuiz.quizId)
        } catch {
          // تجاهل — الاختبار يبقى معروضاً بالذاكرة على أي حال
        }
      }

      const profile = await fetchProfile()
      return { ...data, profile }
    },
    onSuccess: (data) => {
      if (data.status !== 'ok') {
        setErrorMessage(data.message)
        return
      }
      // FR-2 — أول تسجيل دخول يمر بتحديد المرحلة؛ العائد يروح للتبويبات مباشرة.
      router.replace('profile' in data && data.profile.gradeStage ? '/(tabs)' : '/(auth)/grade-stage')
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined
      setErrorMessage(message ?? t('common.networkError'))
    },
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: Spacing.xl,
        paddingTop: insets.top + Spacing.xl,
        gap: Spacing.lg,
      }}
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

      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('auth.otpTitle')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>
        {t('auth.otpSubtitle', { phone })}
      </Text>

      {!!devCode && (
        <View
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 12,
            borderCurve: 'continuous',
            padding: Spacing.md,
          }}
        >
          <Text style={{ ...Typography.caption, color: colors.onSecondary }}>
            {t('auth.devModeHint', { code: devCode })}
          </Text>
        </View>
      )}

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        placeholderTextColor={colors.subtle}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: Spacing.md,
          color: colors.text,
          backgroundColor: colors.surface,
          textAlign: 'center',
          letterSpacing: 8,
          writingDirection: 'ltr',
          ...Typography['heading-md'],
        }}
      />

      {errorMessage && (
        <Text style={{ ...Typography.caption, color: colors.destructive }}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        onPress={() => {
          setErrorMessage(null)
          mutation.mutate()
        }}
        disabled={mutation.isPending || code.length !== 6}
        style={{
          backgroundColor: mutation.isPending || code.length !== 6 ? colors.muted : colors.tint,
          paddingVertical: Spacing.lg,
          borderRadius: 16,
          borderCurve: 'continuous',
          alignItems: 'center',
        }}
      >
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
          {mutation.isPending ? t('common.loading') : t('auth.verify')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
