"use client";
import React, { useState } from "react";

function Form() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative z-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-3xl font-semibold text-center text-white mb-8">
          Hey, Welcome Back!
        </h1>

        {/* Email/Mobile Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email/Mobile Number
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            placeholder="username@gmail.com"
            required
          />
        </div>

        {/* OTP Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            placeholder="# # # # # #"
            maxLength="6"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors mt-6"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
