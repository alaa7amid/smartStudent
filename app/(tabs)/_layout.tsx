import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { View, I18nManager } from 'react-native'
import PagerView from 'react-native-pager-view'
import { usePathname } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { CustomTabBar, type TabDef } from '@/components/tab-bar/custom-tab-bar'
import { useTabStore } from '@/store/tab-store'
import { useAuthStore } from '@/store/auth-store'

import HomeScreen from './index'
import MyQuizzesScreen from './my-quizzes'
import MinistryBankScreen from './ministry-bank'
import ProfileScreen from './profile'

interface TabEntry extends TabDef {
  path: string
  Screen: () => React.JSX.Element | null
}

const ALL_TABS: TabEntry[] = [
  { name: 'index', icon: 'home', path: '/', Screen: HomeScreen },
  { name: 'my-quizzes', icon: 'document-text', path: '/my-quizzes', Screen: MyQuizzesScreen },
  { name: 'ministry-bank', icon: 'school', path: '/ministry-bank', Screen: MinistryBankScreen },
  { name: 'profile', icon: 'person', path: '/profile', Screen: ProfileScreen },
]

// Stable for the session — forceRTL changes require a restart anyway
const isRTL = I18nManager.isRTL

export default function TabLayout() {
  const pagerRef = useRef<PagerView>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [rendered, setRendered] = useState(new Set<number>([0]))
  // Mirror of activeIndex read inside the deep-link effect. Keeping it in a ref
  // lets the effect depend on [pathname] ONLY — depending on activeIndex makes a
  // swipe re-run the effect, and since a pager swipe never changes the router
  // path, indexOf(pathname) resolves to 0 and setPage(0) snaps back to Home.
  const activeIndexRef = useRef(0)

  // FR-2 — بنك الوزاري حصراً للمراحل المنتهية. الزائر (بلا تسجيل) يشوفه أيضاً
  // لأنه مجرد روابط خارجية عامة، وهو مدخل تعريفي بالميزة قبل التسجيل.
  const stageType = useAuthStore((s) => s.student?.stageType)
  const tabs = useMemo(
    () => ALL_TABS.filter((tab) => tab.name !== 'ministry-bank' || stageType !== 'unfinished'),
    [stageType],
  )

  const pathname = usePathname()
  useEffect(() => {
    // Deep-link sync: drive the pager only on a real path change. setPage()
    // fires onPageSelected, the single source of truth for activeIndex/store.
    const idx = tabs.findIndex((tab) => tab.path === pathname)
    if (idx !== -1 && idx !== activeIndexRef.current) {
      pagerRef.current?.setPage(idx)
    }
  }, [pathname, tabs])

  const goToTab = useCallback((index: number) => {
    pagerRef.current?.setPage(index)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        layoutDirection={isRTL ? 'rtl' : 'ltr'}
        overdrag
        onPageSelected={(e) => {
          const page = e.nativeEvent.position
          activeIndexRef.current = page
          setActiveIndex(page)
          useTabStore.getState().setActiveTabIndex(page)
          setRendered(prev => new Set([...prev, page]))
          if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
        }}
      >
        {tabs.map(({ name, Screen }, i) => (
          <View key={name} style={{ flex: 1 }}>
            {rendered.has(i) && <Screen />}
          </View>
        ))}
      </PagerView>
      <CustomTabBar tabs={tabs} activeIndex={activeIndex} onTabPress={goToTab} />
    </View>
  )
}
