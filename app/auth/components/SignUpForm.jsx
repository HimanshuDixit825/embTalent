"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    // Validate name
    if (!formData.name.trim()) {
      setError("Name is required!");
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Validate password requirements
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least 8 characters with a mix of letters, numbers & symbols"
      );
      setLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First verify with Clerk
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        throw new Error("Unable to verify email address.");
      }

      // Get the user ID from Clerk
      const userId = completeSignUp.createdUserId;

      // Store in database and link with lead record
      try {
        // First create user in duplicate table
        const userResponse = await fetch("/api/users/duplicate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            userid: userId,
          }),
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || "Failed to store user");
        }

        const userData = await userResponse.json();

        // Get token from localStorage
        const token = localStorage.getItem("recruitment_flow_token");

        if (token) {
          // Link lead record to user
          const linkResponse = await fetch("/api/lead-line-item", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              temporary_token: token,
              user_id: userId,
            }),
          });

          if (!linkResponse.ok) {
            console.error(
              "Failed to link lead record:",
              await linkResponse.json()
            );
          }

          // Clear token from localStorage
          localStorage.removeItem("recruitment_flow_token");
        }

        // If successful, set active session and redirect
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } catch (dbError) {
        console.error("Database error:", dbError);
        setError(`Database error: ${dbError.message}`);
        return;
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SignUpForm.jsx
  const handleSocialLogin = async (strategy) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      const signUpResult = await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/auth/callback`,
        redirectUrlComplete: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error("Social login error:", err);
      setError(err.message || "An error occurred during social login");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (verifying) {
    return (
      <div className="space-y-4">
        <h2 className="text-[31px] font-semibold text-center text-white mb-4">
          Verify your email
        </h2>
        <p className="text-white text-center">
          We've sent a verification code to {formData.email}
        </p>
        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-[16px] font-medium text-white mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#05140A] text-[20px] hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <h1 className="text-[31px] font-semibold text-center text-white mb-4">
          Join Us, Create an account!
        </h1>

        {/* Name Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            placeholder="Your full name"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            placeholder="username@gmail.com"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black pr-20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-[10px] text-white mt-0.5">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1">
            Re-Enter Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black pr-20"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="agreeToTerms"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-green-500 focus:ring-green-500"
            required
          />
          <label htmlFor="agreeToTerms" className="text-[12px] text-white">
            By creating an account, you agree to the{" "}
            <Link
              href="/terms"
              className="text-white hover:underline text-[12px]"
            >
              Terms of use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-white hover:underline text-[12px]"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Sign up Button */}
        <button
          type="submit"
          disabled={loading || !formData.agreeToTerms}
          className="w-full py-2.5 px-4 bg-[#05140A] text-[20px] hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {/* Social Login Section */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-[14px]">
            <span className="px-2 py-2 bg-[#030D06] text-white/60">
              or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() => handleSocialLogin("oauth_google")}
            className="flex w-full items-center justify-center px-3 py-2.5 bg-white text-black border border-white/20 rounded-lg hover:bg-white/70 transition-colors"
          >
            <Image
              src="/icons8-google-48.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-black">Google</span>
          </button>
          {/* <button
            type="button"
            onClick={() => handleSocialLogin("oauth_linkedin")}
            className="flex items-center justify-center px-3 py-2.5 bg-white border border-white/20 rounded-lg hover:bg-white/70 transition-colors"
          >
            <Image
              src="/icons8-linkedin-48.png"
              alt="LinkedIn"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-black">LinkedIn</span>
          </button> */}
        </div>

        {/* Login Link */}
        <p className="text-center text-white/60">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
