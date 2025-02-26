"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <div className="mb-6 sm:mb-12">
      <div className="flex items-start gap-2 sm:gap-3">
        <button
          onClick={() => router.back()}
          className="hidden sm:block text-white hover:text-gray-300 transition-colors mt-1 sm:mt-2"
        >
          <ArrowLeft size={24} className="sm:w-9 sm:h-9" />
        </button>
        <div className="sm:ml-0 ml-1">
          <h1 className="text-[18px] sm:text-[40px] font-bold text-white mb-1 sm:mb-2">
            Create or Upload a JD
          </h1>
          <p className="text-gray-400 text-[12px] italic">
            Easily create a new JD or upload an existing one to get started
          </p>
        </div>
      </div>
    </div>
  );
}
