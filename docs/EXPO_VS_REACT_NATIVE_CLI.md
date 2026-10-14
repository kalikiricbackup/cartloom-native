# Expo vs React Native CLI

| Area | Expo managed workflow | React Native CLI |
|---|---|---|
| Start | `npx create-expo-app`, then `npx expo start` | `npx @react-native-community/cli init` |
| Native folders | Usually hidden until prebuild | `android/` and `ios/` exist immediately |
| Device testing | Expo Go or development build | Android Studio/device and Xcode/device |
| Native modules | Expo SDK modules and config plugins | Add library, configure Gradle/Pods/native code yourself |
| Build | EAS Build or `npx expo run:*` | Gradle, Xcode, Fastlane/CI configuration |
| OTA updates | Expo Updates ecosystem | Configure CodePush or a different OTA approach |
| Routing | Expo Router file-based navigation | Install and configure React Navigation manually |
| Native control | Config plugins/prebuild/dev builds | Direct native source control from day one |

## Routing: Expo Router vs CLI manual approach

### Expo Router in this project

The file structure is the route definition:

```text
app/(tabs)/products.tsx  → Product Listing tab
app/product/[id].tsx     → Dynamic product detail
app/account/orders.tsx   → My Orders screen
```

Navigate with:

```ts
import { router } from "expo-router";
router.push({ pathname: "/product/[id]", params: { id: "iphone-15" } });
```

Expo Router uses the `expo-router` config plugin in `app.json` and `"main": "expo-router/entry"` in `package.json`. A root `app/_layout.tsx` defines navigator layouts. Expo documentation describes Expo Router as file-based routing and provides Stack/Tabs APIs through `expo-router`. [Expo Router docs](https://docs.expo.dev/versions/latest/sdk/router/)

### React Native CLI with React Navigation

First install navigation packages, then manually declare the route map:

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Navigation is explicit:

```ts
navigation.navigate("ProductDetail", { id: "iphone-15" });
```

You also manage native module setup, iOS Pods, Android Gradle changes, permissions, build signing, and upgrades. Expo is not “less native”; it provides managed defaults and a path to prebuild/development builds when native customization is needed.
