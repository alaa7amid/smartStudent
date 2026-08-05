import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import axios from 'axios'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { requestOtp } from '@/services/auth'

const schema = z.object({
  phone: z.string().regex(/^\+?[0-9]{8,15}$/, 'phoneInvalid'),
})
type FormData = z.infer<typeof schema>

export default function PhoneScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  })

  const mutation = useMutation({
    mutationFn: (phone: string) => requestOtp(phone),
    onSuccess: (data, phone) => {
      if (data.status !== 'sent') {
        setErrorMessage(data.message ?? t('auth.genericError'))
        return
      }
      router.push({ pathname: '/(auth)/otp', params: { phone, devCode: data.devCode ?? '' } })
    },
    onError: (err) => {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message
        : undefined
      setErrorMessage(message ?? t('common.networkError'))
    },
  })

  const onSubmit = (values: FormData) => {
    setErrorMessage(null)
    mutation.mutate(values.phone)
  }

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
        <Icon name="call-outline" size={28} color={colors.tint} />
      </View>

      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('auth.phoneTitle')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('auth.phoneSubtitle')}</Text>

      <Controller
        control={control}
        name="phone"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={t('auth.phonePlaceholder')}
            placeholderTextColor={colors.subtle}
            keyboardType="phone-pad"
            autoFocus
            style={{
              borderWidth: 1,
              borderColor: errors.phone ? colors.destructive : colors.border,
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
        )}
      />
      {errors.phone && (
        <Text style={{ ...Typography.caption, color: colors.destructive }}>
          {t('auth.phoneInvalid')}
        </Text>
      )}
      {errorMessage && (
        <Text style={{ ...Typography.caption, color: colors.destructive }}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        style={{
          backgroundColor: mutation.isPending ? colors.muted : colors.tint,
          paddingVertical: Spacing.lg,
          borderRadius: 16,
          borderCurve: 'continuous',
          alignItems: 'center',
        }}
      >
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>
          {mutation.isPending ? t('common.loading') : t('auth.sendCode')}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
