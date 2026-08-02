# SmartFlow (React Native / Expo)

طالب يصوّر صفحة من ملزمته → GPT-5 يحوّلها لاختبار تفاعلي → تصحيح مقيّد بنفس المصدر (Grounded). مبني على Expo Router starter مبني على قواعد Tan: بنفس البنية ثنائية اللغة EN/AR + RTL، تبويبات قابلة للسحب، TanStack Query، RHF + zod، Zustand+SecureStore. راجع `SmartFlow-PRD.md` و`SmartFlow-Tech-Requirements.md` بجذر المشروع للمنتج والمتطلبات الكاملة.

## Tech Stack

- **React Native 0.86** / **Expo SDK 57** (React 19.2)
- **TypeScript** (strict mode, `@/*` path alias)
- **Expo Router 57** (file-based routing — SDK-aligned versioning: `expo-router@~57.x`, *not* "7")
- **React Native Reanimated 4** (animations)
- **PagerView 8** (`react-native-pager-view@8` — swipeable tabs)
- **Expo UI** (`@expo/ui@~57`) — native SwiftUI / Jetpack Compose components

## Commands

```bash
npx expo start          # Dev server (try Expo Go first)
npx expo start --ios
npx expo start --android
```

**Always try Expo Go before custom builds** (`npx expo run:ios/android`). Native builds only when you add a module that requires them.

## Project Structure

```
app/
├── _layout.tsx          # Root layout: providers (Query, i18n, GH, SafeArea), fonts, splash gating
├── modal.tsx
└── (tabs)/
    ├── _layout.tsx      # Swipeable PagerView + CustomTabBar (4 tabs)
    ├── index.tsx        # Home — capture CTA
    ├── my-quizzes.tsx   # last generated quiz (real accounts/history: Phase 2)
    ├── ministry-bank.tsx # locked placeholder — needs account + finished grade stage (Phase 2/4)
    └── profile.tsx      # guest state + working theme/language switchers
components/
├── ui/icon.tsx          # Ionicons wrapper — use this for ALL icons
├── ui/expo-ui-demo.tsx  # @expo/ui reference pattern (currently not mounted — see Native UI)
└── tab-bar/custom-tab-bar.tsx
hooks/
├── use-theme-colors.ts  # preference (theme-store) + OS scheme → Colors[scheme]
├── use-debounce.ts      # generic debounced value (e.g. Search input → query key)
└── ...                  # Add use-keyboard, etc. as needed
constants/
├── Colors.ts            # light/dark themes — هوية "نشيط وشبابي" (بنفسجي #6C5CE7 + كهرماني #FFB020)
├── Typography.ts        # Cairo presets (عربي+لاتيني، بدون Italic)
└── Spacing.ts           # xs/sm/md/lg/xl
i18n/
├── index.ts             # i18next + RTL flow + restart on lang change
├── en.json
└── ar.json
lib/
├── restart.ts           # expo-updates reload (DevSettings in dev)
└── format-count.ts      # 1400 → "1.4K", 2.5M, etc. for counters/badges
store/
├── tab-store.ts         # Zustand store for active tab index
└── theme-store.ts       # persisted light/dark/system preference (AsyncStorage)
.env.example             # copy to .env(.local); documents EXPO_PUBLIC_API_URL
```

Add `services/` (axios + API), `services/auth.ts`, `store/auth-store.ts`, etc. when you need them — see "Data Layer" and "State Management" below for the patterns.

## Code Conventions

- **kebab-case** for filenames: `auth-wizard.tsx`, `use-favorite.ts`
- Use `@/` path alias (configured in tsconfig)
- **Never co-locate components/utils inside `app/`** — `app/` is for routes only
- **Interfaces over types**, avoid enums (use `as const` maps)
- Functional components, named exports
- TypeScript strict mode

## Styling

- **Inline styles only** — no `StyleSheet.create`
- `borderCurve: 'continuous'` for rounded corners
- `boxShadow` (CSS-style) — not legacy `shadowColor`/`shadowOffset`/`elevation`
- `useWindowDimensions` over `Dimensions.get`
- Prefer flex `gap` over margin/padding between siblings
- Theme colors via `useThemeColors()` — never raw hex in components. If you need a brand color, add it to `constants/Colors.ts` (e.g., `Colors.brand`) and reference that, not the hex.

## Design System

