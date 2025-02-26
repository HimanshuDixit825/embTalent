"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
const Sidebar = ({ onExpandChange }) => {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUserName = async () => {
      if (!isSignedIn || !user) return;
      try {
        const response = await fetch(`/api/users/duplicate?userid=${user.id}`);
        const data = await response.json();
        // If user exists in database, use their email (since name might be null)
        if (data.exists) {
          const response = await fetch(
            `/api/users/duplicate/email?userid=${user.id}`
          );
          const emailData = await response.json();
          if (emailData.email) {
            const nameFromEmail = emailData.email.split("@")[0];
            const capitalizedName =
              nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
            setUserName(capitalizedName);
          }
        } else {
          // Fallback to Clerk email if available
          if (user.emailAddresses?.length > 0) {
            const email = user.emailAddresses[0].emailAddress;
            const nameFromEmail = email.split("@")[0];
            const capitalizedName =
              nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
            setUserName(capitalizedName);
          } else {
            // Last resort: Clerk name
            setUserName(
              `${user.firstName || ""} ${user.lastName || ""}`.trim()
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        // Fallback to Clerk name if available
        setUserName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      }
    };
    fetchUserName();
  }, [isSignedIn, user]);
  const expandTimeoutRef = useRef(null);
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);
  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!isExpanded) {
      setShowProfileMenu(false);
    }
  }, [isExpanded]);
  const handleMouseEnter = () => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    setIsExpanded(true);
  };
  const handleMouseLeave = () => {
    expandTimeoutRef.current = setTimeout(() => {
      if (!showProfileMenu) {
        setIsExpanded(false);
      }
    }, 300);
  };
  const sidebarItems = [
    {
      id: "talent",
      icon: "/talentai1.png",
      label: "Talent.ai",
      route: "/select",
    },
    // {
    //   id: "requirements",
    //   icon: "/requirement.png",
    //   label: "Requirements",
    //   route: "/dashboard",
    //   onClick: () => {
    //     if (isSignedIn) {
    //       router.push("/dashboard");
    //     } else {
    //       router.push("/auth/sign-in");
    //     }
    //   },
    // },
    {
      id: "requirements",
      icon: "/requirement.png",
      label: "Requirements",
      route: "/dashboard",
      onClick: () => {
        if (isSignedIn) {
          router.push("/dashboard");
        } else {
          router.push("/auth/sign-in");
        }
      },
    },
    {
      id: "calendar",
      icon: "/calender 3.png",
      label: "Book a Calender",
      onClick: () => {
        window.open("https://calendly.com/harsh-shukla-emb/30min", "_blank");
      },
    },
  ];
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
      setShowProfileMenu(false);
    }
  };
  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed h-[calc(100vh-2.5rem)] bg-[#131313CC] flex flex-col py-4 font-inter my-5 rounded-xl transition-all duration-300 hover:bg-[#131313] ${
        isExpanded ? "w-[380px]" : "w-16"
      }`}
    >
      <div className="flex flex-col space-y-6">
        {/* Logo */}
        <div
          className="w-full cursor-pointer transition-all duration-300 group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="px-2 flex items-center h-[45px]">
            <div className="flex-shrink-0 w-[45px] h-[45px] relative">
              <img
                src="/Orb.png"
                alt="Orb"
                className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isExpanded ? "w-auto opacity-100 ml-3" : "w-0 opacity-0"
              }`}
            >
              <Image
                src="/sidebarTitle.png"
                alt="EMB Talent"
                width={297}
                height={47}
                priority
              />
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="w-full px-4">
          <div className="h-[1px] bg-gray-700 w-full" />
        </div>
        {/* Navigation Items */}
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else if (item.route) {
                router.push(item.route);
              }
            }}
            className={`flex items-center transition-all duration-300 group relative w-full ${
              isExpanded ? "px-4" : "justify-center"
            } hover:bg-white/5`}
          >
            <div
              className={`
              flex-shrink-0 w-[45px] h-[45px] relative flex items-center justify-center
              ${pathname === item.route ? "bg-[#00A36C] rounded-xl" : ""}
            `}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={45}
                height={45}
                className={`
                  transition-all duration-300 object-contain
                  ${
                    pathname === item.route
                      ? "opacity-100"
                      : "opacity-60 group-hover:opacity-100"
                  }
                `}
                style={{ backgroundColor: "transparent" }}
              />
            </div>
            {isExpanded && (
              <span className="ml-3 text-white text-lg font-inter">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-auto">
        {/* Logout Button - Only shown when signed in */}
        {isSignedIn && (
          <button
            className={`flex items-center transition-all duration-300 group relative w-full ${
              isExpanded ? "px-4" : "justify-center"
            } hover:bg-white/5 text-red-500 mb-2`}
            onClick={handleLogout}
            disabled={isLoading}
          >
            <div className="flex-shrink-0 w-[45px] h-[45px] relative flex items-center justify-center">
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
              ) : (
                <svg
                  className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H3z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M13.293 7.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L15.586 11H7a1 1 0 1 1 0-2h8.586l-2.293-2.293a1 1 0 0 1 0-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {isExpanded && (
              <span className="ml-3 text-red-500 text-lg font-inter">
                Logout
              </span>
            )}
          </button>
        )}
        {/* Profile Menu */}
        <div className="relative">
          <div className={`${isExpanded ? "px-4" : "flex justify-center"}`}>
            <button
              className={`flex items-center p-2 w-full ${
                isExpanded ? "bg-[#00A36C] rounded-3xl" : ""
              } transition-all duration-300`}
              onClick={() => {
                if (isSignedIn) {
                  setShowProfileMenu(!showProfileMenu);
                } else {
                  router.push("/auth/sign-in");
                }
              }}
            >
              <Image
                src={
                  isSignedIn
                    ? user?.imageUrl || "/Avatar 37.png"
                    : "/Avatar 37.png"
                }
                alt="Avatar"
                width={45}
                height={45}
                className="rounded-full"
              />
              {isExpanded && (
                <span className="ml-3 text-white text-lg font-inter">
                  {isSignedIn ? userName || "User" : "Sign In"}
                </span>
              )}
            </button>
          </div>
          {/* Profile Menu Popout - Only shown when signed in */}
          {isSignedIn && showProfileMenu && (
            <div
              className={`absolute ${
                isExpanded
                  ? "right-4 left-4 bottom-16"
                  : "left-16 bottom-0 w-48"
              } bg-white rounded-lg shadow-xl overflow-hidden z-50`}
            >
              <button
                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 text-left transition-colors duration-300 font-inter flex items-center justify-between"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <span>Log Out</span>
                {isLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;