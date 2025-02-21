'use client'

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SelectedTechnologies from './SelectedTechnologies';

const PageLayout = ({ children, rightPanel }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    return (
        <div className="flex h-screen bg-black overflow-hidden font-sora relative">
            {/* Background Orb */}
            <div
                className="fixed right-0 top-0 h-full w-[40%]"
                style={{
                    backgroundImage: "url('/background.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right',
                    backgroundSize: 'cover',
                    opacity: 0.2,
                    zIndex: 0
                }}
            />

            <div className="fixed left-0 top-0 h-full">
                <Sidebar onExpandChange={setIsSidebarExpanded} />
            </div>

            <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-[380px]' : 'ml-16'}`}>
                <div className="h-screen flex px-6 py-6 gap-6 w-full">
                    {/* Main Content */}
                    <div className="w-[60%] bg-[#0B0B0BBF] rounded-lg overflow-hidden min-h-0 flex flex-col mt-[-5]">
                        <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
                            {children}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="w-[40%] bg-[#0B0B0BBF] rounded-lg overflow-hidden min-h-0 flex flex-col mt-[-5]">
                        <div className="flex-1 overflow-y-auto hide-scrollbar">
                            {rightPanel || <SelectedTechnologies />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLayout;
