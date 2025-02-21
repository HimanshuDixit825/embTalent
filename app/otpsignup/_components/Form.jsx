"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate password requirements
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain at least 8 characters with a mix of letters, numbers & symbols"
      );
      return;
    }
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <h1 className="text-[31px] font-semibold text-center text-white mb-4">
          Join Us, Create an account!
        </h1>

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
            className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white pr-20"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-sm"
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
          <p className="text-[10px] text-white mt-0.5">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>
        </div>

        {/* OTP Field */}
        <div>
          <label className="block text-[16px] font-medium text-white mb-1">
            Enter OTP{" "}
            <span className="text-white/60">(confirm your email with us)</span>
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            placeholder="# # # # # #"
            maxLength="6"
            required
          />
        </div>

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

        {/* Sign in Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-[#05140A] text-[20px] hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          Sign in
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
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center px-3 py-2.5 bg-white text-black border border-white/20 rounded-lg hover:bg-white/70 transition-colors"
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
          <button
            type="button"
            className="flex items-center justify-center px-3 py-2.5 bg-white text-black border border-white/20 rounded-lg hover:bg-white/70 transition-colors"
          >
            <Image
              src="/icons8-linkedin-48.png"
              alt="LinkedIn"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-black">LinkedIn</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Form;
