import { useState } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Host, Button, Switch, Column } from '@expo/ui'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

/**
 * Showcase for @expo/ui universal components. These render as real native
 * views — SwiftUI on iOS, Jetpack Compose on Android.
 *
 * The rule: every @expo/ui component must live inside a <Host>. The Host is a
 * bridge into the native view tree; place one around each cluster of native
 * controls (or one per screen) and lay out RN <View>s around it as usual.
 */
export function ExpoUiDemo() {
  const { t } = useTranslation()
  const colors = useThemeColors()
  const [enabled, setEnabled] = useState(false)
  const [lastPressed, setLastPressed] = useState<string | null>(null)

  return (
    <View style={{ gap: Spacing.md }}>
      <View style={{ gap: Spacing.xs }}>
        <Text style={{ ...Typography['heading-md'], color: colors.text }}>
          {t('expoUi.title')}
        </Text>
        <Text style={{ ...Typography['body-md'], color: colors.subtle }}>
          {t('expoUi.description')}
        </Text>
      </View>

      <Host matchContents>
        <Column spacing={Spacing.sm}>
          <Button
            variant="filled"
            label={t('expoUi.filled')}
            onPress={() => setLastPressed('filled')}
          />
          <Button
            variant="outlined"
            label={t('expoUi.outlined')}
            onPress={() => setLastPressed('outlined')}
          />
          <Button
            variant="text"
            label={t('expoUi.text')}
            onPress={() => setLastPressed('text')}
          />
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            label={t('expoUi.enableNotifications')}
          />
        </Column>
      </Host>

      {lastPressed && (
        <Text style={{ ...Typography['caption-sm'], color: colors.subtle }}>
          {t('expoUi.pressed')}: {lastPressed}
        </Text>
      )}
    </View>
  )
}
