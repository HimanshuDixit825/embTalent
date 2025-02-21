"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RequirementCard from "./components/RequirementCard";

// Default requirements as fallback
const defaultRequirements = [
  {
    title: "GenAI & Blockchain - ML/AI Engineer",
    level: "Senior",
    duration: "12 Months",
    role: "Machine Learning Engineer",
    mustHaveSkills: "Model Training, Data Preprocessing, MLOps",
    goodToHaveSkills: "NLP, Computer Vision, Blockchain Integration",
  },
  {
    title: "Software Development - Full Stack Developer",
    level: "Mid Senior",
    duration: "6 Months",
    role: "Full Stack Developer | MERN Stack",
    mustHaveSkills: "API Development, Frontend Optimization",
    goodToHaveSkills: "GraphQL, Docker, Microservices",
  },
  {
    title: "Cloud & DevOps - Site Reliability Engineer",
    level: "Staff",
    duration: "3 months",
    role: "Site Reliability Engineer",
    mustHaveSkills: "CI/CD, Infrastructure as Code, Observability",
    goodToHaveSkills: "Security Best Practices, Python Scripting",
  },
];

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [requirements, setRequirements] = useState(defaultRequirements);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch requirements
  useEffect(() => {
    async function fetchRequirements() {
      if (!isSignedIn || !user) {
        setIsLoading(false);
        return;
      }
      try {
        console.log("Fetching requirements for user:", user.id);
        const response = await fetch(`/api/requirements?userId=${user.id}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("HTTP Error Response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data && result.data.length > 0) {
          console.log("Found requirements:", result.data);
          setRequirements(result.data);
        } else {
          console.log("No requirements found, using defaults");
          setRequirements(defaultRequirements);
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
        console.error("Full error details:", {
          message: error.message,
          stack: error.stack,
        });
        setRequirements(defaultRequirements);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequirements();
  }, [isSignedIn, user]);

  useEffect(() => {
    const linkExistingToken = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Check for temporary token
        const temporary_token = localStorage.getItem("recruitment_flow_token");
        if (!temporary_token) return;

        // Check if user exists in ra_users_duplicate
        const checkUserResponse = await fetch(
          `/api/users/duplicate?userid=${user.id}`
        );
        const checkUserData = await checkUserResponse.json();

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
        }

        // Get numeric ID and ensure it's a number
        let numericId = parseInt(checkUserData.numericId);
        if (!numericId || isNaN(numericId)) {
          throw new Error("Failed to get numeric ID from ra_users_duplicate");
        }

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
          throw new Error("Failed to link record to user");
        }

        const responseData = await linkResponse.json();
        console.log("Link response:", responseData);

        // Clear token after successful linking
        localStorage.removeItem("recruitment_flow_token");
      } catch (error) {
        console.error("Error linking record:", error);
      }
    };

    linkExistingToken();
  }, [isSignedIn, user]);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
                  // Get the current URL with origin
                  const baseUrl = window.location.origin;
                  // Open /select in new tab with session token
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

            {/* Requirements Grid */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
