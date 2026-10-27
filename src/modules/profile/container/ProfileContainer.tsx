import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { getCurrentUser } from "@/services/api";
import type { CurrentUser } from "@/types/api/profile";
import type { RootState } from "@/store/store";
import ProfilePresenter from "../presenter/ProfilePresenter";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to load your profile. Please try again.";
};

export default function ProfileContainer() {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!accessToken) {
        if (active) {
          setProfile(null);
          setError("Sign in to view your profile.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const currentUser = await getCurrentUser(accessToken);
        if (active) setProfile(currentUser);
      } catch (loadError) {
        if (active) setError(getErrorMessage(loadError));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [accessToken, retryKey]);

  return (
    <ProfilePresenter
      profile={profile}
      isLoading={isLoading}
      error={error}
      onBack={() => router.back()}
      onRetry={() => setRetryKey((current) => current + 1)}
      onSignIn={() => router.replace(AppRoutes.login)}
    />
  );
}