- **Colors** — `constants/Colors.ts` exports `light` / `dark` schemes. Theme-tied props: `text`, `background`, `tint`, `tabIconDefault`, `tabIconSelected`, `card`, `border`, `secondary`, `onSecondary`, `subtle`, `surface`, `cardElevated`, `destructive`, `muted`, `onTint`. SmartFlow brand: `tint` = vibrant violet (`#6C5CE7` light / `#7A6FF0` dark), `secondary` = amber (`#FFB020`/`#FFC24D`) reserved for Streak/rewards/celebratory moments (score cards, loyalty coupons, badges) — don't use `secondary` for generic UI chrome. `onSecondary` is a fixed dark tone (not theme-flipped) for text/icons on top of `secondary`, because amber stays light in both schemes — same reasoning as `onTint`, just for the amber surface instead of the violet one.
- **Typography** — `constants/Typography.ts` exports presets: `heading-lg/md/sm`, `body`, `body-md`, `caption`, `caption-sm`, `micro`, `input-label`. Spread into style: `style={{ ...Typography['heading-md'], color: colors.text }}`.
- **Spacing** — `constants/Spacing.ts`: `xs:3, sm:5, md:10, lg:15, xl:20`.
- **Fonts** — Cairo (loaded via `useFonts` from `@expo-google-fonts/cairo` in `app/_layout.tsx`). Weights: 300, 400, 500, 600, 700. Chosen over the template's original Poppins because Poppins has no Arabic glyphs — this product is Arabic-first, so a Latin-only font would silently fall back to the OS default for ~all visible text. No italic (unavailable for Cairo, and not idiomatic in Arabic typography anyway).

## Components

