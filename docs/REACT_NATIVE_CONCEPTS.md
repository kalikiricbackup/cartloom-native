# React Native Concepts in LootKart Native

## Core UI primitives

- `View` is the layout container, like a web `div`.
- `Text` is required around visible text; raw text cannot be placed directly in a `View`.
- `Pressable` handles native touch interaction and has pressed-state feedback.
- `TextInput` creates a controlled mobile input through `value` and `onChangeText`.
- `ScrollView` renders all children; use it for short forms/details.
- `FlatList` virtualizes long lists; use it for products/orders so off-screen rows are not all mounted.
- `StyleSheet.create` organizes native styles. There is no browser DOM or CSS cascade.
- `SafeAreaProvider` supports notches and safe areas.
- `KeyboardAvoidingView` prevents the mobile keyboard from covering a form.

## Hooks

- `useState`: local phone, OTP, profile, search, and notification state. A normal variable would not update visible UI.
- `useEffect`: mock API fetching and AsyncStorage synchronization. Cleanup is essential for listeners and subscriptions.
- `useRef`: focuses the search input without triggering re-render.
- `useMemo`: caches filtered/paginated product arrays. Direct calculation remains correct for small arrays.
- `useCallback`: stabilizes the search handler. It matters when a memoized child receives it; it is not mandatory everywhere.
- `useReducer`: groups checkout address transitions. One `useState` object is a valid simpler alternative.

## State, Context, Redux and persistence

Redux Toolkit stores shared catalog, cart, wishlist, authentication, and order state. Component state holds temporary UI data. `ThemeContext` demonstrates Context API for low-frequency UI state. `AsyncStorage` replaces browser local storage and must be used asynchronously. It is not encrypted; use `expo-secure-store` for sensitive credentials.

## Routing

Expo Router maps files under `app/` to screens. `(tabs)` and `(auth)` are route groups that organize navigation but do not appear in URLs. `[id].tsx` is a dynamic route, read through `useLocalSearchParams()`. Root `_layout.tsx` owns global providers and the `Stack`.

## Senior interview questions

1. Why use `FlatList` over `ScrollView` for large product data? Virtualization reduces memory/rendering work.
2. How is AsyncStorage different from secure storage? AsyncStorage is unencrypted. Use `expo-secure-store` for tokens/secrets.
3. Why avoid blanket `useMemo` and `useCallback`? They add memory/complexity; profile first.
4. How do route groups help? They create organizational/navigator boundaries without adding the parenthesized folder to the path.
5. How do you test native screens? Unit-test logic, integration-test screens, and verify keyboard, safe area, gestures, accessibility, and performance on real devices.
