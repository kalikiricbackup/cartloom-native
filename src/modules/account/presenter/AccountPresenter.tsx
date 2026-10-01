import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/utils/useTheme";

export type AccountAction =
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "payments"
  | "notifications"
  | "logout";

interface AccountPresenterProps {
  name: string;
  email: string;
  onBack: () => void;
  onSelectAction: (action: AccountAction) => void;
}

const menuItems: {
  id: AccountAction;
  label: string;
  icon:
    | "person-outline"
    | "heart-outline"
    | "receipt-outline"
    | "location-outline"
    | "card-outline"
    | "notifications-outline"
    | "log-out-outline";
}[] = [
  { id: "profile", label: "Profile", icon: "person-outline" },
  { id: "orders", label: "Orders", icon: "receipt-outline" },
  { id: "wishlist", label: "Wishlist", icon: "heart-outline" },
  { id: "addresses", label: "Addresses", icon: "location-outline" },
  { id: "payments", label: "Payments", icon: "card-outline" },
  {
    id: "notifications",
    label: "Notifications",
    icon: "notifications-outline",
  },
  { id: "logout", label: "Logout", icon: "log-out-outline" },
];

export default function AccountPresenter({
  name,
  email,
  onBack,
  onSelectAction,
}: AccountPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to Home"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={theme.colors.onPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectAction("profile")}
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={27} color={theme.colors.primary} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{name}</Text>
            <Text numberOfLines={1} style={styles.email}>
              {email}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textTertiary}
          />
        </Pressable>

        <View style={styles.menu}>
          {menuItems.map((item, index) => {
            const isLogout = item.id === "logout";
            const color = isLogout ? theme.colors.error : theme.colors.primary;

            return (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() => onSelectAction(item.id)}
                style={[
                  styles.menuRow,
                  index < menuItems.length - 1 && styles.menuRowDivider,
                ]}
              >
                <Ionicons name={item.icon} size={19} color={color} />
                <Text
                  style={[styles.menuLabel, isLogout && styles.logoutLabel]}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={theme.colors.textTertiary}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    header: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryDark,
      flexDirection: "row",
      minHeight: 50,
      paddingHorizontal: theme.spacing.md,
    },
    backButton: {
      alignItems: "center",
      height: 42,
      justifyContent: "center",
      width: 38,
    },
    headerTitle: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.semiBold,
      marginLeft: theme.spacing.sm,
    },
    content: {
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    profileCard: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.md,
      flexDirection: "row",
      gap: theme.spacing.md,
      minHeight: 82,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    avatar: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.round,
      height: 52,
      justifyContent: "center",
      width: 52,
    },
    profileCopy: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    name: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    email: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    menu: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      overflow: "hidden",
    },
    menuRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.md,
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    menuRowDivider: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuLabel: {
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
    logoutLabel: {
      color: theme.colors.error,
    },
  });
