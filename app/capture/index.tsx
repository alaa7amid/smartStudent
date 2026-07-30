import { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { generateQuiz, generateQuizFromText, type GenerateQuizResponse } from '@/services/quiz'
import { useQuizStore } from '@/store/quiz-store'

// مسار الإنقاذ المتدرّج (FR-7.1): 0 = عادي، 1/2 = نصائح تصوير، 3 = ملاذ نصي أخير.
type RescueLevel = 0 | 1 | 2 | 3

export default function CaptureScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const setCurrentQuiz = useQuizStore((s) => s.setCurrentQuiz)

  const [rescueLevel, setRescueLevel] = useState<RescueLevel>(0)
  const [manualText, setManualText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleResult(data: GenerateQuizResponse) {
    if (data.status === 'ready') {
      setCurrentQuiz(data)
      router.push('/quiz/current')
      return
    }
    if (data.status === 'unreadable') {
      setRescueLevel((lvl) => (lvl >= 3 ? 3 : ((lvl + 1) as RescueLevel)))
      return
    }
    setErrorMessage(data.message)
  }

  function handleError(err: unknown) {
    const message = axios.isAxiosError(err)
      ? (err.response?.data as { message?: string } | undefined)?.message
      : undefined
    setErrorMessage(message ?? t('common.networkError'))
  }

  const imageMutation = useMutation({
    mutationFn: (uri: string) => generateQuiz(uri),
    onSuccess: handleResult,
    onError: handleError,
  })

  const textMutation = useMutation({
    mutationFn: (text: string) => generateQuizFromText(text),
    onSuccess: handleResult,
    onError: handleError,
  })

  const isLoading = imageMutation.isPending || textMutation.isPending

  async function takePhoto() {
    setErrorMessage(null)
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setErrorMessage(t('capture.permissionDenied'))
      return
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 })
    if (!result.canceled && result.assets[0]) {
      imageMutation.mutate(result.assets[0].uri)
    }
  }

  async function pickFromGallery() {
    setErrorMessage(null)
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 })
    if (!result.canceled && result.assets[0]) {
      imageMutation.mutate(result.assets[0].uri)
    }
  }

  function submitManualText() {
    if (manualText.trim().length < 3) return
    setErrorMessage(null)
    textMutation.mutate(manualText.trim())
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: Spacing.xl,
        paddingTop: insets.top + Spacing.xl,
        justifyContent: 'center',
        gap: Spacing.lg,
      }}
    >
      {isLoading ? (
        <View style={{ alignItems: 'center', gap: Spacing.lg }}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={{ ...Typography['heading-sm'], color: colors.text }}>
            {t('capture.generating')}
          </Text>
        </View>
      ) : errorMessage ? (
        <ErrorCard
          colors={colors}
          message={errorMessage}
          onRetry={() => setErrorMessage(null)}
        />
      ) : rescueLevel === 1 ? (
        <RescueCard
          colors={colors}
          title={t('capture.unreadableLevel1Title')}
          body={t('capture.unreadableLevel1Body')}
          actionLabel={t('capture.retakePhoto')}
          onAction={takePhoto}
        />
      ) : rescueLevel === 2 ? (
        <RescueCard
          colors={colors}
          title={t('capture.unreadableLevel2Title')}
          body={t('capture.unreadableLevel2Body')}
          actionLabel={t('capture.retakePhoto')}
          onAction={takePhoto}
        />
      ) : rescueLevel === 3 ? (
        <View style={{ gap: Spacing.md }}>
          <Text style={{ ...Typography['heading-sm'], color: colors.text }}>
            {t('capture.unreadableLevel3Title')}
          </Text>
          <TextInput
            value={manualText}
            onChangeText={setManualText}
            placeholder={t('capture.unreadableLevel3Placeholder')}
            placeholderTextColor={colors.subtle}
            multiline
            style={{
              minHeight: 120,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              borderCurve: 'continuous',
              padding: Spacing.md,
              color: colors.text,
              backgroundColor: colors.surface,
              textAlignVertical: 'top',
              ...Typography.body,
            }}
          />
          <PrimaryButton
            colors={colors}
            label={t('capture.submitText')}
            onPress={submitManualText}
            disabled={manualText.trim().length < 3}
          />
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: Spacing.md }}>
          <Text style={{ ...Typography['heading-lg'], color: colors.text, textAlign: 'center' }}>
            {t('capture.title')}
          </Text>
          <Text style={{ ...Typography.body, color: colors.subtle, textAlign: 'center' }}>
            {t('capture.subtitle')}
          </Text>

          <View style={{ height: Spacing.lg }} />

          <PrimaryButton colors={colors} label={t('capture.takePhoto')} onPress={takePhoto} icon="camera" />

          <TouchableOpacity onPress={pickFromGallery} style={{ padding: Spacing.md }}>
            <Text style={{ ...Typography.body, color: colors.tint }}>
              {t('capture.pickFromGallery')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

function PrimaryButton({
  colors,
  label,
  onPress,
  icon,
  disabled,
}: {
  colors: ReturnType<typeof useThemeColors>
  label: string
  onPress: () => void
  icon?: React.ComponentProps<typeof Icon>['name']
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: disabled ? colors.muted : colors.tint,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        borderRadius: 16,
        borderCurve: 'continuous',
        width: '100%',
      }}
    >
      {icon && <Icon name={icon} size={20} color={colors.onTint} />}
      <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{label}</Text>
    </TouchableOpacity>
  )
}

function RescueCard({
  colors,
  title,
  body,
  actionLabel,
  onAction,
}: {
  colors: ReturnType<typeof useThemeColors>
  title: string
  body: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <View
      style={{
        gap: Spacing.md,
        backgroundColor: colors.cardElevated,
        padding: Spacing.xl,
        borderRadius: 16,
        borderCurve: 'continuous',
      }}
    >
      <Text style={{ ...Typography['heading-sm'], color: colors.text }}>{title}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{body}</Text>
      <PrimaryButton colors={colors} label={actionLabel} onPress={onAction} icon="camera" />
    </View>
  )
}

function ErrorCard({
  colors,
  message,
  onRetry,
}: {
  colors: ReturnType<typeof useThemeColors>
  message: string
  onRetry: () => void
}) {
  const { t } = useTranslation()
  return (
    <View
      style={{
        gap: Spacing.md,
        backgroundColor: colors.cardElevated,
        padding: Spacing.xl,
        borderRadius: 16,
        borderCurve: 'continuous',
      }}
    >
      <Text style={{ ...Typography['heading-sm'], color: colors.destructive }}>
        {t('capture.failedTitle')}
      </Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{message}</Text>
      <PrimaryButton colors={colors} label={t('capture.retry')} onPress={onRetry} />
    </View>
  )
}
