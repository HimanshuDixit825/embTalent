"use client";

import { useRouter } from 'next/navigation';

export default function CreateSection() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/chat');
  };

  return (
    // <div className="space-y-6">
    //   <div className="bg-[#3C3C3C] rounded-lg p-6 space-y-6">
    //     <div className="space-y-4">
    //       <div>
    //         <label className="text-white text-sm mb-2 block">Job Title</label>
    //         <input
    //           type="text"
    //           className="w-full bg-[#3A3A3A] border border-[#515050] rounded-lg py-2.5 px-4 text-gray-300 focus:outline-none focus:border-emerald-500"
    //           placeholder="Enter job title"
    //         />
    //       </div>
    //       <div>
    //         <label className="text-white text-sm mb-2 block">Experience Required</label>
    //         <input
    //           type="text"
    //           className="w-full bg-[#3A3A3A] border border-[#515050] rounded-lg py-2.5 px-4 text-gray-300 focus:outline-none focus:border-emerald-500"
    //           placeholder="Enter required experience"
    //         />
    //       </div>
    //       <div>
    //         <label className="text-white text-sm mb-2 block">Job Description</label>
    //         <textarea
    //           className="w-full bg-[#3A3A3A] border border-[#515050] rounded-lg py-2.5 px-4 text-gray-300 focus:outline-none focus:border-emerald-500 min-h-[200px]"
    //           placeholder="Enter detailed job description"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex justify-end">
    //     <button
    //       onClick={handleNext}
    //       className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors"
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>
    <>
      <button
        onClick={() => router.push('/chat')}
        className="w-full bg-[#3C3C3C] hover:bg-gray-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-[20px] mb-5 cursor-pointer"
      >
        {/* <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-medium">
        R
      </div> */}
        Create from scratch
      </button>
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}
