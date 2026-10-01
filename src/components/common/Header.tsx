import { useAppTheme } from "@/utils/useTheme";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function Header({ title, onBack, style }: HeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.header, style]}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    header: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryDark,
      flexDirection: "row",
      minHeight: 52,
      paddingHorizontal: theme.spacing.xxl,
    },
    backButton: {
      paddingVertical: theme.spacing.md,
    },
    backButtonPlaceholder: {
      height: 44,
      width: 28,
    },
    backArrow: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.h1,
      lineHeight: 28,
    },
    title: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.subtitle,
      fontWeight: theme.typography.weight.semiBold,
      marginLeft: theme.spacing.lg,
    },
  });
