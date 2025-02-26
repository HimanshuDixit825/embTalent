"use client";

import React from "react";
import PageLayout from "@/components/PageLayout";
import TechnologySection from "@/components/TechnologySection";
import SelectedTechnologies from "@/components/SelectedTechnologies";
import { techStacks } from "@/app/data/techStacks";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMainSelection } from "@/app/store/techSlice";
import { ArrowLeft } from "lucide-react";

const TechStackPage = () => {
  const params = useParams();
  const type = params.type;
  const dispatch = useDispatch();

  // Get the appropriate content based on the route
  const pageContent = techStacks[type];

  // Set main selection on page load
  React.useEffect(() => {
    dispatch(
      setMainSelection({ label: type.charAt(0).toUpperCase() + type.slice(1) })
    );
  }, [dispatch, type]);

  // If invalid type, show error or redirect
  if (!pageContent) {
    return (
      <PageLayout>
        <div className="text-white">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold mb-2 md:mb-4">
            Invalid Technology Stack
          </h1>
          <p className="text-[13px] md:text-[16px]">
            The requested technology stack type does not exist.
          </p>
        </div>
      </PageLayout>
    );
  }

  const RightPanel = <SelectedTechnologies isMainPage={false} />;

  const router = useRouter();
  return (
    <PageLayout rightPanel={RightPanel}>
      <div className="space-y-6 md:space-y-8">
        <div className="mb-6 md:mb-12">
          <div className="flex items-start gap-2 md:gap-3">
            <button
              onClick={() => router.push("/select")}
              className="text-white hover:text-gray-300 transition-colors mt-1 md:mt-2"
            >
              <ArrowLeft size={24} className="md:w-9 md:h-9 w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold text-white mb-1 md:mb-2">
                {pageContent.title}
              </h1>
              <p className="text-gray-400 text-[10px] md:text-[12px] italic">
                {pageContent.description}
              </p>
            </div>
          </div>
        </div>
        <TechnologySection {...pageContent} showHeader={false} />
      </div>
    </PageLayout>
  );
};

export default TechStackPage;