- `react-native-safe-area-context` (not RN's SafeAreaView)
- `<ScrollView contentInsetAdjustmentBehavior="automatic" />` instead of wrapping in SafeAreaView
- `process.env.EXPO_OS` not `Platform.OS`
- `<Icon>` from `@/components/ui/icon` for ALL icons (Ionicons-backed; works iOS + Android)
- `expo-image` for actual images only (photos, logos)

## Native UI (Expo UI)

**ALWAYS invoke the `expo-ui` skill when writing or reviewing any code that imports from `@expo/ui`.** It documents the exact `@expo/ui@57` API — component names, prop signatures, the `<Host>` requirement, the `useNativeState` binding for `TextInput`, which `style` keys are allowed, and `Host` theming — all verified against the installed package. Don't reconstruct the API from memory; load the skill.

`@expo/ui` renders **real native components** — SwiftUI on iOS, Jetpack Compose on Android — from one JS API. See `components/ui/expo-ui-demo.tsx` for the reference pattern. It used to render on the Create tab; that tab was removed, so the demo is currently unmounted — import it into any screen to preview it, or delete it if you don't need the reference.

Quick reminders (the skill is authoritative):

- Import universal components from the package root: `import { Host, Button, Switch, Slider, Picker, Text, useNativeState } from '@expo/ui'`
- **Every `@expo/ui` component MUST be wrapped in a `<Host>`** — it's the bridge into the native view tree. Put one `<Host>` around each cluster of native controls (or one per screen).
- `<Host>` takes a full `ViewStyle` (`flex`/`gap` OK). **Child** components' `style` is a restricted `UniversalStyle` — no `flex`/`gap`/`margin`; use `Column`/`Row`/`Spacer` for native layout.
- `<Switch value onValueChange label />` — built-in `label` prop (don't add a sibling `<Text>`).
- `TextInput.value` is an `ObservableState<string>` from `useNativeState('')`, not a plain string.
- Theme native controls via `<Host seedColor={...}>` / `<Host colorScheme={...}>`, not per-control color props.
- Package `@expo/ui` 57.x tracks Expo SDK 57; no `app.json` config plugin needed.

## Animations

- **Reanimated only** — never `Animated` from react-native
- `useSharedValue` + `useAnimatedStyle` for animated values
- `withSpring` / `withTiming` for drivers
- `FadeIn` / `FadeOut` for entering/exiting

## Navigation & Tab Bar

- Expo Router file-based routing. Group routes: `(tabs)`, `(auth)`, `(modal-flows)`.
- `<Link href="/path" />` for navigation, `<Stack.Screen options={{ title }} />` for headers, `presentation: 'modal'` for sheets.

### Swipeable Tabs (the pattern)

`app/(tabs)/_layout.tsx` uses **PagerView** instead of Expo Router's `<Tabs>`:

- All tab screens are imported and rendered inside a single `<PagerView>`
- A `Set<number>` tracks which tabs have been visited so we **lazy-render** screens (`{rendered.has(i) && <Screen />}`)
- `pagerRef.current?.setPage(i)` drives swipes from `<CustomTabBar onTabPress>`
- `onPageSelected` syncs `activeIndex` + `useTabStore` + fires `Haptics.impactAsync` on iOS
- `usePathname` syncs deep-link navigation back into the pager
- `layoutDirection={isRTL ? 'rtl' : 'ltr'}` is **required** for PagerView in Arabic — RN's auto-flip doesn't cover it
- `isRTL` is captured at module scope (`const isRTL = I18nManager.isRTL`) — `forceRTL` requires a restart anyway, so the value is stable for the session

`components/tab-bar/custom-tab-bar.tsx` rules:

- `TAB_DEFS` array drives icons; active swap is `${icon}-outline` → filled
- Badges via the optional `badges` prop keyed by tab index — order is Home=0, My Quizzes=1, Ministry Bank=2, Profile=3. Not wired to real data yet (no accounts/notifications until Phase 2 — see `SmartFlow-Implementation-Plan.md`).
- Badge position is RTL-aware: `...(isRTL ? { left: -6 } : { right: -6 })`
- Respects safe-area inset via `useSafeAreaInsets()`; on Android it adds an extra `Spacing.md` gap above the system nav bar so icons don't sit flush against the OS buttons

## State Management

Use **Zustand** with `persist` middleware. Pattern:

- **Sensitive data** (auth token, refresh token): `expo-secure-store` adapter
- **Non-sensitive** (theme, language, UI prefs): `@react-native-async-storage/async-storage`
- Use `partialize` to limit what's persisted
- Use `onRehydrateStorage` → set `hasHydrated` flag, gate splash on it

`store/theme-store.ts` is the reference implementation of this AsyncStorage pattern (persists a `light/dark/system` preference, partializes to just `preference`, flips `hasHydrated`; `app/_layout.tsx` gates the splash on it and `use-theme-colors.ts` reads it). Copy its shape for any non-sensitive persisted store.

Read sync from anywhere: `useStore.getState().value`. Subscribe in components: `useStore(s => s.value)`.

When you scaffold an auth store, base it on the Tan pattern at `../store/auth-store.ts` (Tan repo).

## Data Layer (TanStack Query + axios)

QueryClient defaults: `retry: 2`, `staleTime: 5 min`. Defined in `app/_layout.tsx`.

### Query key conventions

Hierarchical arrays. Examples: `['user', userId]`, `['posts']`, `['posts', filter]`, `['comments', postId, page]`.

### Mutation pattern

```ts
const m = useMutation({
  mutationFn: api.toggleFavorite,
  onMutate: async ({ id }) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] })
    queryClient.setQueriesData({ queryKey: ['posts'] }, optimisticUpdate)
  },
  onError: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
})
```

### Infinite queries

Use `useInfiniteQuery` with `getNextPageParam` + `initialPageParam`. Flatten pages with `useMemo`.

### axios setup (`lib/api.ts` — scaffold when you add a backend)

```ts
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  // FormData uploads: drop Content-Type, extend timeout
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
    config.timeout = 120000
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && e.config?.headers?.Authorization) {
      useAuthStore.getState().clearUser()
    }
    return Promise.reject(e)
  },
)
```

**Never** `fetch` + `useState` for data — always TanStack Query.

## Forms (React Hook Form + zod)

Inline schema per form. `Controller` per field wrapping a custom `<Input>`:

```ts
const schema = z.object({
  phone: z.string().min(7, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { phone: '', password: '' },
})

const mutation = useMutation({
  mutationFn: authService.login,
  onSuccess: (res) => { /* save session, navigate */ },
  onError: (err) => setToast(err?.response?.data?.message),
})

const onSubmit = (v: FormData) => mutation.mutate(v)
```

Errors render inline below each field, color `colors.destructive`. Use a toast for API errors (localized).

## i18n / RTL

`i18next` + `react-i18next`. Translation files in `i18n/{en,ar}.json`. Init in `i18n/index.ts`.

Read translations: `const { t, i18n } = useTranslation()`; `t('tabs.home')`.

Switch language via the exported `changeLanguage('ar' | 'en')` — saves to AsyncStorage, calls `I18nManager.forceRTL(shouldBeRTL)`, restarts the app via `lib/restart.ts` if RTL flips.

### RTL layout rules

**ALWAYS invoke the `react-native-rtl-positioning` skill when writing or reviewing RTL layout code.** It covers `flexDirection`, `textAlign`, absolute positioning, margins, and icon flipping for apps that use `I18nManager.forceRTL(true)` — exactly this template's setup. Don't reason about RTL from scratch; load the skill.

Project-specific overrides on top of the skill:

- **No `marginStart`/`marginEnd`/`paddingStart`/`paddingEnd`** — use `flexDirection` reversal or a physical-edge ternary. Tan's chosen pattern, kept here for consistency.
- **PagerView** needs explicit `layoutDirection={isRTL ? 'rtl' : 'ltr'}` — RN doesn't auto-flip the gesture direction.
- **Capture `isRTL` at module scope** when you can (`const isRTL = I18nManager.isRTL`) — `forceRTL` requires a restart, so the value is stable for the session.

## Auth Flow

When you add auth:
- Login/signup screens in `app/(auth)/`
- Token stored in Zustand-persisted `user.token` via SecureStore
- Request interceptor reads sync via `useAuthStore.getState()`
- 401 with `Authorization` header set → clear user → router resolves to auth stack
- No refresh token by default — 401 forces re-login

## Push Notifications

When you add them:
- `expo-notifications` for permissions + Expo push token (FCM Android, APNs iOS)
- `setNotificationHandler` for foreground display
- Register token with backend after login: `POST /users/me/device-token`
- Deregister on logout
- Android: define a channel with `Notifications.AndroidImportance.MAX`
- Tap routing: `addNotificationResponseReceivedListener` → switch on `data.type`

## WebSockets

Native `WebSocket` (not socket.io) when you need realtime:
- URL with `?token=...` query param for auth
- 25s ping keep-alive
- Exponential reconnect (1s → 30s)
- Provider+Context pattern; expose imperative methods (`sendMessage`, `markRead`) returning Promises that resolve on server ACK

## UX

- `expo-haptics` conditionally on iOS: `if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(...)`
- `selectable` on `<Text>` showing copyable data (phones, IDs)
- `{ fontVariant: 'tabular-nums' }` for counters
- Format large numbers as `1.4K`, `2.5M` via `formatCount()` from `lib/format-count.ts`
- Add entering/exiting animations (`FadeIn`/`FadeOut`) for state changes

## Backend

Set `EXPO_PUBLIC_API_URL` in env — copy `.env.example` to `.env.local` and fill it in. Never hardcode.

When you find a backend bug, log it in a project-root `BACKEND_ISSUES.md` instead of working around it in the client.

## Libraries to Install When Needed

| Need | Package |
| --- | --- |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` *(already deps)* |
| HTTP / server state | `axios`, `@tanstack/react-query` *(already deps)* |
| Global state | `zustand` *(already dep)* |
| Secure storage | `expo-secure-store` *(already dep)* |
| Image optimization | `expo-image` *(already dep)* |
| Haptics | `expo-haptics` *(already dep)* |
| Native UI components | `@expo/ui` *(already dep)* |
| Push notifications | `expo-notifications` |
| Realtime | (native WebSocket — no lib needed) |
| Camera / pickers | `expo-camera`, `expo-image-picker` |
| Audio / video | `expo-audio`, `expo-video` |
| Linear gradient | `expo-linear-gradient` |

Install with `npx expo install <pkg>` (resolves the version compatible with your SDK).

## Don'ts

- ❌ `Animated` from react-native — use Reanimated
- ❌ `StyleSheet.create` — use inline styles
- ❌ `expo-permissions` (legacy) — use the per-module permission API
- ❌ `expo-av` — use `expo-audio` / `expo-video`
- ❌ `fetch` + `useState` for data — use TanStack Query
- ❌ `div`, `img`, intrinsic HTML — RN doesn't have them
- ❌ `marginStart`/`marginEnd` — use `flexDirection` reversal or ternaries
- ❌ Hardcoded API URLs — use `process.env.EXPO_PUBLIC_API_URL`
- ❌ `transform: scaleX(-1)` on directional icons — swap the icon name
