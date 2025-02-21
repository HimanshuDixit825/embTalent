"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Sidebar = ({ onExpandChange }) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      icon: "/talentai.png",
      label: "Talent.ai",
      route: "/select",
    },
    {
      id: "requirements",
      icon: "/requirement 3.png",
      label: "Requirements",
      route: "/dashboard",
    },
    { id: "calendar", icon: "/calender2.png", label: "Book a Calender" },
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
              if (item.route) {
                router.push(item.route);
              }
            }}
            className={`flex items-center transition-all duration-300 group relative w-full ${
              isExpanded ? "px-4" : "justify-center"
            } hover:bg-white/5`}
          >
            <div className="flex-shrink-0 w-[45px] h-[45px] relative flex items-center justify-center">
              <Image
                src={item.icon}
                alt={item.label}
                width={45}
                height={45}
                className="transition-all duration-300 object-contain opacity-60 group-hover:opacity-100"
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

      {/* Profile Menu */}
      <div className="mt-auto relative">
        <div className={`${isExpanded ? "px-4" : "flex justify-center"}`}>
          <button
            className={`flex items-center p-2 w-full ${
              isExpanded ? "bg-[#00A36C] rounded-3xl" : ""
            } transition-all duration-300`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <Image
              src={user?.imageUrl || "/Avatar 37.png"}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full"
            />
            {isExpanded && (
              <span className="ml-3 text-white text-lg font-inter">
                {user?.firstName} {user?.lastName}
              </span>
            )}
          </button>
        </div>

        {/* Profile Menu Popout */}
        {showProfileMenu && (
          <div
            className={`absolute ${
              isExpanded ? "right-4 left-4 bottom-16" : "left-16 bottom-0 w-48"
            } bg-white rounded-lg shadow-xl overflow-hidden z-50`}
          >
            <button
              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors duration-300 font-inter border-b border-gray-100"
              onClick={() => {
                setShowProfileMenu(false);
              }}
            >
              View Profile
            </button>
            <button
              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors duration-300 font-inter border-b border-gray-100"
              onClick={() => {
                setShowProfileMenu(false);
              }}
            >
              Edit Profile
            </button>
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
  );
};

export default Sidebar;
