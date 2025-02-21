'use client'

import React from 'react';
import PageLayout from '@/components/PageLayout';
import TechnologySection from '@/components/TechnologySection';
import SelectedTechnologies from '@/components/SelectedTechnologies';

const TechnologyPage = () => {
    const pageContent = {
        title: "Select the Technology",
        description: "Select the technology or expertise you're looking for to get started.",
        sections: [
            {
                title: "Software Development",
                items: [
                    { label: 'Frontend', imageSrc: '/frontend.png', href: '/tech/frontend', category: 'Development', isMainSelection: true },
                    { label: 'Backend', imageSrc: '/backend (2).png', href: '/tech/backend', category: 'Development', isMainSelection: true },
                    { label: 'Full Stack', imageSrc: '/server.png', href: '/tech/fullstack', category: 'Development', isMainSelection: true },
                ]
            },
            {
                title: "Mobile App Development",
                items: [
                    { label: 'Android', imageSrc: '/android.png', href: '/create-jd', category: 'Mobile', isMainSelection: true },
                    { label: 'iOS', imageSrc: '/apple.png', href: '/create-jd', category: 'Mobile', isMainSelection: true },
                    { label: 'Flutter', imageSrc: '/Flutter.png', href: '/create-jd', category: 'Mobile', isMainSelection: true },
                    { label: 'React Native', imageSrc: '/React.png', href: '/create-jd', category: 'Mobile', isMainSelection: true },
                ]
            },
            {
                title: "Data Science & Engineering",
                items: [
                    { label: 'Data Science', imageSrc: '/data science.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'Data Engineering', imageSrc: '/data engineering.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'Microsoft Apps', imageSrc: '/Microsoft Windows.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'ML/AI', imageSrc: '/ML-AI.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'Data Analyst', imageSrc: '/data analyst.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'Business Intelligence', imageSrc: '/business.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                    { label: 'ML Ops', imageSrc: '/ml ops.png', href: '/create-jd', category: 'Data', isMainSelection: true },
                ]
            },
            {
                title: "Cloud & DevOps",
                items: [
                    { label: 'DevOps', imageSrc: '/cloud.png', href: '/create-jd', category: 'Cloud', isMainSelection: true },
                    { label: 'Site Reliability', imageSrc: '/programmer.png', href: '/create-jd', category: 'Cloud', isMainSelection: true },
                ]
            },
            {
                title: "Design",
                items: [
                    { label: 'UI/UX Design', imageSrc: '/ui-ux.png', href: '/create-jd', category: 'Design', isMainSelection: true },
                    { label: 'Graphic Design', imageSrc: '/graphic designer.png', href: '/create-jd', category: 'Design', isMainSelection: true },
                ]
            },
            {
                title: "Quality Assurance",
                items: [
                    { label: 'Manual QA', imageSrc: '/service.png', href: '/create-jd', category: 'QA', isMainSelection: true },
                    { label: 'Automation QA', imageSrc: '/robo arm.png', href: '/create-jd', category: 'QA', isMainSelection: true },
                ]
            }
        ]
    };

    const RightPanel = <SelectedTechnologies isMainPage={true} />;

    return (
        <PageLayout rightPanel={RightPanel}>
            <TechnologySection {...pageContent} />
        </PageLayout>
    );
};

export default TechnologyPage;
