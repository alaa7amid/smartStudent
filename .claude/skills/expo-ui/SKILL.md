---
name: expo-ui
description: Use when building or reviewing UI with @expo/ui (Expo's native SwiftUI / Jetpack Compose components) in an Expo SDK 57 app — any code importing Host, Button, Switch, Slider, Picker, TextInput, BottomSheet, List, or other components from "@expo/ui". Covers the required Host wrapper, exact prop names, the useNativeState binding for TextInput, which style keys native controls accept, and how to theme them.
---

# Expo UI (@expo/ui)

## Overview

`@expo/ui` renders **real native components** — SwiftUI on iOS, Jetpack Compose on Android — from one JS API. It is NOT a styled-`View` library; each component is a native view bridged into your RN tree.

**Core rule: every `@expo/ui` component must be a descendant of a `<Host>`.** The `<Host>` is the bridge into the native view hierarchy. Forget it and the components render nothing.

This package is **`@expo/ui` 57.x, matching Expo SDK 57**. Install with `npx expo install @expo/ui`. **No `app.json` config plugin is required** (the package ships only an optional Babel plugin for `Icon.select`). It ships native iOS/Android code, so it runs in Expo Go only when the matching Expo Go build bundles the module — if a control doesn't appear in Expo Go, use a development build.

## When to use

- Writing/reviewing any code that imports from `@expo/ui`
- Adding native-feeling controls (buttons, switches, sliders, pickers, bottom sheets) to an Expo SDK 57 app
- Debugging "@expo/ui component renders nothing" (almost always a missing `<Host>`)

**When NOT to use:** plain RN `View`/`Text` layout, or SDK versions other than 57 (the major version tracks the SDK).

## Import — always from the root

```ts
import {
  Host, Button, Switch, Checkbox, Slider, Picker, TextInput,
  Text, List, ListItem, BottomSheet, Collapsible,
  Column, Row, Spacer, ScrollView, Icon, useNativeState,
} from '@expo/ui'
```

Every symbol above is exported from the package root. Do NOT import from `@expo/ui/swift-ui` or `@expo/ui/jetpack-compose` for cross-platform screens — those are platform-specific escape hatches. The root import gives you the universal components (iOS + Android + web).

## The Host rule

```tsx
import { Host, Button, Switch } from '@expo/ui'

// ✅ Correct — components live inside a Host
<Host matchContents>
  <Button variant="filled" onPress={submit}>Save</Button>
  <Switch value={on} onValueChange={setOn} label="Notifications" />
</Host>

// ❌ Wrong — no Host, renders nothing
<Button variant="filled" onPress={submit}>Save</Button>
```

- Put one `<Host>` around each cluster of native controls (or one per screen).
- `<Host matchContents>` sizes the host to its children. Without it, the host fills available space.
- **`Host.style` is a full RN `ViewStyle`** — `flex`, `gap`, `margin`, padding, etc. all work on `<Host>`. Lay it out like any RN `<View>`.

## Quick reference (verified prop names)

| Component | Key props |
| --- | --- |
| `Host` | `matchContents?`, `style?` (full `ViewStyle`), `colorScheme?`, `seedColor?`, `layoutDirection?`, `ignoreSafeArea?` |
| `Button` | `children` **or** `label`, `onPress`, `variant?: 'filled' \| 'outlined' \| 'text'` (default `'filled'`), `disabled?` |
| `Switch` | `value: boolean`, `onValueChange: (v) => void`, `label?`, `disabled?` |
| `Checkbox` | `value: boolean`, `onValueChange: (v) => void`, `label?`, `disabled?` |
| `Slider` | `value: number`, `onValueChange: (v) => void`, `min?` (0), `max?` (1), `step?`, `disabled?` |
| `Picker` | `selectedValue`, `onValueChange`, `enabled?`, `appearance?: 'wheel' \| 'menu'` + `<Picker.Item label value />` children |
| `TextInput` | `value: ObservableState<string>` (see below), `onChangeText`, `placeholder?` |
| `BottomSheet` | `isPresented: boolean`, `onDismiss: () => void`, `snapPoints?`, `showDragIndicator?`, `children` |
| `Collapsible` | `isOpen`, `onOpenChange`, `label?`, `children` |

`Switch`/`Checkbox` have a **built-in `label` prop** — don't add a sibling `<Text>` for the label. (They also take a minimal prop set — no `style`.)

## Two traps

### 1. `TextInput.value` is an ObservableState, not a string

`@expo/ui` `TextInput` does not take a plain `useState` string. Bind it with `useNativeState`:

```tsx
import { Host, TextInput, useNativeState } from '@expo/ui'

function EmailField() {
  const email = useNativeState('')       // ObservableState<string> = { value: string }
  return (
    <Host matchContents>
      <TextInput value={email} onChangeText={(t) => (email.value = t)} placeholder="Email" />
    </Host>
  )
}
```

### 2. Child components' `style` is restricted — but `Host`'s is not

The native child components (`Button`, `TextInput`, and anything extending the universal base props) accept only a **restricted `UniversalStyle`** subset: `padding*`, `backgroundColor`, `borderRadius`, `borderWidth`, `borderColor`, `opacity`, `width`, `height`. **`flex`, `gap`, and `margin` are type errors on a child's `style`** (`'flex' does not exist in type 'UniversalStyle'`). Use `Column` / `Row` / `Spacer` for native layout of the children.

`<Host>` itself takes a full `ViewStyle`, so `flex`/`gap`/`margin` are valid there.

```tsx
<Host style={{ flex: 1, gap: 8 }}>        {/* ✅ Host takes full ViewStyle */}
  <Button style={{ flex: 1 }}>x</Button>  {/* ❌ type error — child style is UniversalStyle */}
  <Column spacing={8}>                    {/* ✅ native layout for children */}
    <Button>A</Button>
    <Button>B</Button>
  </Column>
</Host>
```

## Theming native controls

By default native controls follow the **OS light/dark appearance** — ad-hoc per-control color props are mostly ignored. To theme them, drive the whole subtree from the `Host`:

- `<Host seedColor={color}>` — applies as the SwiftUI tint on iOS and generates a Material 3 palette on Android.
- `<Host colorScheme="dark">` — forces light/dark on the subtree.

Don't expect `<Button color={colors.tint}>` to tint a button; set `seedColor` on the enclosing `Host` instead.

## Picker (compound API)

```tsx
import { Host, Picker } from '@expo/ui'

<Host matchContents>
  <Picker selectedValue={lang} onValueChange={setLang}>
    <Picker.Item label="English" value="en" />
    <Picker.Item label="العربية" value="ar" />
  </Picker>
</Host>
```

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Component renders nothing | Wrap it in `<Host>` |
| `import { Button } from '@expo/ui/swift-ui'` for a cross-platform screen | Import from root `'@expo/ui'` |
| `<TextInput value={str} />` with a `useState` string | Use `useNativeState('')`, pass the `ObservableState` |
| `<Button style={{ flex: 1 }}>` | Child `style` is `UniversalStyle` (no flex/gap/margin); use `Column`/`Row`/`Spacer`, or put flex on the `Host` |
| `<Button color={colors.tint}>` to theme it | Set `seedColor` (or `colorScheme`) on the enclosing `<Host>` |
| Adding a `<Text>` next to `<Switch>` for its label | Use the built-in `label` prop |
| Adding a config plugin to `app.json` for @expo/ui | Not needed — no config plugin required |

## Platform escape hatches

For platform-specific components/modifiers not in the universal set:
`import { ... } from '@expo/ui/swift-ui'` (iOS) or `'@expo/ui/jetpack-compose'` (Android), plus `'@expo/ui/swift-ui/modifiers'` / `'@expo/ui/jetpack-compose/modifiers'`. Prefer the root universal import unless you specifically need platform-only behavior.
