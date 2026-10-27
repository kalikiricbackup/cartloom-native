import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import type { CurrentUser } from "@/types/api/profile";
import { useAppTheme } from "@/utils/useTheme";

interface ProfilePresenterProps {
  profile: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onRetry: () => void;
  onSignIn: () => void;
}

type ProfileFieldIcon =
  | "person-outline"
  | "mail-outline"
  | "people-outline"
  | "finger-print-outline";

interface ProfileDetail {
  icon: ProfileFieldIcon;
  label: string;
  value: string;
}

const getGenderLabel = (gender: number | null) => {
  switch (gender) {
    case 0:
      return "Male";
    case 1:
      return "Female";
    case 2:
      return "Others";
    default:
      return "Not provided";
  }
};

export default function ProfilePresenter({
  profile,
  isLoading,
  error,
  onBack,
  onRetry,
  onSignIn,
}: ProfilePresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const profileDetails: ProfileDetail[] = profile
    ? [
        {
          icon: "person-outline",
          label: "Full Name",
          value: profile.full_name || "Not provided",
        },
        {
          icon: "mail-outline",
          label: "Email Address",
          value: profile.email || "Not provided",
        },
        {
          icon: "people-outline",
          label: "Gender",
          value: getGenderLabel(profile.gender),
        },
        {
          icon: "finger-print-outline",
          label: "Customer ID",
          value: String(profile.id),
        },
      ]
    : [];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="My Profile" />
      {isLoading ? (
        <EmptyState fillAvailableSpace loading title="Loading your profile" />
      ) : error ? (
        <EmptyState
          actionLabel={error === "Sign in to view your profile." ? "Sign In" : undefined}
          fillAvailableSpace
          icon="alert-circle-outline"
          message={error}
          onAction={error === "Sign in to view your profile." ? onSignIn : undefined}
          onRetry={error === "Sign in to view your profile." ? undefined : onRetry}
          title="Unable to load profile"
        />
      ) : profile ? (
        <FlatList
          contentContainerStyle={styles.content}
          data={profileDetails}
          keyExtractor={(field) => field.label}
          ItemSeparatorComponent={() => <View style={styles.fieldSeparator} />}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.profileHero}>
                <View style={styles.avatar}>
                  <Ionicons color={theme.colors.primary} name="person" size={36} />
                </View>
                <Text style={styles.name}>
                  {profile.full_name || "Name not provided"}
                </Text>
                <Text style={styles.email}>
                  {profile.email || "Email not provided"}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    profile.profile_completed
                      ? styles.completedBadge
                      : styles.incompleteBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      profile.profile_completed
                        ? styles.completedText
                        : styles.incompleteText,
                    ]}
                  >
                    {profile.profile_completed
                      ? "Profile complete"
                      : "Profile incomplete"}
                  </Text>
                </View>
              </View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
            </View>
          }
          renderItem={({ item, index }) => (
            <ProfileField
              icon={item.icon}
              label={item.label}
              value={item.value}
              first={index === 0}
              last={index === profileDetails.length - 1}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </SafeAreaView>
  );
}

function ProfileField({
  icon,
  label,
  value,
  first = false,
  last = false,
}: {
  icon: ProfileFieldIcon;
  label: string;
  value: string;
  first?: boolean;
  last?: boolean;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.field,
        first && styles.fieldFirst,
        last ? styles.fieldLast : styles.fieldDivider,
      ]}
    >
      <Ionicons color={theme.colors.primary} name={icon} size={19} />
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text selectable style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    listHeader: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    profileHero: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    avatar: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.round,
      height: 76,
      justifyContent: "center",
      width: 76,
    },
    name: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.bold,
      textAlign: "center",
    },
    email: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
      textAlign: "center",
    },
    statusBadge: {
      borderRadius: theme.radius.round,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    completedBadge: {
      backgroundColor: theme.colors.success + "20",
    },
    incompleteBadge: {
      backgroundColor: theme.colors.warning + "20",
    },
    statusText: {
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    completedText: {
      color: theme.colors.success,
    },
    incompleteText: {
      color: theme.colors.warning,
    },
    sectionHeader: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.bold,
      paddingVertical: theme.spacing.md,
    },
    field: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.md,
      minHeight: 68,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    fieldFirst: {
      borderTopWidth: 1,
    },
    fieldLast: {
      borderBottomColor: theme.colors.border,
      borderBottomLeftRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
      borderBottomWidth: 1,
    },
    fieldDivider: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    fieldSeparator: {
      backgroundColor: theme.colors.card,
      height: StyleSheet.hairlineWidth,
      marginHorizontal: 1,
    },
    fieldContent: {
      flex: 1,
      gap: 3,
    },
    fieldLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    fieldValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
  });
