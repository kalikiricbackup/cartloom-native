import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import { useRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useAppTheme } from "@/utils/useTheme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export interface AppHeaderAction {
  accessibilityLabel: string;
  icon: IconName;
  onPress?: () => void;
}

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  rightActions?: AppHeaderAction[];
  style?: StyleProp<ViewStyle>;
}

export default function AppHeader({
  title,
  onBack,
  rightActions = [],
  style,
}: AppHeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const backButtonRef = useRef<View>(null);

  return (
    <View style={[styles.header, style]}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            backButtonRef.current?.blur();
            onBack();
          }}
          ref={backButtonRef}
          style={styles.backButton}
        >
          <Ionicons
            color={theme.colors.onPrimary}
            name="arrow-back"
            size={22}
          />
        </Pressable>
      ) : null}
      <View
        accessibilityLabel="ShopKart app icon"
        accessibilityRole="image"
        style={styles.appIcon}
      >
        <Ionicons
          color={theme.colors.primaryDark}
          name="bag-handle"
          size={18}
        />
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={styles.actions}>
        {rightActions.map((action) =>
          action.onPress ? (
            <Pressable
              accessibilityLabel={action.accessibilityLabel}
              accessibilityRole="button"
              hitSlop={8}
              key={action.accessibilityLabel}
              onPress={action.onPress}
              style={styles.actionButton}
            >
              <Ionicons
                color={theme.colors.onPrimary}
                name={action.icon}
                size={21}
              />
            </Pressable>
          ) : (
            <View
              accessibilityLabel={action.accessibilityLabel}
              accessibilityRole="image"
              key={action.accessibilityLabel}
              style={styles.actionButton}
            >
              <Ionicons
                color={theme.colors.onPrimary}
                name={action.icon}
                size={21}
              />
            </View>
          ),
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    header: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryDark,
      flexDirection: "row",
      minHeight: 58,
      paddingHorizontal: theme.spacing.md,
    },
    backButton: {
      alignItems: "center",
      height: 40,
      justifyContent: "center",
      marginRight: theme.spacing.xs,
      width: 34,
    },
    appIcon: {
      alignItems: "center",
      backgroundColor: theme.colors.warning,
      borderRadius: theme.radius.xs,
      height: 30,
      justifyContent: "center",
      width: 30,
    },
    title: {
      color: theme.colors.onPrimary,
      flex: 1,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
      marginLeft: theme.spacing.sm,
    },
    actions: {
      alignItems: "center",
      flexDirection: "row",
    },
    actionButton: {
      alignItems: "center",
      height: 40,
      justifyContent: "center",
      width: 40,
    },
  });
