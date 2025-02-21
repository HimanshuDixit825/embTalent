"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

// Form wrapper component
function VerificationForm() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        router.push("/"); // Redirect to home after successful verification
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030D06] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#0F2A1A26] backdrop-blur-md rounded-2xl">
        <h1 className="text-[31px] font-semibold text-center text-white mb-6">
          Verify Your Email
        </h1>

        <p className="text-white text-center mb-6">
          We've sent a verification code to {email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[16px] font-medium text-white mb-1.5">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter code"
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
            className="w-full py-2.5 bg-[#2B734480] hover:bg-[#2B734480]/20 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen bg-[#030D06] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#0F2A1A26] backdrop-blur-md rounded-2xl">
        <h1 className="text-[31px] font-semibold text-center text-white mb-6">
          Loading...
        </h1>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerificationForm />
    </Suspense>
  );
}
