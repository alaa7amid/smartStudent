import { useRef, useState, useCallback, useEffect } from 'react'
import { View, I18nManager } from 'react-native'
import PagerView from 'react-native-pager-view'
import { usePathname } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { CustomTabBar } from '@/components/tab-bar/custom-tab-bar'
import { useTabStore } from '@/store/tab-store'

import HomeScreen from './index'
import SearchScreen from './search'
import NotificationsScreen from './notifications'
import ProfileScreen from './profile'

const SCREENS = [HomeScreen, SearchScreen, NotificationsScreen, ProfileScreen]
const TAB_PATHS = ['/', '/search', '/notifications', '/profile']

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

  const pathname = usePathname()
  useEffect(() => {
    // Deep-link sync: drive the pager only on a real path change. setPage()
    // fires onPageSelected, the single source of truth for activeIndex/store.
    const idx = TAB_PATHS.indexOf(pathname)
    if (idx !== -1 && idx !== activeIndexRef.current) {
      pagerRef.current?.setPage(idx)
    }
  }, [pathname])

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
        {SCREENS.map((Screen, i) => (
          <View key={i} style={{ flex: 1 }}>
            {rendered.has(i) && <Screen />}
          </View>
        ))}
      </PagerView>
      <CustomTabBar activeIndex={activeIndex} onTabPress={goToTab} />
    </View>
  )
}
