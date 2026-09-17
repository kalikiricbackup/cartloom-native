# React Native Interview Handbook

## React vs React Native

Used when discussing web vs mobile application development.

- Why: Helps understand where React Native fits in the ecosystem.
- Without: Developers may incorrectly assume React Native renders HTML.
- Alternative: Flutter, Native Android (Kotlin), Native iOS (Swift).

### Example

```text
React -> Browser -> HTML DOM
React Native -> Android/iOS -> Native Components
```

### Interview Answer

> React is a JavaScript library for building web applications, whereas React Native is a framework for building mobile applications. Both share concepts like components, props, state, and hooks, but React renders HTML elements while React Native renders native Android and iOS components.

### Cross Questions

#### Q: Does React Native use WebView?

Answer: No. It renders native UI components.

#### Q: How much code can be shared?

Answer: Usually business logic, APIs, hooks, and utilities can be shared.

### Real Project Example

Migrated separate Android and iOS applications to a single React Native codebase and reduced feature development effort.

---

## useState

Used for local component state.

- Why: Triggers UI updates when state changes.
- Without: UI will not react to value changes.
- Alternative: useReducer, Redux Toolkit.

### Example

```jsx
const [count, setCount] = useState(0);
```

### Interview Answer

> useState is a React Hook used to manage local component state. Whenever state changes, React schedules a re-render and updates the UI.

### Cross Questions

#### Q: Is setState synchronous?

Answer: No, React batches updates.

#### Q: When would you use useReducer instead?

Answer: For complex state transitions.

---

## useEffect

Used for API calls, subscriptions, and event listeners.

- Why: Handles side effects outside rendering.
- Without: Side-effect logic becomes difficult to manage.
- Alternative: Custom hooks.

### Example

```jsx
useEffect(() => {
  fetchUsers();
}, []);
```

### Interview Answer

> useEffect is used to synchronize React components with external systems such as APIs, timers, subscriptions, and browser/native APIs.

### Cross Questions

#### Q: Why use cleanup?

Answer: Prevent memory leaks.

#### Q: What happens without dependency array?

Answer: Effect runs after every render.

---

## useMemo

Used for expensive calculations.

- Why: Prevents unnecessary recalculation.
- Without: Calculation runs on every render.
- Alternative: Direct calculation for small datasets.

### Example

```jsx
const filteredProducts = useMemo(() => {
  return products.filter((p) => p.active);
}, [products]);
```

### Interview Answer

> useMemo memoizes a calculated value and recalculates it only when dependencies change.

### Real Project Example

Used to optimize filtering of thousands of products on a catalog screen.

---

## useCallback

Used for memoizing function references.

- Why: Prevents unnecessary child re-renders.
- Without: New function created on every render.
- Alternative: Regular inline functions.

### Example

```jsx
const handleSave = useCallback(() => {
  saveData();
}, []);
```

### Interview Answer

> useCallback memoizes a function and returns the same function reference between renders unless dependencies change.

### Cross Questions

#### Q: useCallback vs useMemo?

Answer:

- useCallback -> function
- useMemo -> value

---

## React.memo

Used for component memoization.

- Why: Avoids unnecessary renders.
- Without: Child components re-render with parent.
- Alternative: Better component design.

### Example

```jsx
export default React.memo(ProductCard);
```

### Interview Answer

> React.memo performs shallow comparison of props and skips rendering when props have not changed.

---

## FlatList

Used for rendering large datasets.

- Why: Virtualized rendering improves performance.
- Without: ScrollView may cause memory issues.
- Alternative: FlashList.

### Example

```jsx
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
/>
```

### Interview Answer

> FlatList renders only visible items and recycles rows as the user scrolls.

### Senior Question

#### Q: How do you optimize FlatList?

Answer:

- React.memo
- useCallback
- Pagination
- getItemLayout
- FastImage

---

## Redux Toolkit

Used for global state management.

- Why: Centralized predictable state.
- Without: State becomes difficult to manage.
- Alternative: Zustand, Context API.

