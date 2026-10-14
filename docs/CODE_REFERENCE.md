# LootKart Native Code Reference

| File | Concepts / APIs | Why / alternative |
|---|---|---|
| `app/_layout.tsx` | `Stack`, Redux `Provider`, `SafeAreaProvider` | Global native navigation and providers. CLI can use an explicit React Navigation root instead. |
| `app/(tabs)/_layout.tsx` | Expo Router `Tabs` | Builds bottom tabs from files. Manual CLI uses `createBottomTabNavigator`. |
| `Products.tsx` | `useMemo`, `useCallback`, `useRef`, `FlatList` | Filters products, creates stable handler, focuses input, virtualizes item UI. Direct filtering is okay for small lists. |
| `Checkout.tsx` | `useReducer`, `KeyboardAvoidingView` | Models related address transitions and keeps keyboard from covering form. Use `useState` object for small forms. |
| `usePersistedState.ts` | `AsyncStorage`, `Promise.all`, `useEffect` | Hydrates and persists native device data asynchronously. Secure Store is for secrets. |
| `catalogSlice.ts` | `createAsyncThunk`, `createSlice` | Shared typed async product state. Component-level `useEffect` state is enough for one-screen data. |
| `ProductCard.tsx` | typed props, `Pressable`, Redux dispatch | Reusable native product UI and actions. Callback props are an alternative to Redux. |

## Method reminders

- `map()` turns data into UI; always provide stable `key` values.
- `filter()` creates matching results/removes items without mutation.
- `find()` locates one product from a dynamic ID.
- `some()` checks wishlist membership.
- `reduce()` calculates cart total.
- `StyleSheet.create()` keeps native style objects organized; it is not CSS.
- `onPress` is the native equivalent of a common click handler.
- `onChangeText` provides the new text directly, unlike web input events.
