"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInCallback() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            if (!isSignedIn || !user) return;

            try {
                // Get temporary token from localStorage
                const temporary_token = localStorage.getItem('recruitment_flow_token');
                
                if (!temporary_token) {
                    // No temporary token, just redirect to dashboard
                    router.push("/dashboard");
                    return;
                }

                // Create or get user in ra_users_duplicate
                const userData = {
                    email: user.primaryEmailAddress?.emailAddress,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    userid: user.id,
                    password: Math.random().toString(36).slice(-8),
                };

                // console.log("Attempting to create/get user with data:", userData);

                // Try to create user first
                const createUserResponse = await fetch("/api/users/duplicate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                let numericId;
                
                if (createUserResponse.ok) {
                    // New user created
                    const createData = await createUserResponse.json();
                    numericId = parseInt(createData.numericId);
                    // console.log("Created new user with numeric ID:", numericId);
                } else {
                    // User might already exist, try to get existing user
                    // console.log("User creation failed, checking if user exists");
                    const getUserResponse = await fetch(`/api/users/duplicate?userid=${user.id}`);
                    
                    if (!getUserResponse.ok) {
                        throw new Error("Failed to get or create user");
                    }
                    
                    const getUserData = await getUserResponse.json();
                    numericId = parseInt(getUserData.numericId);
                    // console.log("Found existing user with numeric ID:", numericId);
                }

                if (!numericId || isNaN(numericId)) {
                    throw new Error("Failed to get valid numeric ID");
                }

                // console.log("Proceeding with numeric ID for linking:", numericId);

                // Link record to user using numeric ID
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
                    // console.error("Failed to link record to user:", errorData);
                    throw new Error(`Failed to link record: ${JSON.stringify(errorData)}`);
                }

                const linkData = await linkResponse.json();
                // console.log("Link response:", linkData);

                // Clear temporary token and redirect
                localStorage.removeItem('recruitment_flow_token');
                router.push("/dashboard");
            } catch (error) {
                // console.error("Callback error:", error);
                router.push("/auth/sign-in");
            }
        };

        handleCallback();
    }, [isSignedIn, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}
