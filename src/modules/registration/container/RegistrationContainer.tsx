import { ApiUrls } from "@/constants/ApiUrls";
import { AppRoutes } from "@/constants/AppConstants";
import { useLoader } from "@/contexts/LoadingContext";
import { userActions } from "@/features/userSlice";
import { registerUser } from "@/services/api";
import { setAuthToken } from "@/services/ApiClient";
import type { AppDispatch } from "@/store/store";
import type { RegisterRequest } from "@/types/api/registration";
import { showAppAlert } from "@/utils/showAppAlert";
import { setStorageItem, StorageKeys } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import CreateProfilePresenter from "../presenter/RegistrationPresenter";
const CreateProfileContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, showLoading, hideLoading } = useLoader();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");

  const handleFullNameChange = (value: string) => {
    setFullName(value);
  };
  const handleEmailChange = (value: string) => {
    setEmail(value);
  };
  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };
  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
  };
  const handlePinChange = (value: string) => {
    setPin(value);
  };
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(AppRoutes.login);
  };
  const handleRegistration = async () => {
    if (loading) return;

    if (!fullName.trim() || !email.trim() || !address.trim() || !pin.trim()) {
      showAppAlert(
        "Missing information",
        "Please complete all required fields.",
      );
      return;
    }

    if (address.trim().length < 5) {
      showAppAlert("Invalid address", "Address must be at least 5 characters.");
      return;
    }

    if (!password || password !== confirmPassword) {
      showAppAlert(
        "Invalid password",
        password ? "Passwords do not match." : "Please enter a password.",
      );
      return;
    }

    const genderCode = {
      Male: 0,
      Female: 1,
      Other: 2,
    } as const;

    if (!(gender in genderCode)) {
      showAppAlert("Missing information", "Please select a gender.");
      return;
    }

    const request: RegisterRequest = {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      gender: genderCode[gender as keyof typeof genderCode],
      address: address.trim(),
      pin: pin.trim(),
    };
    showLoading();
    try {
      const response = await registerUser(request, ApiUrls.register);
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        profile_completed: profileCompleted,
      } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error("Registration response did not include auth tokens.");
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
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to create your account. Please try again.";
      showAppAlert("Registration failed", message);
    } finally {
      hideLoading();
    }
  };

  return (
    <CreateProfilePresenter
      fullName={fullName}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      gender={gender}
      address={address}
      pin={pin}
      onFullNameChange={handleFullNameChange}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onGenderChange={handleGenderChange}
      onAddressChange={handleAddressChange}
      onPinChange={handlePinChange}
      onBack={handleBack}
      onRegistration={handleRegistration}
      isLoading={loading}
    />
  );
};

export default CreateProfileContainer;
