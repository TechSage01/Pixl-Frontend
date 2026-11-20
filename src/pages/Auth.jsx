import React, { useState } from "react";
import LoginScreen from "./AuthLoginScreen";
import OtpVerificationScreen from "./AuthVerify";

export default function Auth() {
  const [step, setStep] = useState("login"); // Controls whether to show "login" or "otp"
  const [userEmail, setUserEmail] = useState("");

  // Switch to OTP screen after entering email
  const handleSendCode = (email) => {
    setUserEmail(email);
    setStep("otp");
  };

  // Called when the user enters the correct 6-digit code
  const handleVerifySuccess = (responseData) => {
    console.log("Authentication successful!", responseData);
    // Redirect user to dashboard or update app auth state here
  };

  return (
    <>
      {step === "login" ? (
        <LoginScreen onSendCode={handleSendCode} />
      ) : (
        <OtpVerificationScreen
          email={userEmail}
          onBackToSignIn={() => setStep("login")}
          onEditEmail={() => setStep("login")}
          onVerifySuccess={handleVerifySuccess}
        />
      )}
    </>
  );
}