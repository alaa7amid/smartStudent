import { Link } from 'expo-router'
import { View, Text } from 'react-native'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'

export default function ModalScreen() {
  const colors = useThemeColors()

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xl,
      backgroundColor: colors.background,
    }}>
      <Text style={{ ...Typography['heading-lg'], color: colors.text }}>
        This is a modal
      </Text>
      <Link href="/" dismissTo style={{ marginTop: Spacing.lg, paddingVertical: Spacing.lg }}>
        <Text style={{ ...Typography.body, color: colors.tint }}>
          Go to home screen
        </Text>
      </Link>
    </View>
  )
}
