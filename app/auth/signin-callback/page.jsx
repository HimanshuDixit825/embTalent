"use client";
import { useEffect, useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthPopup from "@/components/AuthPopup";
import { checkUserAuth } from "@/lib/authUtils";

export default function SignInCallback() {
    const { user, isSignedIn } = useUser();
    const { signIn } = useSignIn();
    const router = useRouter();
    const [authPopup, setAuthPopup] = useState({ show: false, message: "", type: "error" });

    useEffect(() => {
        const handleCallback = async () => {
            if (!isSignedIn || !user) return;

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
                                !authCheck.user.socialProvider.includes("google") && 
                                user.id !== authCheck.user.id) {
                                setAuthPopup({
                                    show: true,
                                    message: `An account with this email already exists. Please sign in with ${authCheck.user.socialProvider} instead.`,
                                    type: "error"
                                });
                                return;
                            }
                            
                            // If user exists with email/password, we'll link the Google auth to this account
                            if (!authCheck.user.isSocialLogin && user.id !== authCheck.user.id) {
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
                const temporary_token = localStorage.getItem('recruitment_flow_token');
                
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
                    // Create or get user in ra_users_duplicate
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

                    // Try to create user first
                    const createUserResponse = await fetch("/api/users/duplicate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData),
                    });

                    if (createUserResponse.ok) {
                        // New user created
                        const createData = await createUserResponse.json();
                        numericId = parseInt(createData.numericId);
                    } else {
                        // User might already exist, try to get existing user
                        const getUserResponse = await fetch(`/api/users/duplicate?userid=${user.id}`);
                        
                        if (!getUserResponse.ok) {
                            throw new Error("Failed to get or create user");
                        }
                        
                        const getUserData = await getUserResponse.json();
                        numericId = parseInt(getUserData.numericId);
                    }
                }

                if (!numericId || isNaN(numericId)) {
                    throw new Error("Failed to get valid numeric ID");
                }

                // Link record to user using numeric ID if temporary token exists
                if (temporary_token) {
                    const linkResponse = await fetch("/api/lead-line-item", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            temporary_token,
                            user_id: numericId
                        }),
                    });

                    if (!linkResponse.ok) {
                        const errorData = await linkResponse.json();
                        throw new Error(`Failed to link record: ${JSON.stringify(errorData)}`);
                    }

                    // Clear temporary token
                    localStorage.removeItem('recruitment_flow_token');
                }
                
                // Redirect to dashboard
                router.push("/dashboard");
            } catch (error) {
                console.error("Callback error:", error);
                router.push("/auth/sign-in");
            }
        };

        handleCallback();
    }, [isSignedIn, user, router]);

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
                    <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                </div>
            )}
        </div>
    );
}
