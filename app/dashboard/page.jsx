"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import Sidebar from "@/components/Sidebar";
import RequirementCard from "./components/RequirementCard";

// Loading skeleton component
const RequirementSkeleton = () => (
  <div className="bg-[#131313] rounded-xl p-6 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
  </div>
);

// Fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  // SWR hook for fetching requirements
  const { data, error, mutate } = useSWR(
    isSignedIn && user ? `/api/requirements?userId=${user.id}` : null,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const requirements = data?.data || [];
  const isLoading = !data && !error && isSignedIn;

  // Handle linking existing token
  useEffect(() => {
    const linkExistingToken = async () => {
      if (!isSignedIn || !user || isLinking) return;

      const temporary_token = localStorage.getItem("recruitment_flow_token");
      if (!temporary_token) return;

      setIsLinking(true);
      try {
        const checkUserResponse = await fetch(`/api/users/duplicate?userid=${user.id}`);
        const checkUserData = await checkUserResponse.json();

        if (!checkUserData.exists) {
          const userData = {
            email: user.primaryEmailAddress?.emailAddress,
            name: `${user.firstName} ${user.lastName}`.trim(),
            userid: user.id,
            password: Math.random().toString(36).slice(-8),
            country_code: null,
            mobile_number: null,
            company_name: null,
          };

          const createUserResponse = await fetch("/api/users/duplicate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (!createUserResponse.ok) {
            throw new Error("Failed to store user");
          }
        }

        const numericId = parseInt(checkUserData.numericId);
        if (!numericId || isNaN(numericId)) {
          throw new Error("Failed to get numeric ID");
        }

        const linkResponse = await fetch("/api/lead-line-item", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temporary_token,
            user_id: numericId,
          }),
        });

        if (!linkResponse.ok) {
          throw new Error("Failed to link record");
        }

        localStorage.removeItem("recruitment_flow_token");
        mutate(); // Revalidate requirements after linking
      } catch (error) {
        console.error("Error linking record:", error);
      } finally {
        setIsLinking(false);
      }
    };

    linkExistingToken();
  }, [isSignedIn, user, isLinking, mutate]);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed right-0 top-0 h-full w-[40%]"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
          backgroundSize: "cover",
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full">
        <Sidebar onExpandChange={setIsSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 relative z-10 ${
          isSidebarExpanded ? "ml-[380px]" : "ml-16"
        }`}
      >
        <div className="p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-[40px] font-bold text-white mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-400 italic text-[12px] font-inter">
                  View and manage your resource requirements
                </p>
              </div>
              <button
                onClick={() => {
                  const baseUrl = window.location.origin;
                  window.open(
                    `${baseUrl}/select`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="bg-[#00A36C] hover:bg-[#008f5d] text-white px-4 py-2 rounded-lg"
              >
                + New Requirement
              </button>
            </div>

            {/* Requirements Grid with Loading State */}
            {isLoading ? (
              <div
                className={`grid gap-6 ${
                  isSidebarExpanded
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {[1, 2, 3].map((i) => (
                  <RequirementSkeleton key={i} />
                ))}
              </div>
            ) : requirements.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  isSidebarExpanded
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {requirements.map((req, index) => (
                  <RequirementCard key={index} {...req} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[400px]">
                <h3 className="text-3xl font-semibold text-gray-400">No Requirements</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
