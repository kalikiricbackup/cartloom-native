import { AppRoutes } from "@/constants/AppConstants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import OTPPresenter from "../presenter/OTPPresenter";

const OTPContainer = () => {
  const router = useRouter();
  const { mobileNumber } = useLocalSearchParams<{ mobileNumber?: string }>();
  const [otp, setOtp] = useState(["5", "8", "2", "9", "1", "4"]);

  const handleOtpChange = (index: number, value: string) => {
    setOtp((currentOtp) =>
      currentOtp.map((digit, digitIndex) =>
        digitIndex === index ? value : digit,
      ),
    );
  };

  const handleVerify = () => {
    console.log("Verifying OTP", otp.join(""));
    router.replace(AppRoutes.registration);
  };

  return (
    <OTPPresenter
      mobileNumber={mobileNumber ?? ""}
      otp={otp}
      onOtpChange={handleOtpChange}
      onBack={() => router.back()}
      onVerify={handleVerify}
      onChangeNumber={() => router.replace(AppRoutes.login)}
    />
  );
};

export default OTPContainer;
