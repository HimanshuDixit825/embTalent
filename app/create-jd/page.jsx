"use client";

import PageLayout from "@/components/PageLayout";
import Header from "./_components/Header";
import UploadSection from "./_components/UploadSection";
import RightPanel from "./_components/RightPanel";

export default function CreateJD() {
  const MainContent = (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Header />
      <UploadSection />
    </div>
  );

  return <PageLayout rightPanel={<RightPanel />}>{MainContent}</PageLayout>;
}
