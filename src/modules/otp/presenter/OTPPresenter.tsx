import Header from "@/components/common/Header";
import { useAppTheme } from "@/utils/useTheme";
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface OTPPresenterProps {
  mobileNumber: string;
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onBack: () => void;
  onVerify: () => void;
  onChangeNumber: () => void;
}
const OTPPresenter = (props: OTPPresenterProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;
  const styles = createStyles(theme);
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        backgroundColor={colors.primaryDark}
        barStyle="light-content"
      />
      <Header onBack={props.onBack} title="Verify OTP" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          style={styles.illustration}
          source={require("@/assets/images/otp_illustration.png")}
        />
        <Text style={styles.title}>Almost there!</Text>
        <Text style={styles.subtitle}>Verify your number</Text>
        <Text style={styles.label}>We&apos;ve sent a 6-digit OTP to</Text>
        <View style={styles.numberRow}>
          <Text style={styles.number}>{props.mobileNumber}</Text>
          <Pressable onPress={props.onChangeNumber}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>
        <View style={styles.otpRow}>
          {props.otp.map((digit, index) => (
            <TextInput
              key={index}
              accessibilityLabel={`OTP digit ${index + 1}`}
              autoComplete="one-time-code"
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(value) =>
                props.onOtpChange(index, value.replace(/[^0-9]/g, ""))
              }
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.textPrimary,
                },
              ]}
              textAlign="center"
              textAlignVertical="center"
              value={digit}
            />
          ))}
        </View>
        <Text style={styles.resendText}>Resend OTP in 00:28</Text>
        <Pressable
          accessibilityRole="button"
          onPress={props.onVerify}
          style={[styles.verifyButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.verifyText}>Verify OTP</Text>
        </Pressable>
        <Pressable onPress={props.onChangeNumber} style={styles.changeButton}>
          <Text style={styles.changeText}>Change Number</Text>
        </Pressable>
        <Text style={styles.securityText}>
          Your information is secure with us
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OTPPresenter;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    content: {
      alignItems: "stretch",
      padding: theme.spacing.xxl,
      paddingBottom: theme.spacing.xxxxl,
    },
    illustration: {
      alignSelf: "center",
      height: 190,
      marginBottom: theme.spacing.sm,
      resizeMode: "contain",
      width: "100%",
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h3,
      fontWeight: theme.typography.weight.bold,
      marginTop: theme.spacing.xs,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body,
      marginTop: theme.spacing.xs,
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.label,
      marginTop: theme.spacing.xxl,
    },
    numberRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },
    number: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.bold,
    },
    editText: {
      color: theme.colors.primary,
      fontSize: theme.typography.label,
      fontWeight: theme.typography.weight.semiBold,
    },
    otpRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
      justifyContent: "center",
      marginTop: theme.spacing.lg,
    },
    otpInput: {
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h4,
      fontWeight: theme.typography.weight.bold,
      height: 48,
      padding: 0,
      textAlign: "center",
      textAlignVertical: "center",
      width: 40,
    },
    resendText: {
      alignSelf: "center",
      color: theme.colors.primary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.semiBold,
      marginTop: theme.spacing.lg,
    },
    verifyButton: {
      alignItems: "center",
      borderRadius: theme.radius.sm,
      justifyContent: "center",
      marginTop: theme.spacing.lg,
      minHeight: 48,
    },
    verifyText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.bold,
    },
    changeButton: { alignSelf: "center", padding: theme.spacing.sm },
    changeText: {
      color: theme.colors.primary,
      fontSize: theme.typography.label,
      fontWeight: theme.typography.weight.semiBold,
    },
    securityText: {
      alignSelf: "center",
      color: theme.colors.success,
      fontSize: theme.typography.caption,
      marginTop: theme.spacing.lg,
    },
  });
