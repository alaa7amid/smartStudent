import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import { GRADE_STAGES, setGradeStage, type GradeStage } from '@/services/student'
import { useAuthStore } from '@/store/auth-store'

// FR-2 — اختيار المرحلة الدراسية. الاختيار يحدد stageType بالباك اند، اللي
// بدوره يحدد ظهور بنك الوزاري (منتهية فقط).
export default function GradeStageScreen() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const setStudentStage = useAuthStore((s) => s.setStudentStage)
  const [selected, setSelected] = useState<GradeStage | null>(null)

  const mutation = useMutation({
    mutationFn: (stage: GradeStage) => setGradeStage(stage),
    onSuccess: (data) => {
      setStudentStage(data.gradeStage, data.stageType)
      router.replace('/(auth)/guardian-consent')
    },
  })

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.xl, gap: Spacing.md }}
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
        <Icon name="school-outline" size={28} color={colors.tint} />
      </View>

      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>{t('auth.gradeTitle')}</Text>
      <Text style={{ ...Typography.body, color: colors.subtle }}>{t('auth.gradeSubtitle')}</Text>

      <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
        {GRADE_STAGES.map((stage) => {
          const active = selected === stage
          return (
            <TouchableOpacity
              key={stage}
              onPress={() => setSelected(stage)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: active ? colors.tint : colors.border,
                backgroundColor: active ? colors.tint : colors.surface,
                borderRadius: 12,
                borderCurve: 'continuous',
                padding: Spacing.md,
              }}
            >
              <Text style={{ ...Typography.body, color: active ? colors.onTint : colors.text }}>
                {t(`gradeStages.${stage}`)}
              </Text>
              {active && <Icon name="checkmark-circle" size={20} color={colors.onTint} />}
            </TouchableOpacity>
          )
        })}
      </View>

      <TouchableOpacity
        onPress={() => selected && mutation.mutate(selected)}
        disabled={!selected || mutation.isPending}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          backgroundColor: !selected || mutation.isPending ? colors.muted : colors.tint,
          paddingVertical: Spacing.lg,
          borderRadius: 16,
          borderCurve: 'continuous',
          marginTop: Spacing.md,
        }}
      >
        {mutation.isPending && <ActivityIndicator color={colors.onTint} />}
        <Text style={{ ...Typography['body-md'], color: colors.onTint }}>{t('common.next')}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
