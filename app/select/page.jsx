"use client";

import React from "react";
import PageLayout from "@/components/PageLayout";
import TechnologySection from "@/components/TechnologySection";
import SelectedTechnologies from "@/components/SelectedTechnologies";

const TechnologyPage = () => {
  const pageContent = {
    title: "Select the Technology",
    description:
      "Select the technology or expertise you're looking for to get started.",
    sections: [
      {
        title: "Software Development",
        items: [
          {
            label: "Frontend",
            imageSrc: "/frontend1.png",
            href: "/tech/frontend",
            category: "Development",
            isMainSelection: true,
          },
          {
            label: "Backend",
            imageSrc: "/backend1.png",
            href: "/tech/backend",
            category: "Development",
            isMainSelection: true,
          },
          {
            label: "Full Stack",
            imageSrc: "/fullstack.png",
            href: "/tech/fullstack",
            category: "Development",
            isMainSelection: true,
          },
        ],
      },
      {
        title: "Mobile App Development",
        items: [
          {
            label: "Android",
            imageSrc: "/android1.png",
            href: "/create-jd",
            category: "Mobile",
            isMainSelection: true,
          },
          {
            label: "iOS",
            imageSrc: "/apple (1).png",
            href: "/create-jd",
            category: "Mobile",
            isMainSelection: true,
          },
          {
            label: "Flutter",
            imageSrc: "/Flutter (1).png",
            href: "/create-jd",
            category: "Mobile",
            isMainSelection: true,
          },
          {
            label: "React Native",
            imageSrc: "/React (1).png",
            href: "/create-jd",
            category: "Mobile",
            isMainSelection: true,
          },
        ],
      },
      {
        title: "Data Science & Engineering",
        items: [
          {
            label: "Data Science",
            imageSrc: "/data science 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "Data Engineering",
            imageSrc: "/data engineering 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "Microsoft Apps",
            imageSrc: "/Microsoft Windows 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "ML/AI",
            imageSrc: "/MLAI.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "Data Analyst",
            imageSrc: "/data analyst 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "Business Intelligence",
            imageSrc: "/business 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
          {
            label: "ML Ops",
            imageSrc: "/ml ops 1.png",
            href: "/create-jd",
            category: "Data",
            isMainSelection: true,
          },
        ],
      },
      {
        title: "Cloud & DevOps",
        items: [
          {
            label: "DevOps",
            imageSrc: "/dev ops 1.png",
            href: "/create-jd",
            category: "Cloud",
            isMainSelection: true,
          },
          {
            label: "Site Reliability",
            imageSrc: "/site reliability.png",
            href: "/create-jd",
            category: "Cloud",
            isMainSelection: true,
          },
        ],
      },
      {
        title: "Design",
        items: [
          {
            label: "UI/UX Design",
            imageSrc: "/ui-ux 1.png",
            href: "/create-jd",
            category: "Design",
            isMainSelection: true,
          },
          {
            label: "Graphic Design",
            imageSrc: "/graphic designer 1.png",
            href: "/create-jd",
            category: "Design",
            isMainSelection: true,
          },
        ],
      },
      {
        title: "Quality Assurance",
        items: [
          {
            label: "Manual QA",
            imageSrc: "/manual qa.png",
            href: "/create-jd",
            category: "QA",
            isMainSelection: true,
          },
          {
            label: "Automation QA",
            imageSrc: "/automation qa.png",
            href: "/create-jd",
            category: "QA",
            isMainSelection: true,
          },
        ],
      },
    ],
  };

  const RightPanel = <SelectedTechnologies isMainPage={true} />;

  return (
    <PageLayout rightPanel={RightPanel}>
      <TechnologySection {...pageContent} />
    </PageLayout>
  );
};

export default TechnologyPage;
