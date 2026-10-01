import CustomButton from "@/components/common/CustomButton";
import Header from "@/components/common/Header";
import { useAppTheme } from "@/utils/useTheme";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateProfilePresenterProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  address: string;
  pin: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPinChange: (value: string) => void;
  onBack: () => void;
  onRegistration: () => void;
  isLoading: boolean;
}

const CreateProfilePresenter = ({
  fullName,
  email,
  password,
  confirmPassword,
  gender,
  address,
  pin,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onGenderChange,
  onAddressChange,
  onPinChange,
  onBack,
  onRegistration,
  isLoading,
}: CreateProfilePresenterProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;
  const styles = createStyles(theme);

  return (
    <ScrollView>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Header
          onBack={onBack}
          style={styles.fullWidthHeader}
          title="Registration"
        />
        {/* Illustration */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.illustrationBackground },
          ]}
        >
          <Image
            source={require("@/assets/images/create-profile.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        {/* Title */}
        <Text style={styles.title}>Welcome to ShopKart!</Text>
        <Text style={styles.subtitle}>Let's personalise your experience</Text>
        {/* Full Name */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            },
          ]}
        />
        {/* Email */}
        <Text style={styles.label}>Email *</Text>
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="test@domain.com"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            },
          ]}
          keyboardType="email-address"
        />
        {/* Password */}
        <Text style={styles.label}>Password *</Text>
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            },
          ]}
        />
        {/* Confirm password */}
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          placeholder="Confirm password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            },
          ]}
        />
        {/* Gender */}
        <Text style={styles.label}>Gender *</Text>

        <View style={styles.genderContainer}>
          {["Male", "Female", "Other"].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.genderItem}
              onPress={() => onGenderChange(item)}
            >
              <View
                style={[
                  styles.radio,
                  { borderColor: colors.border },
                  gender === item && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <Text style={styles.genderText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Address */}
        <Text style={styles.label}>Address *</Text>
        <TextInput
          value={address}
          onChangeText={onAddressChange}
          placeholder="Address"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            },
          ]}
        />

        {/* {Pin} */}
        <Text style={styles.label}>Pin *</Text>
        <TextInput
          value={pin}
          onChangeText={onPinChange}
          placeholder="Pin"
          inputMode="numeric"
          maxLength={6}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
              marginBottom: theme.spacing.xxl,
            },
          ]}
        />

        <CustomButton
          style={[styles.button]}
          onPress={onRegistration}
          title="Continue"
          disabled={isLoading}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateProfilePresenter;
const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.xxl,
    },
    fullWidthHeader: {
      marginHorizontal: -theme.spacing.xxl,
    },
    imageContainer: {
      backgroundColor: theme.colors.illustrationBackground,
      borderRadius: theme.radius.lg,
      marginHorizontal: -theme.spacing.xxl,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 180,
      alignSelf: "center",
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h1,
      fontWeight: theme.typography.weight.bold,
      marginTop: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodyLarge,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.xxl,
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
    genderContainer: {
      flexDirection: "row",
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    genderItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: theme.spacing.xxl,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    genderText: {
      color: theme.colors.textPrimary,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xxl,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    check: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.bold,
    },
    checkboxText: {
      color: theme.colors.textSecondary,
    },
    skipText: {
      textAlign: "center",
      marginTop: theme.spacing.lg,
      color: theme.colors.primary,
      fontWeight: theme.typography.weight.medium,
    },
    button: {
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.xxl,
    },
  });
