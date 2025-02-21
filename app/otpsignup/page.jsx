"use client";
import React from "react";
import Form from "./_components/Form";
import Image from "next/image";

function SignIn2() {
  return (
    <div className="min-h-screen bg-[#030D06] relative overflow-hidden">
      {/* Logo */}
      {/* <div className="absolute top-8 left-8 flex gap-4">
        <Image
          src="/logo.png"
          alt="EMB Global Logo"
          width={71.05}
          height={70}
          priority
        />
        <Image
          src="/Asset 18.png"
          alt="EMB GLOBAL"
          width={441.12}
          height={68.96}
          priority
          className="mt-2"
        />
      </div> */}

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
          className="h-full w-auto object-contain"
          priority
        />
      </div>

      {/* Form Container - Centered */}
      <div className="absolute inset-0 flex items-center justify-center ">
        <div className="w-full max-w-md z-10 backdrop-blur-md bg-formbg p-5 rounded-2xl">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default SignIn2;
