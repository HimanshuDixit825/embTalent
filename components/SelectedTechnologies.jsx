'use client'

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMainTechnology, selectTechnologies, clearSelections, selectFullstackValidation } from '@/app/store/techSlice';
import { useRouter } from 'next/navigation';

const SelectedTechnologies = ({ isMainPage = false }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const mainSelection = useSelector(selectMainTechnology);
    const selectedTechs = useSelector(selectTechnologies);
    const isFullstackValid = useSelector(selectFullstackValidation);

    if (isMainPage) {
        return (
            <div className="text-white space-y-6">
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Selected Technology</h3>
                    {mainSelection ? (
                        <div className="space-y-4">
                            <div className="bg-gray-700 bg-opacity-50 p-3 rounded">
                                <span className="text-sm">{mainSelection.label}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Select a technology to get started</p>
                    )}
                </div>
            </div>
        );
    }

    // For technology-specific pages
    return (
        <div className="text-white space-y-6">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Selected Technologies</h3>
                    <button
                        onClick={() => dispatch(clearSelections())}
                        className="text-xs text-red-400 hover:text-red-300"
                    >
                        Clear All
                    </button>
                </div>
                {selectedTechs.length > 0 ? (
                    <div className="space-y-3">
                        {selectedTechs.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 bg-opacity-50 p-3 rounded flex items-center justify-between"
                            >
                                <span className="text-sm">{tech.label}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">Select the technologies you want to learn</p>
                )}
            </div>
        </div>
    );
};

export default SelectedTechnologies;
