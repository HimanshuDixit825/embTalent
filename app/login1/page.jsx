"use client";
import React from "react";
import Form from "./_components/Form";
import Image from "next/image";

function Login1() {
  return (
    <div className="min-h-screen bg-[#030D06] relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Image
          src="/NewLogo.png"
          alt="EMB Global Logo"
          width={191}
          height={84}
          priority
        />
      </div>

      {/* Decorative Leaves */}
      <div className="absolute right-0 top-0 h-screen">
        <Image
          src="/leaf.png"
          alt="Decorative Leaf"
          width={800}
          height={1024}
          className="h-full w-auto object-contain opacity-80"
          priority
        />
      </div>

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center mt-28 mb-28">
        <div className="w-full max-w-md z-10 backdrop-blur-md bg-[#0F2A1A26] p-4 rounded-2xl">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default Login1;
