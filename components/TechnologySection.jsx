'use client'

import React from 'react';
import TechnologyCard from './TechnologyCard';

const TechnologySection = ({ title, description, sections, showHeader = true }) => {
    return (
        <>
            {showHeader && (
                <>
                    <h1 className="text-[40px] font-bold text-white">
                        {title}
                    </h1>
                    <p className="text-gray-400 mb-10 text-[15px] italic">
                        {description}
                    </p>
                </>
            )}

            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                    <h2 className="text-[18px] font-semibold text-white mb-2">
                        {section.title}
                    </h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 100px)', gap: 50 }}>
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
