import { useAppTheme } from "@/utils/useTheme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const AddressData = (props: any) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View>
      {/* Address */}
      <Text style={styles.label}>Street *</Text>
      <TextInput
        value={props.street}
        onChangeText={props.onStreetChange}
        placeholder="Street"
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.textPrimary,
          },
        ]}
      />
      <Text style={styles.label}>City *</Text>
      <TextInput
        value={props.city}
        onChangeText={props.onCityChange}
        placeholder="City"
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.textPrimary,
          },
        ]}
      />
      <Text style={styles.label}>State *</Text>
      <TextInput
        value={props.state}
        onChangeText={props.onStateChange}
        placeholder="State"
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.textPrimary,
          },
        ]}
      />

      {/* {Pin} */}
      <Text style={styles.label}>Pin *</Text>
      <TextInput
        value={props.pin}
        onChangeText={props.onPinChange}
        placeholder="Pin"
        inputMode="numeric"
        maxLength={6}
        keyboardType="numeric"
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xxl,
          },
        ]}
      />
    </View>
  );
};

export default AddressData;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    label: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      height: 52,
      backgroundColor: theme.colors.inputBackground,
    },
  });
