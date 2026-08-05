import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Share } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation } from '@tanstack/react-query'
import * as Clipboard from 'expo-clipboard'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { fetchReferralCode, redeemReferral } from '@/services/student'

// FR-17 — دعوة صديق = مكافأة للطرفين. محرك نمو ثانوي بعد كرت النتيجة.
export default function ReferralScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()

  const [copied, setCopied] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const codeQuery = useQuery({ queryKey: ['referral-code'], queryFn: fetchReferralCode })

  const redeemMutation = useMutation({
    mutationFn: () => redeemReferral(inputCode.trim().toUpperCase()),
    onSuccess: (data) => {
      setFeedback(
        data.status === 'ok'
          ? { ok: true, text: t('referral.redeemed', { count: data.bonusQuizzes }) }
          : { ok: false, text: data.message },
      )
      if (data.status === 'ok') setInputCode('')
    },
    onError: () => setFeedback({ ok: false, text: t('common.networkError') }),
  })

  async function copyCode() {
    if (!codeQuery.data) return
    await Clipboard.setStringAsync(codeQuery.data)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function shareCode() {
    if (!codeQuery.data) return
    await Share.share({ message: t('referral.shareMessage', { code: codeQuery.data }) })
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.lg }}
    >
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('referral.title')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('referral.subtitle')}</Text>

      <View
        style={{
          alignItems: 'center',
          gap: Spacing.md,
          backgroundColor: colors.cardElevated,
          borderRadius: 20,
          borderCurve: 'continuous',
          padding: Spacing.xl,
        }}
      >
        <Text style={{ ...Typography.caption, color: colors.subtle }}>{t('referral.yourCode')}</Text>

        {codeQuery.isPending ? (
          <ActivityIndicator color={colors.tint} />
        ) : (
          <Text
            style={{
              fontFamily: 'Cairo_700Bold',
              fontSize: 32,
              color: colors.tint,
              letterSpacing: 4,
              writingDirection: 'ltr',
            }}
          >
            {codeQuery.data}
          </Text>
        )}

        <View style={{ flexDirection: 'row', gap: Spacing.sm, width: '100%' }}>
          <TouchableOpacity
            onPress={copyCode}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.xs,
              borderWidth: 1,
              borderColor: colors.tint,
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingVertical: Spacing.md,
            }}
          >
            <Icon name={copied ? 'checkmark' : 'copy-outline'} size={16} color={colors.tint} />
            <Text style={{ ...Typography.caption, color: colors.tint }}>
              {copied ? t('referral.copied') : t('referral.copy')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={shareCode}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.xs,
              backgroundColor: colors.tint,
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingVertical: Spacing.md,
            }}
          >
            <Icon name="share-social-outline" size={16} color={colors.onTint} />
            <Text style={{ ...Typography.caption, color: colors.onTint }}>{t('referral.share')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ gap: Spacing.sm }}>
        <Text style={{ ...Typography['input-label'], color: colors.text }}>{t('referral.haveCode')}</Text>
        <TextInput
          value={inputCode}
          onChangeText={(v) => setInputCode(v.toUpperCase())}
          placeholder={t('referral.enterCode')}
          placeholderTextColor={colors.subtle}
          autoCapitalize="characters"
          maxLength={12}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            borderCurve: 'continuous',
            padding: Spacing.md,
            color: colors.text,
            backgroundColor: colors.surface,
            textAlign: 'center',
            letterSpacing: 3,
            writingDirection: 'ltr',
            ...Typography['body-md'],
          }}
        />

        {feedback && (
          <Text style={{ ...Typography.caption, color: feedback.ok ? colors.tint : colors.destructive }}>
            {feedback.text}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => {
            setFeedback(null)
            redeemMutation.mutate()
          }}
          disabled={inputCode.trim().length < 4 || redeemMutation.isPending}
          style={{
            alignItems: 'center',
            backgroundColor:
              inputCode.trim().length < 4 || redeemMutation.isPending ? colors.muted : colors.tint,
            paddingVertical: Spacing.md,
            borderRadius: 14,
            borderCurve: 'continuous',
          }}
        >
          <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('referral.redeem')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
