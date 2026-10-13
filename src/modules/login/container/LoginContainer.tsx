import { AppRoutes } from "@/constants/AppConstants";
import { loginUser } from "@/features/userSlice";
import { setAuthToken } from "@/services/ApiClient";
import type { AppDispatch, RootState } from "@/store/store";
import type { LoginRequest } from "@/types/api/login";
import { showAppAlert } from "@/utils/showAppAlert";
import { setStorageItem, StorageKeys } from "@/utils/storage";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPresenter from "../presenter/LoginPresenter";
const LoginContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
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

    if (isLoading) return;

    const email = emailId.trim();
    if (!email || !password) {
      showAppAlert("Missing information", "Enter your email and password.");
      return;
    }

    const request: LoginRequest = { email, password };
    try {
      const session = await dispatch(loginUser(request)).unwrap();
      setAuthToken(session.accessToken);
      try {
        await setStorageItem(StorageKeys.authSession, session);
      } catch (storageError) {
        console.error(
          "Unable to persist the authenticated session.",
          storageError,
        );
      }
      blurFocusedWebElement();
      router.replace(AppRoutes.home);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Unable to log in. Please try again.";
      showAppAlert("Login failed", message);
    }
  };

  const gotoRegistration = () => {
    blurFocusedWebElement();
    router.push(AppRoutes.registration);
  };
  const handleOPTLogin = () => {
    blurFocusedWebElement();
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
      isLoading={isLoading}
      gotoRegistration={gotoRegistration}
      onSkip={() => {
        blurFocusedWebElement();
        router.replace(AppRoutes.home);
      }}
      handleTabSwitch={handleLoginTypeTabSwitch}
    />
  );
};

export default LoginContainer;
