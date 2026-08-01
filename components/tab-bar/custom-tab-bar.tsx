import { View, TouchableOpacity, Text, I18nManager } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeColors } from '@/hooks/use-theme-colors'
import { Icon } from '@/components/ui/icon'
import { Typography } from '@/constants/Typography'
import { Spacing } from '@/constants/Spacing'
import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface TabDef {
  name: string
  icon: IoniconName
}

const TAB_DEFS: TabDef[] = [
  { name: 'index',         icon: 'home'      },
  { name: 'my-quizzes',    icon: 'document-text' },
  { name: 'ministry-bank', icon: 'school'    },
  { name: 'profile',       icon: 'person'    },
]

interface CustomTabBarProps {
  activeIndex: number
  onTabPress: (index: number) => void
  badges?: Partial<Record<number, number>>
}

export function CustomTabBar({ activeIndex, onTabPress, badges }: CustomTabBarProps) {
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  // Android: insets.bottom equals the system nav bar height exactly, so the
  // icons would sit flush against the OS buttons — add a gap on top of it.
  const bottomPadding = Math.max(insets.bottom, 10)
    + (process.env.EXPO_OS === 'android' ? Spacing.md : 0)

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
      paddingBottom: bottomPadding,
      paddingTop: 10,
      paddingHorizontal: 10,
      alignItems: 'flex-end',
    }}>
      {TAB_DEFS.map((tab, i) => {
        const active = activeIndex === i
        const badge = badges?.[i]
        return (
          <TabItem
            key={tab.name}
            icon={tab.icon}
            active={active}
            onPress={() => onTabPress(i)}
            colors={colors}
            isRTL={I18nManager.isRTL}
            badge={badge}
          />
        )
      })}
    </View>
  )
}

interface TabItemProps {
  icon: IoniconName
  active: boolean
  onPress: () => void
  colors: ReturnType<typeof useThemeColors>
  isRTL?: boolean
  badge?: number
}

function TabItem({ icon, active, onPress, colors, isRTL, badge }: TabItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, alignItems: 'center', paddingTop: 4 }}>
      <View style={{ position: 'relative' }}>
        <Icon
          name={active ? icon : `${icon}-outline` as IoniconName}
          size={24}
          color={active ? colors.tabIconSelected : colors.tabIconDefault}
        />
        {badge != null && badge > 0 && (
          <View style={{
            position: 'absolute',
            top: -4,
            ...(isRTL ? { left: -6 } : { right: -6 }),
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: colors.destructive,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}>
            <Text style={{
              ...Typography.micro,
              color: '#FFFFFF',
              fontSize: 9,
              fontFamily: 'Poppins_600SemiBold',
            }}>
              {badge > 99 ? '99+' : String(badge)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