### Example

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: [],
});
```

### Interview Answer

> Redux Toolkit is the recommended way to write Redux logic and reduces boilerplate using createSlice and createAsyncThunk.

---

## AsyncStorage

Used for local persistence.

- Why: Stores user settings and cached data.
- Without: Data is lost after restart.
- Alternative: MMKV.

### Example

```jsx
await AsyncStorage.setItem("token", token);
```

### Interview Answer

> AsyncStorage is an asynchronous key-value storage solution for React Native.

---

## React Navigation

Used for screen navigation.

- Why: Enables Stack, Drawer, and Tab navigation.
- Without: App cannot navigate between screens.
- Alternative: React Native Navigation.

### Example

```jsx
navigation.navigate("Profile");
```

### Interview Answer

> React Navigation is the most widely used navigation library in React Native applications.

## useReducer — Complex State Management Hook

Used when state transitions become complex and involve multiple related updates.

- Why: Centralizes state update logic in one place.
- Without: Multiple useState hooks become difficult to maintain.
- Alternative: useState, Redux Toolkit.

### Interview Answer

> useReducer is useful when state updates become complex and involve multiple actions. Instead of managing several useState hooks, we centralize all updates inside a reducer function. It makes state transitions predictable, easier to debug, and more scalable.

---

## useContext — Context API Hook

- Why: Provides shared values across component tree.
- Without: Props must be passed through multiple layers.
- Alternative: Redux Toolkit, Zustand.

### Interview Answer

> useContext allows components to access values from a Context Provider without passing props manually through every level.

---

## Redux Persist

- Why: Users remain logged in and settings are retained.
- Without: State resets whenever app restarts.
- Alternative: Manual AsyncStorage implementation.

### Interview Answer

> Redux Persist automatically stores Redux state in local storage and rehydrates it when the application launches.

---

## RTK Query

- Why: Reduces Redux API boilerplate.
- Without: Manual async state management is required.
- Alternative: React Query, SWR.

### Interview Answer

> RTK Query automatically manages loading states, caching, request deduplication, and refetching.

---

## FlashList

- Why: Better performance than FlatList for huge datasets.
- Without: FPS drops can occur on lower-end devices.
- Alternative: FlatList.

### Interview Answer

> FlashList is Shopify's optimized list component designed for large datasets and smoother scrolling.

---

## Hermes Engine

- Why: Faster startup time.
- Without: Higher JavaScript overhead.
- Alternative: JavaScriptCore.

### Interview Answer

> Hermes is a lightweight JavaScript engine optimized for React Native.

---

## JSI

- Why: Removes bridge serialization overhead.
- Without: Communication goes through the legacy bridge.
- Alternative: Legacy architecture.

### Interview Answer

> JSI allows JavaScript and Native code to communicate directly without bridge serialization.

---

## Zustand

- Why: Simpler global state management.
- Without: Redux may be overkill for simple apps.
- Alternative: Redux Toolkit.

### Interview Answer

> Zustand provides global state management with minimal boilerplate and excellent developer experience.

---

## Axios Interceptors

### Interview Answer

> Axios interceptors centralize token injection, request logging, refresh-token handling, and global error processing.

---

## Token Refresh Strategy

### Interview Answer

> Refresh tokens allow applications to safely issue new access tokens without forcing users to log in repeatedly.

---

## Image Optimization

### Interview Answer

> Image optimization includes compression, caching, CDN delivery, and lazy loading to improve performance.

---

## Native Modules

### Interview Answer

> Native Modules expose platform-specific functionality such as cameras, biometrics, Bluetooth, and payment SDKs to JavaScript.

---

## Push Notifications

### Interview Answer

> Push notifications increase user engagement and are typically implemented using Firebase Cloud Messaging.

---

## Offline First Architecture

### Interview Answer

> Offline-first applications store data locally and synchronize changes when connectivity returns.

---

## Code Splitting

### Interview Answer

> Code splitting improves startup performance by loading functionality only when required.

---

## App Architecture

### Interview Answer

> A scalable architecture separates concerns into features, APIs, state management, navigation, services, and reusable components.

---

## Senior Scenario — Authentication System Design

### Interview Answer

> For a production application, I would use JWT authentication, secure token storage, Axios interceptors, token refresh logic, protected routes, and centralized auth state management.
