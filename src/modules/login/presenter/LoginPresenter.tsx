import CustomButton from "@/components/common/CustomButton";
import { useAppTheme } from "@/utils/useTheme";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginPresenterProps {
  mobile: string;
  setMobile: (value: string) => void;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  isMobileTab: boolean;
  setIsMobileTab: (value: boolean) => void;
  handleLogin: () => void;
  isLoading: boolean;
  gotoRegistration: () => void;
  handleTabSwitch: (isMobile: boolean) => void;
}

const LoginPresenter = (props: LoginPresenterProps) => {
  const theme = useAppTheme();
  const colors = theme.colors;
  const styles = createStyles(theme);
  return (
    <ScrollView>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar
          backgroundColor={colors.primaryDark}
          barStyle="light-content"
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🛍 ShopKart</Text>
        </View>

        {/* Content Card */}
        <View style={styles.content}>
          <View
            nativeID="recaptcha-container"
            style={styles.recaptchaContainer}
          />

          <Text style={styles.title}>Welcome Back 👋</Text>

          <Text style={styles.subtitle}>
            Login or Signup to continue your shopping journey
          </Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => props.handleTabSwitch(true)}
              style={
                props.isMobileTab
                  ? [styles.activeTab, { borderBottomColor: colors.primary }]
                  : styles.tab
              }
            >
              <Text
                style={
                  props.isMobileTab ? styles.activeTabText : styles.tabText
                }
              >
                Mobile Number
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.handleTabSwitch(false)}
              style={
                !props.isMobileTab
                  ? [styles.activeTab, { borderBottomColor: colors.primary }]
                  : styles.tab
              }
            >
              <Text
                style={
                  !props.isMobileTab ? styles.activeTabText : styles.tabText
                }
              >
                Email Address
              </Text>
            </TouchableOpacity>
          </View>

          {props.isMobileTab ? (
            <View
              style={[styles.inputRow, { borderColor: colors.inputBorder }]}
            >
              <View
                style={[
                  styles.countryCode,
                  { borderRightColor: colors.inputBorder },
                ]}
              >
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.code}>+91</Text>
              </View>

              <TextInput
                autoComplete="tel"
                editable
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                maxLength={10}
                onChangeText={(value) =>
                  props.setMobile(value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter mobile number"
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={props.mobile}
              />
            </View>
          ) : (
            <View>
              <TextInput
                autoCapitalize="none"
                value={props.email}
                onChangeText={props.setEmail}
                keyboardType="email-address"
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                textContentType="emailAddress"
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
              />

              <TextInput
                value={props.password}
                onChangeText={props.setPassword}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    marginTop: theme.spacing.xxl,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
              />
            </View>
          )}

          <CustomButton
            style={[styles.button]}
            onPress={props.handleLogin}
            title="Continue"
            loading={props.isLoading}
          />

          <Text
            style={{ color: colors.textSecondary, marginTop: theme.spacing.md }}
          >
            New to ShopKart?{" "}
            <Text
              style={{ color: colors.primary }}
              onPress={props.gotoRegistration}
            >
              Register
            </Text>
          </Text>
        </View>

        <Image
          style={styles.illustration}
          source={require("@/assets/images/login_illustration.png")}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginPresenter;

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.primaryDark,
      paddingHorizontal: theme.spacing.xxl,
      paddingVertical: theme.spacing.lg,
    },
    logo: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.display,
      fontWeight: theme.typography.weight.bold,
    },
    content: {
      padding: theme.spacing.xxl,
    },
    recaptchaContainer: {
      minHeight: 78,
      width: "100%",
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h1,
      fontWeight: theme.typography.weight.bold,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodyLarge,
      marginTop: theme.spacing.sm,
    },
    tabContainer: {
      flexDirection: "row",
      gap: theme.spacing.xxl,
      marginTop: theme.spacing.xxxl,
    },
    activeTab: {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 2,
      paddingBottom: theme.spacing.sm,
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weight.semiBold,
    },
    tab: {
      paddingBottom: theme.spacing.sm,
    },
    tabText: {
      color: theme.colors.textSecondary,
    },
    inputRow: {
      alignItems: "center",
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexDirection: "row",
      marginTop: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.md,
    },
    countryCode: {
      alignItems: "center",
      borderRightColor: theme.colors.inputBorder,
      borderRightWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingRight: theme.spacing.md,
    },
    flag: {
      fontSize: theme.typography.h4,
    },
    code: {
      color: theme.colors.textPrimary,
      fontWeight: theme.typography.weight.semiBold,
    },
    input: {
      borderWidth: 0,
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.bodyLarge,
      outlineWidth: 0,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    emailInput: {
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      fontSize: theme.typography.bodyLarge,
      marginTop: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    button: {
      marginTop: theme.spacing.xxl,
    },
    illustration: {
      width: "100%",
      height: 200,
      resizeMode: "contain",
    },
  });
