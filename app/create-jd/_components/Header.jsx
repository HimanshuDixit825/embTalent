"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <div className="mb-12">
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 transition-colors mt-2"
        >
          <ArrowLeft size={36} />
        </button>
        <div>
          <h1 className="text-[40px] font-bold text-white mb-2">
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
