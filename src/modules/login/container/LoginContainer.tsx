import { ApiUrls } from "@/constants/ApiUrls";
import { AppRoutes } from "@/constants/AppConstants";
import { useLoader } from "@/contexts/LoadingContext";
import { userActions } from "@/features/userSlice";
import { loginUser } from "@/services/api";
import { setAuthToken } from "@/services/ApiClient";
import { ErrorHandler } from "@/services/ErrorHandler";
import type { AppDispatch } from "@/store/store";
import type { LoginRequest } from "@/types/api/login";
import { showAppAlert } from "@/utils/showAppAlert";
import { setStorageItem, StorageKeys } from "@/utils/storage";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LoginPresenter from "../presenter/LoginPresenter";
const LoginContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, showLoading, hideLoading } = useLoader();
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isMobileTab, setIsMobileTab] = useState(false);

  const handleLoginTypeTabSwitch = (isMobile: boolean) => {
    setIsMobileTab(isMobile);
  };
  const handleLogin = async () => {
    if (isMobileTab) {
      handleOPTLogin();
      return;
    }

    if (loading) return;

    const email = emailId.trim();
    if (!email || !password) {
      showAppAlert("Missing information", "Enter your email and password.");
      return;
    }

    const request: LoginRequest = { email, password };
    showLoading();
    try {
      const response = await loginUser(request, ApiUrls.login);
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        profile_completed: profileCompleted,
      } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Login response did not include auth tokens.");
      }

      const session = {
        email: request.email,
        accessToken,
        refreshToken,
        tokenType,
        profileCompleted,
      };

      setAuthToken(accessToken);
      dispatch(userActions.setCredentials(session));
      try {
        await setStorageItem(StorageKeys.authSession, session);
      } catch (storageError) {
        console.error(
          "Unable to persist the authenticated session.",
          storageError,
        );
      }
      router.replace(AppRoutes.home);
    } catch (error) {
      const message = isAxiosError<{ message?: unknown; detail?: unknown }>(
        error,
      )
        ? typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : typeof error.response?.data?.detail === "string"
            ? error.response.data.detail
            : ErrorHandler(error).message
        : error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.";
      showAppAlert("Login failed", message);
    } finally {
      hideLoading();
    }
  };

  const gotoRegistration = () => {
    router.push(AppRoutes.registration);
  };
  const handleOPTLogin = () => {
    router.push({
      pathname: AppRoutes.otp,
      params: { mobileNumber },
    });
  };
  return (
    <LoginPresenter
      mobile={mobileNumber}
      setMobile={setMobileNumber}
      email={emailId}
      password={password}
      setEmail={setEmailId}
      setPassword={setPassword}
      isMobileTab={isMobileTab}
      setIsMobileTab={setIsMobileTab}
      handleLogin={handleLogin}
      isLoading={loading}
      gotoRegistration={gotoRegistration}
      handleTabSwitch={handleLoginTypeTabSwitch}
    />
  );
};

export default LoginContainer;
