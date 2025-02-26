"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  selectMustHaveSkills,
  selectGoodToHaveSkills,
  selectAnalyzing,
  removeMustHaveSkill,
  removeGoodToHaveSkill,
  addMustHaveSkill,
  addGoodToHaveSkill,
} from "@/app/store/techSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkillDropdown from "@/app/chat/components/SkillDropdown";

export default function RightPanel() {
  const mustHaveSkills = useSelector(selectMustHaveSkills);
  const goodToHaveSkills = useSelector(selectGoodToHaveSkills);
  const analyzing = useSelector(selectAnalyzing);

  const SkillList = ({ title, skills, type, isLoading }) => {
    const dispatch = useDispatch();
    const [showDropdown, setShowDropdown] = useState(false);
    return (
      <div>
        <h2 className="text-[20px] font-semibold text-white mb-4">{title}</h2>
        <div className="bg-[#3C3C3C80] rounded-lg p-4 flex flex-wrap gap-3 relative">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <LoadingSpinner className="h-4 w-4" />
              <p className="text-[12px]">Analyzing skills...</p>
            </div>
          ) : (
            <>
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group relative inline-flex items-center px-3 py-2 bg-[#A0A0A066] text-white rounded-lg text-[12px] font-medium hover:transition-colors"
                >
                  <span>{skill}</span>
                  <button
                    onClick={async () => {
                      // Update Redux state
                      dispatch(
                        type === "must"
                          ? removeMustHaveSkill(skill)
                          : removeGoodToHaveSkill(skill)
                      );

                      // Sync with database
                      try {
                        const token = localStorage.getItem("recruitment_flow_token");
                        if (token) {
                          const updatedMustHave = type === "must"
                            ? mustHaveSkills.filter(s => s !== skill)
                            : mustHaveSkills;
                          const updatedGoodToHave = type === "good"
                            ? goodToHaveSkills.filter(s => s !== skill)
                            : goodToHaveSkills;

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
                        }
                      } catch (error) {
                        console.error("Error syncing skills:", error);
                      }
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
              {skills.length === 0 ? (
                <p className="text-gray-400 text-[12px]">
                  {type === "must"
                    ? "Upload a PDF to analyze required skills"
                    : "No optional skills found"}
                </p>
              ) : (
                skills.length < 8 && (
                  <button
                    onClick={() => setShowDropdown(true)}
                    className="inline-flex items-center px-3 py-2 bg-[#A0A0A0] text-[#313131] rounded-lg text-[12px] font-inter font-medium hover:bg-[#A0A0A099] transition-colors gap-2"
                  >
                    <Image src="/plus.png" alt="add" width={16} height={16} />
                    <span>Add new skill</span>
                  </button>
                )
              )}
              {showDropdown && (
                <SkillDropdown
                  onSelect={async (skill) => {
                    // Update Redux state
                    dispatch(
                      type === "must"
                        ? addMustHaveSkill(skill)
                        : addGoodToHaveSkill(skill)
                    );

                    // Sync with database
                    try {
                      const token = localStorage.getItem("recruitment_flow_token");
                      if (token) {
                        const updatedMustHave = type === "must" 
                          ? [...mustHaveSkills, skill]
                          : mustHaveSkills;
                        const updatedGoodToHave = type === "good"
                          ? [...goodToHaveSkills, skill]
                          : goodToHaveSkills;

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
                      }
                    } catch (error) {
                      console.error("Error syncing skills:", error);
                    }
                    
                    setShowDropdown(false);
                  }}
                  onClose={() => setShowDropdown(false)}
                  type={type}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const router = useRouter();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6 relative">
        <div>
          <h2 className="text-[32px] font-bold text-white mb-2">
            Your Ideal Skill Set
          </h2>
          <p className="text-gray-400 text-[12px]">
            Upload a job description to analyze required skills
          </p>
        </div>

        <SkillList
          title="Must Have Skills"
          skills={mustHaveSkills}
          type="must"
          isLoading={analyzing}
        />

        <SkillList
          title="Good to Have Skills"
          skills={goodToHaveSkills}
          type="good"
          isLoading={analyzing}
        />

        {(mustHaveSkills.length > 0 || goodToHaveSkills.length > 0) && (
          <div className="absolute bottom-20 right-6">
            {" "}
            {/* New container for positioning */}
            <button
              onClick={() => router.push("/experience")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors relative z-10 cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
