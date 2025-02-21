// app/auth/callback/page.jsx
"use client";
import { useEffect } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const { isLoaded, signUp } = useSignUp();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Get temporary token from localStorage
        const temporary_token = localStorage.getItem("recruitment_flow_token");

        if (!temporary_token) {
          // No temporary token, just redirect to dashboard
          router.push("/dashboard");
          return;
        }

        // Check if user exists in ra_users_duplicate
        const checkUserResponse = await fetch(
          `/api/users/duplicate?userid=${user.id}`
        );
        if (!checkUserResponse.ok) {
          throw new Error(
            `Failed to check user existence: ${await checkUserResponse.text()}`
          );
        }
        const checkUserData = await checkUserResponse.json();
        console.log("Check user response:", checkUserData);

        // Get numeric ID and ensure it's a number
        let numericId = parseInt(checkUserData.numericId);

        if (!checkUserData.exists) {
          // User doesn't exist, create new user
          const userData = {
            email: user.primaryEmailAddress?.emailAddress,
            name: `${user.firstName} ${user.lastName}`.trim(),
            userid: user.id,
            password: Math.random().toString(36).slice(-8),
          };

          const createUserResponse = await fetch("/api/users/duplicate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (!createUserResponse.ok) {
            const error = await createUserResponse.json();
            throw new Error(error.message || "Failed to store user");
          }

          const createUserData = await createUserResponse.json();
          console.log("Create user response:", createUserData);
          numericId = parseInt(createUserData.numericId);
        }

        if (!numericId || isNaN(numericId)) {
          throw new Error("Failed to get numeric ID from ra_users_duplicate");
        }

        console.log("Using numeric ID for linking:", numericId);

        // Link record to user using numeric ID
        const linkResponse = await fetch("/api/lead-line-item", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temporary_token,
            user_id: numericId,
          }),
        });

        if (!linkResponse.ok) {
          const errorData = await linkResponse.json();
          console.error("Failed to link record to user:", errorData);
          throw new Error(
            `Failed to link record: ${JSON.stringify(errorData)}`
          );
        }

        const linkData = await linkResponse.json();
        console.log("Link response:", linkData);

        // Clear temporary token and redirect
        localStorage.removeItem("recruitment_flow_token");
        router.push("/dashboard");
      } catch (error) {
        console.error("Callback error:", error);
        // Handle error appropriately
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Setting up your account...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
