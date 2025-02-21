"use client";
import React from "react";
import Image from "next/image";

export default function CompleteVerification() {
    return (
        <div className="min-h-screen bg-[#030D06] relative overflow-hidden">
            {/* Background Decorations */}
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2B7344] rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2B7344] rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

            {/* Logo in top left */}
            <div className="absolute top-8 left-8 z-20">
                <Image
                    src="/NewLogo.png"
                    alt="EMB Global"
                    width={150}
                    height={60}
                    priority
                />
            </div>

            {/* Content Container */}
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                {/* Verification Form */}
                <div className="w-full max-w-md bg-[#051B0D] p-8 rounded-2xl shadow-xl relative z-10">
                    <h1 className="text-3xl font-bold text-white text-center mb-8">
                        Complete Verification
                        <div className="h-px bg-[#2C7846] flex-1 mt-4" />
                    </h1>

                    <div className="space-y-6">
                        {/* Email OTP */}
                        <div>
                            <label className="block text-white text-[16px] font-medium mb-2">
                                E-Mail OTP*
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full h-12 px-4 text-black text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter OTP"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Image src="/check.png" alt="Check" width={24} height={24} />
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button className="text-white text-sm underline">
                                    Resend OTP
                                </button>
                            </div>
                        </div>

                        {/* Phone OTP */}
                        <div>
                            <label className="block text-white text-[16px] font-medium mb-2">
                                Phone OTP
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full h-12 px-4 text-black text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter OTP"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Image src="/check.png" alt="Check" width={24} height={24} />
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button className="text-white text-sm underline">
                                    Resend OTP
                                </button>
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button className="w-full py-3 bg-[#2B7344] hover:bg-[#2B7344]/90 text-white font-medium rounded-lg transition-colors">
                            Verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
