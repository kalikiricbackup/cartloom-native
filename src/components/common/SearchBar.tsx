import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";

import { useAppTheme } from "@/utils/useTheme";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPress?: () => void;
  onClear?: () => void;
  onSubmitEditing?: () => void;
  accessibilityLabel?: string;
  autoFocus?: boolean;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  returnKeyType?: TextInputProps["returnKeyType"];
}

export default function SearchBar({
  placeholder,
  value = "",
  onChangeText,
  onPress,
  onClear,
  onSubmitEditing,
  accessibilityLabel,
  autoFocus = false,
  outlined = false,
  style,
  returnKeyType = "search",
}: SearchBarProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const inputRef = useRef<TextInput>(null);
  const editable = onChangeText !== undefined;

  useEffect(() => {
    if (!autoFocus || !editable) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [autoFocus, editable]);

  const content = (
    <>
      <Ionicons
        color={theme.colors.textTertiary}
        name="search-outline"
        size={20}
      />
      {editable ? (
        <TextInput
          accessibilityLabel={accessibilityLabel ?? placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          ref={inputRef}
          returnKeyType={returnKeyType}
          style={styles.input}
          value={value}
        />
      ) : (
        <Text numberOfLines={1} style={styles.placeholder}>
          {placeholder}
        </Text>
      )}
      {editable && value.length > 0 && onClear ? (
        <Pressable
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onClear}
        >
          <Ionicons
            color={theme.colors.textTertiary}
            name="close-circle"
            size={19}
          />
        </Pressable>
      ) : null}
    </>
  );

  const containerStyle = [
    styles.container,
    outlined && styles.outlined,
    style,
  ];

  if (!editable && onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel ?? placeholder}
        accessibilityRole="button"
        onPress={onPress}
        style={containerStyle}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      flexDirection: "row",
      gap: theme.spacing.sm,
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    outlined: {
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    input: {
      backgroundColor: "transparent",
      borderWidth: 0,
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.bodySmall,
      outlineWidth: 0,
      paddingVertical: theme.spacing.sm,
    },
    placeholder: {
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.bodySmall,
    },
  });
