"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Form() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user } = useUser();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        // Set active session
        await setActive({ session: result.createdSessionId });

        // Get temporary token from localStorage
        const temporary_token = localStorage.getItem('recruitment_flow_token');
        
        // Wait a bit for session to be active
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (temporary_token) {
          // If token exists, go to callback to handle linking
          router.push("/auth/signin-callback");
        } else {
          // No token, just go to dashboard
          router.push("/dashboard");
        }
      } else {
        throw new Error("Unable to sign in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPRequest = async () => {
    if (!isLoaded || !formData.email) return;

    setError("");
    setLoading(true);

    try {
      await signIn.create({
        identifier: formData.email,
        strategy: "email_code",
      });

      // Show verification input
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (strategy) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      // Get temporary token before redirecting
      const temporary_token = localStorage.getItem('recruitment_flow_token');
      
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/auth/callback",
        redirectUrlComplete: temporary_token 
          ? "/auth/callback" 
          : "/dashboard",
      });
    } catch (err) {
      setError(err.message || "An error occurred during social login");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative z-10 flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full px-6">
        <h1 className="text-[31px] font-semibold text-center text-white mb-6">
          Sign In!
        </h1>
        <div className="h-px bg-white flex-1" />

        {/* Email/Mobile Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1.5">
            Email/Mobile Number
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="username@gmail.com"
            required
            disabled={loading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* OR Divider */}
        <div className="text-center py-1">
          <div className="flex items-center gap-4 justify-center">
            <div className="h-px bg-white flex-1" />
            <span className="text-white/60">OR</span>
            <div className="h-px bg-white flex-1" />
          </div>
        </div>

        {/* Request OTP Link */}
        <button
          type="button"
          onClick={handleOTPRequest}
          disabled={loading || !formData.email}
          className="w-full py-2.5 bg-[#2B734480] hover:bg-[#2B734480]/20 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Request on Email/Phone OTP"}
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#2B734480] hover:bg-[#2B734480]/20 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Proceed"}
        </button>

        <div className="text-white text-sm flex items-center justify-center">
          or continue with
        </div>

        {/* Social Login */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleSocialLogin("oauth_google")}
            disabled={loading}
            className="flex items-center justify-center p-3 px-5 bg-white border border-white/20 rounded-lg hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        {/* Register Link */}
        <div className="text-center text-white">
          <span className="opacity-60">Don't have an account? </span>
          <Link href="/auth/sign-up" className="text-[#ffffff] hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Form;
