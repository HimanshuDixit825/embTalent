"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "./Sidebar";
import SelectedTechnologies from "./SelectedTechnologies";
import MobileNavBar from "./MobileNavBar";

const PageLayout = ({ children, rightPanel }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-black font-sora relative overflow-x-hidden">
      {/* Background Orb - only show on desktop */}
      {!isMobile && (
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
      )}

      {/* Desktop Sidebar - hide on mobile */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-full hidden md:block">
          <Sidebar onExpandChange={setIsSidebarExpanded} />
        </div>
      )}

      {/* Main Content Area - full width on mobile, adjusted on desktop */}
      <div
        className={`flex-1 transition-all duration-300 ${isMobile
          ? "w-full px-4"
          : `${isSidebarExpanded ? "ml-[380px]" : "ml-16"}`
          }`}
      >
        {isMobile ? (
          // Mobile Layout - Single column
          <div className="min-h-screen bg-black pt-6 pb-20 w-full">
            {/* Add logo at the top for mobile */}
            <div className="flex mb-4">
              <Image
                src="/Orb.png"
                alt="EMB Global Logo"
                width={40}
                height={40}
                priority
              />
            </div>
            <div className="w-full bg-transparent flex flex-col">
              <div className="overflow-y-auto">{children}</div>
            </div>
          </div>
        ) : (
          // Desktop Layout - Two columns
          <div className="h-screen flex py-6 gap-6 w-full">
            <div className="w-[60%] bg-[#0B0B0BBF] rounded-lg overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
                {children}
              </div>
            </div>
            <div className="w-[40%] bg-[#0B0B0BBF] rounded-lg overflow-hidden min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {rightPanel || <SelectedTechnologies />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Bar - only show on mobile */}
      {isMobile && <MobileNavBar />}
    </div>
  );
};

export default PageLayout;
