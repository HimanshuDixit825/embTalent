// app/auth/callback/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSignUp, useUser, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthPopup from "@/components/AuthPopup";
import { checkUserAuth } from "@/lib/authUtils";

export default function AuthCallback() {
  const { isLoaded, signUp } = useSignUp();
  const { signIn } = useSignIn();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [authPopup, setAuthPopup] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Check if user already exists with this email but with different auth method
        const email = user.primaryEmailAddress?.emailAddress;
        let existingUserId = null;
        
        if (email) {
          try {
            const authCheck = await checkUserAuth(email);
            if (authCheck.exists) {
              // If it's a social login but not Google, show popup
              if (authCheck.user.isSocialLogin && 
                  authCheck.user.socialProvider !== "google" && 
                  !authCheck.user.socialProvider.includes("google")) {
                setAuthPopup({
                  show: true,
                  message: `An account with this email already exists. Please sign in with ${authCheck.user.socialProvider} instead.`,
                  type: "error"
                });
                return;
              }
              
              // If user exists with email/password, we'll link the Google auth to this account
              if (!authCheck.user.isSocialLogin) {
                console.log("Found existing email account, will link with Google auth");
                existingUserId = authCheck.user.id;
              }
            }
          } catch (err) {
            console.error("Error checking user auth:", err);
            // Continue with the flow if check fails
          }
        }
        // Get temporary token from localStorage
        const temporary_token = localStorage.getItem("recruitment_flow_token");

        let numericId = null;
        
        if (existingUserId) {
          // If we found an existing email account, update it to link with Google
          const updateUserResponse = await fetch("/api/users/duplicate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: existingUserId,
              email: user.primaryEmailAddress?.emailAddress,
              name: `${user.firstName} ${user.lastName}`.trim(),
              userid: user.id, // Add the Google userid to the existing account
              is_social_login: true, // Now they can use both methods
              social_provider: "email,google", // Indicate both methods are available
            }),
          });
          
          if (!updateUserResponse.ok) {
            const error = await updateUserResponse.json();
            throw new Error(error.message || "Failed to update user");
          }
          
          const updateUserData = await updateUserResponse.json();
          console.log("Updated user response:", updateUserData);
          numericId = parseInt(updateUserData.numericId);
        } else {
          // Check if user exists in ra_users_duplicate by Clerk ID
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
          numericId = checkUserData.exists ? parseInt(checkUserData.numericId) : null;

          if (!checkUserData.exists) {
            // User doesn't exist, create new user
            const userData = {
              email: user.primaryEmailAddress?.emailAddress,
              name: `${user.firstName} ${user.lastName}`.trim(),
              userid: user.id,
              password: Math.random().toString(36).slice(-8),
              country_code: null,
              mobile_number: null,
              company_name: null,
              is_social_login: true,
              social_provider: "google",
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
        }

        if (!numericId || isNaN(numericId)) {
          throw new Error("Failed to get numeric ID from ra_users_duplicate");
        }

        console.log("Using numeric ID for linking:", numericId);

        // Link record to user using numeric ID if temporary token exists
        if (temporary_token) {
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

          // Clear temporary token
          localStorage.removeItem("recruitment_flow_token");
        }
        
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Callback error:", error);
        // Handle error appropriately
        router.push("/auth/sign-in");
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {authPopup.show ? (
        <div className="text-center">
          <AuthPopup
            message={authPopup.message}
            type={authPopup.type}
            onClose={() => {
              setAuthPopup({ show: false, message: "", type: "error" });
              router.push("/auth/sign-in");
            }}
          />
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Setting up your account...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}
    </div>
  );
}
