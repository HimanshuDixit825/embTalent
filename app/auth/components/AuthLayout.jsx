import Image from "next/image";

export default function AuthLayout({ children }) {
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
          className="h-full w-auto object-contain"
          priority
        />
      </div>

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md z-10 backdrop-blur-md bg-formbg p-5 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
