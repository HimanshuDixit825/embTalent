'use client'

import React from 'react';
import PageLayout from '@/components/PageLayout';
import TechnologySection from '@/components/TechnologySection';
import SelectedTechnologies from '@/components/SelectedTechnologies';
import { techStacks } from '@/app/data/techStacks';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setMainSelection } from '@/app/store/techSlice';
import { ArrowLeft } from "lucide-react";

const TechStackPage = () => {
    const params = useParams();
    const type = params.type;
    const dispatch = useDispatch();

    // Get the appropriate content based on the route
    const pageContent = techStacks[type];

    // Set main selection on page load
    React.useEffect(() => {
        dispatch(setMainSelection({ label: type.charAt(0).toUpperCase() + type.slice(1) }));
    }, [dispatch, type]);

    // If invalid type, show error or redirect
    if (!pageContent) {
        return (
            <PageLayout>
                <div className="text-white">
                    <h1 className="text-[40px] font-bold mb-4">Invalid Technology Stack</h1>
                    <p>The requested technology stack type does not exist.</p>
                </div>
            </PageLayout>
        );
    }

    const RightPanel = <SelectedTechnologies isMainPage={false} />;

    const router = useRouter();
    return (
        <PageLayout rightPanel={RightPanel}>
            <div className="space-y-8">
                <div className="mb-12">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => router.push('/select')}
                            className="text-white hover:text-gray-300 transition-colors mt-2"
                        >
                            <ArrowLeft size={36} />
                        </button>
                        <div>
                            <h1 className="text-[40px] font-bold text-white mb-2">
                                {pageContent.title}
                            </h1>
                            <p className="text-gray-400 text-[12px] italic">
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
