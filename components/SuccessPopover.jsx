"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

export default function SuccessPopover({ isOpen, onClose }) {
  const { isSignedIn } = useAuth();

  const handleDashboardClick = () => {
    // Call onClose first to ensure state is cleaned up
    onClose();
    // Then navigate
    if (isSignedIn) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth/sign-up?redirect_url=/dashboard";
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-8 max-w-md w-full mx-4 text-center relative">
        <h2 className="text-[24px] font-bold text-white mb-4">
          Request submitted successfully!
        </h2>
        <p className="text-gray-400 text-[14px] mb-6">
          {isSignedIn
            ? "Your resource requirements have been submitted. You can now review the latest updates on your dashboard."
            : "Your resource requirements have been submitted. Sign up to access your dashboard and track updates."}
        </p>
        <button
          onClick={handleDashboardClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          {isSignedIn ? "Go to Dashboard" : "Sign up"}
        </button>
      </div>
    </div>
  );
}
