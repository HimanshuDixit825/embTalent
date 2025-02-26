"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
const { isSignedIn } = useUser;

const MobileNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      id: "talent",
      icon: "/talentai1.png",
      label: "Talent.ai",
      route: "/select",
    },
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
      id: "meeting",
      icon: "/calender 3.png",
      label: "Meeting",
      onClick: () => {
        window.open("https://calendly.com/harsh-shukla-emb/30min", "_blank");
      },
    },
    {
      id: "profile",
      icon: "/Avatar 37.png",
      label: "Profile",
      route: "/auth/sign-in",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex justify-around items-center px-2 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            } else if (item.route) {
              router.push(item.route);
            }
          }}
          className="flex flex-col items-center justify-center w-1/4"
        >
          <div
            className={`relative w-8 h-8 flex items-center justify-center ${
              pathname === item.route ? "bg-[#00A36C] rounded-full p-1" : ""
            }`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className="object-contain"
              style={{
                filter:
                  pathname === item.route
                    ? "brightness(0) saturate(100%) invert(56%) sepia(96%) saturate(447%) hue-rotate(116deg) brightness(95%) contrast(106%)"
                    : "none",
              }}
            />
          </div>
          <span className="text-white text-[10px] mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileNavBar;
