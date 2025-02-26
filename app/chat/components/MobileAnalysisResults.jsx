import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    removeMustHaveSkill,
    removeGoodToHaveSkill,
    addMustHaveSkill,
    addGoodToHaveSkill,
    selectMustHaveSkills,
    selectGoodToHaveSkills,
} from "@/app/store/techSlice";
import SkillDropdown from "./SkillDropdown";

export default function MobileAnalysisResults({ results }) {
    const router = useRouter();
    const [showMustHaveDropdown, setShowMustHaveDropdown] = useState(false);
    const [showGoodToHaveDropdown, setShowGoodToHaveDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState(null);
    const dispatch = useDispatch();
    const mustHaveSkills = useSelector(selectMustHaveSkills);
    const goodToHaveSkills = useSelector(selectGoodToHaveSkills);

    // Use only Redux state for skills
    const displayResults = {
        mustHave: mustHaveSkills,
        goodToHave: goodToHaveSkills,
        explanation: results?.explanation || "",
    };

    // Function to sync skills with database
    const syncSkillsWithDatabase = async (updatedMustHave, updatedGoodToHave) => {
        try {
            const token = localStorage.getItem("recruitment_flow_token");
            if (!token) return;
            await fetch("/api/lead-line-item", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    temporary_token: token,
                    must_have: updatedMustHave,
                    good_to_have: updatedGoodToHave,
                }),
            });
        } catch (error) {
            console.error("Error syncing skills:", error);
        }
    };

    return (
        <div className="space-y-4 bg-[#0B0B0BBF] rounded-lg p-4 mb-4">

            <div>
                <div className="bg-[#3C3C3C] bg-opacity-90 backdrop-blur-sm rounded-lg p-3 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-[16px] font-semibold text-white">
                            Must Have Skills
                        </h2>
                        <span
                            className={`text-sm ${mustHaveSkills.length >= 7 ? "text-amber-400" : "text-gray-400"
                                }`}
                        >
                            {mustHaveSkills.length}/8
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {mustHaveSkills.map((skill, index) => (
                            <div
                                key={index}
                                className="group relative inline-flex items-center px-3 py-2 bg-[#A0A0A066] text-white rounded-lg text-[12px] font-medium hover:transition-colors max-w-full"
                            >
                                <span className="truncate mr-2">{skill}</span>
                                <button
                                    onClick={async () => {
                                        dispatch(removeMustHaveSkill(skill));
                                        const updatedSkills = mustHaveSkills.filter(
                                            (s) => s !== skill
                                        );
                                        await syncSkillsWithDatabase(updatedSkills, goodToHaveSkills);
                                    }}
                                    className="ml-2 transition-all"
                                >
                                    <Image
                                        src="/E remove.png"
                                        alt="Remove"
                                        width={16}
                                        height={16}
                                        className="opacity-60 hover:opacity-100 transition-opacity"
                                    />
                                </button>
                            </div>
                        ))}
                        {mustHaveSkills.length < 8 && (
                            <button
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const containerRect = e.currentTarget
                                        .closest(".bg-\\[\\#3C3C3C\\]")
                                        .getBoundingClientRect();
                                    setDropdownPosition({
                                        x: containerRect.right - 256, // Position at right edge, accounting for dropdown width
                                        y: rect.bottom + 8,
                                    });
                                    setShowMustHaveDropdown(true);
                                }}
                                className="inline-flex items-center px-3 py-2 bg-[#A0A0A0] text-[#313131] rounded-lg text-[12px] font-inter font-medium hover:bg-[#A0A0A099] transition-colors gap-2"
                            >
                                <Image src="/plus.png" alt="add" width={16} height={16} />
                                <span>Add new skill</span>
                            </button>
                        )}
                        {showMustHaveDropdown && (
                            <SkillDropdown
                                position={dropdownPosition}
                                usePortal={true}
                                onSelect={async (skill) => {
                                    // Remove from good-to-have if being added to must-have
                                    if (goodToHaveSkills.includes(skill)) {
                                        dispatch(removeGoodToHaveSkill(skill));
                                    }
                                    dispatch(addMustHaveSkill(skill));
                                    // Update both lists
                                    const updatedMustHave = [
                                        ...mustHaveSkills.filter((s) => s !== skill),
                                        skill,
                                    ];
                                    const updatedGoodToHave = goodToHaveSkills.filter(
                                        (s) => s !== skill
                                    );
                                    await syncSkillsWithDatabase(
                                        updatedMustHave,
                                        updatedGoodToHave
                                    );
                                    setShowMustHaveDropdown(false);
                                }}
                                onClose={() => setShowMustHaveDropdown(false)}
                                type="must-have"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="bg-[#3C3C3C] bg-opacity-90 backdrop-blur-sm rounded-lg p-3 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-[16px] font-semibold text-white">
                            Good to Have Skills
                        </h2>
                        <span
                            className={`text-sm ${goodToHaveSkills.length >= 7 ? "text-amber-400" : "text-gray-400"
                                }`}
                        >
                            {goodToHaveSkills.length}/8
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {goodToHaveSkills.map((skill, index) => (
                            <div
                                key={index}
                                className="group relative inline-flex items-center px-3 py-2 bg-[#A0A0A066] text-white rounded-lg text-[12px] font-medium hover:transition-colors max-w-full"
                            >
                                <span className="truncate mr-2">{skill}</span>
                                <button
                                    onClick={async () => {
                                        dispatch(removeGoodToHaveSkill(skill));
                                        const updatedSkills = goodToHaveSkills.filter(
                                            (s) => s !== skill
                                        );
                                        await syncSkillsWithDatabase(mustHaveSkills, updatedSkills);
                                    }}
                                    className="ml-2"
                                >
                                    <Image
                                        src="/E remove.png"
                                        alt="Remove"
                                        width={16}
                                        height={16}
                                        className="opacity-60 hover:opacity-100"
                                    />
                                </button>
                            </div>
                        ))}
                        {goodToHaveSkills.length < 8 && (
                            <button
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const containerRect = e.currentTarget
                                        .closest(".bg-\\[\\#3C3C3C\\]")
                                        .getBoundingClientRect();
                                    setDropdownPosition({
                                        x: containerRect.right - 256, // Position at right edge, accounting for dropdown width
                                        y: rect.bottom + 8,
                                    });
                                    setShowGoodToHaveDropdown(true);
                                }}
                                className="inline-flex items-center px-3 py-2 bg-[#A0A0A0] text-[#313131] rounded-lg text-[12px] font-inter font-medium hover:bg-[#A0A0A099] transition-colors gap-2"
                            >
                                <Image src="/plus.png" alt="add" width={16} height={16} />
                                <span>Add new skill</span>
                            </button>
                        )}
                        {showGoodToHaveDropdown && (
                            <SkillDropdown
                                position={dropdownPosition}
                                usePortal={true}
                                onSelect={async (skill) => {
                                    // Only add to good-to-have if not in must-have
                                    if (mustHaveSkills.includes(skill)) {
                                        // Notify user that skill is already in must-have
                                        alert(`"${skill}" is already in Must Have Skills`);
                                        setShowGoodToHaveDropdown(false);
                                        return;
                                    }
                                    dispatch(addGoodToHaveSkill(skill));
                                    const updatedSkills = [
                                        ...goodToHaveSkills.filter((s) => s !== skill),
                                        skill,
                                    ];
                                    await syncSkillsWithDatabase(mustHaveSkills, updatedSkills);
                                    setShowGoodToHaveDropdown(false);
                                }}
                                onClose={() => setShowGoodToHaveDropdown(false)}
                                type="good-to-have"
                            />
                        )}
                    </div>
                </div>
            </div>

            {(mustHaveSkills.length > 0 || goodToHaveSkills.length > 0) && (
                <button
                    onClick={() => router.push("/experience")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition-colors relative z-10 cursor-pointer text-sm mt-2"
                >
                    Submit
                </button>
            )}
        </div>
    );
}
