"use client";

import React from "react";
import TechnologyCard from "./TechnologyCard";

const TechnologySection = ({
  title,
  description,
  sections,
  showHeader = true,
}) => {
  return (
    <>
      {showHeader && (
        <>
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-bold text-white">
            {title}
          </h1>
          <p className="text-gray-400 mb-6 md:mb-10 text-[13px] sm:text-[14px] md:text-[15px] italic">
            {description}
          </p>
        </>
      )}

      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6 md:mb-8">
          <h2 className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-white mb-2">
            {section.title}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {section.items.map((item, index) => (
              <TechnologyCard
                key={index}
                imageSrc={item.imageSrc}
                label={item.label}
                href={item.href}
                category={item.category}
                isMainSelection={item.isMainSelection || false}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default TechnologySection;
