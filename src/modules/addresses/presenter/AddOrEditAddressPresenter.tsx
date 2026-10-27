import AddressData from "@/components/common/AddressData";
import CustomButton from "@/components/common/CustomButton";
import Header from "@/components/common/Header";
import { useAppTheme } from "@/utils/useTheme";
import React from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface AddOrEditAddressPresenterProps {
  address: string;
  isEditing: boolean;
  label: string;
  street: string;
  city: string;
  state: string;
  pin: string;
  onNavigateBack: () => void;
  onAddressChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onPinChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onSaveAddress: () => void;
}

const AddOrEditAddressPresenter = (props: AddOrEditAddressPresenterProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Header
        title={props.isEditing ? "Edit Address" : "Add Address"}
        onBack={props.onNavigateBack}
      />

      {/* Type of Address */}
      <Text style={styles.label}>Type of Address *</Text>
      <TextInput
        value={props.label}
        onChangeText={props.onLabelChange}
        placeholder="Type of Address e.g Home, Office"
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

      {/*Address */}
      <Text style={styles.label}>Address *</Text>
      <TextInput
        value={props.address}
        onChangeText={props.onAddressChange}
        placeholder="e.g 123 Main St, Apt 4B"
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
      <AddressData
        street={props.street}
        city={props.city}
        state={props.state}
        pin={props.pin}
        onStreetChange={props.onStreetChange}
        onCityChange={props.onCityChange}
        onStateChange={props.onStateChange}
        onPinChange={props.onPinChange}
      />
      <CustomButton title="Save Address" onPress={props.onSaveAddress} />
    </SafeAreaView>
  );
};

export default AddOrEditAddressPresenter;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
      marginHorizontal: theme.spacing.md,
    },
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
