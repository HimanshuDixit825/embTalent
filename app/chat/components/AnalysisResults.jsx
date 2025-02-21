import Image from "next/image";
import { useState } from "react";
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

export default function AnalysisResults({ results }) {
  const [showMustHaveDropdown, setShowMustHaveDropdown] = useState(false);
  const [showGoodToHaveDropdown, setShowGoodToHaveDropdown] = useState(false);
  const dispatch = useDispatch();
  const mustHaveSkills = useSelector(selectMustHaveSkills);
  const goodToHaveSkills = useSelector(selectGoodToHaveSkills);

  // Use only Redux state for skills
  const displayResults = {
    mustHave: mustHaveSkills,
    goodToHave: goodToHaveSkills,
    explanation: results?.explanation || "",
  };

  return (
    <div className="space-y-8 h-full overflow-y-auto">
      <div>
        <h2 className="text-[20px] font-semibold text-white mb-4">
          Must Have Skills
        </h2>
        <div className="bg-[#3C3C3C80] rounded-lg p-4 flex flex-wrap gap-3 relative">
          {mustHaveSkills.map((skill, index) => (
            <div
              key={index}
              className="group relative inline-flex items-center px-3 py-2 bg-[#A0A0A066] text-white rounded-lg text-[12px] font-medium hover:transition-colors"
            >
              <span>{skill}</span>
              <button
                onClick={() => dispatch(removeMustHaveSkill(skill))}
                className="ml-2 transition-all"
              >
                <Image
                  src="/E remove.png"
                  alt="Remove"
                  width={16}
                  height={16}
                  className=" opacity-60 hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          ))}
          {mustHaveSkills.length < 8 && (
            <button
              onClick={() => setShowMustHaveDropdown(true)}
              className="inline-flex items-center px-3 py-2 bg-[#A0A0A0] text-[#313131] rounded-lg text-[12px] font-inter font-medium hover:bg-[#A0A0A099] transition-colors gap-2"
            >
              <Image src="/plus.png" alt="add" width={16} height={16} />
              <span>Add new skill</span>
            </button>
          )}
          {showMustHaveDropdown && (
            <SkillDropdown
              onSelect={(skill) => {
                dispatch(addMustHaveSkill(skill));
                setShowMustHaveDropdown(false);
              }}
              onClose={() => setShowMustHaveDropdown(false)}
              type="must-have"
            />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-[20px] font-semibold text-white mb-4">
          Good to Have Skills
        </h2>
        <div className="bg-[#3C3C3C80] rounded-lg p-4 flex flex-wrap gap-3 relative">
          {goodToHaveSkills.map((skill, index) => (
            <div
              key={index}
              className="group relative inline-flex items-center px-3 py-2 bg-[#A0A0A066] text-white rounded-lg text-[12px] font-medium hover:transition-colors"
            >
              <span>{skill}</span>
              <button
                onClick={() => dispatch(removeGoodToHaveSkill(skill))}
                className="ml-2 "
              >
                <Image
                  src="/E remove.png"
                  alt="Remove"
                  width={16}
                  height={16}
                  className=" opacity-60 hover:opacity-100"
                />
              </button>
            </div>
          ))}
          {goodToHaveSkills.length < 8 && (
            <button
              onClick={() => setShowGoodToHaveDropdown(true)}
              className="inline-flex items-center px-3 py-2 bg-[#A0A0A0] text-[#313131] rounded-lg text-[12px] font-medium hover:bg-[#A0A0A099] transition-colors gap-2"
            >
              <Image src="/plus.png" alt="add" width={16} height={16} />
              <span>Add new skill</span>
            </button>
          )}
          {showGoodToHaveDropdown && (
            <SkillDropdown
              onSelect={(skill) => {
                dispatch(addGoodToHaveSkill(skill));
                setShowGoodToHaveDropdown(false);
              }}
              onClose={() => setShowGoodToHaveDropdown(false)}
              type="good-to-have"
            />
          )}
        </div>
      </div>

      {results?.explanation && (
        <div>
          <h2 className="text-[20px] font-semibold text-white mb-4">
            Analysis
          </h2>
          <div className="bg-[#3C3C3C80] rounded-lg p-4 overflow-y-auto">
            <p className="text-gray-300 text-[12px]">{results.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
