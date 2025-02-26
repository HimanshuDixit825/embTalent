"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectTechnologies,
  selectMainTechnology,
} from "@/app/store/techSlice";
import { budgetData } from "@/app/data/budget/budgetData";
import PageLayout from "@/components/PageLayout";
import RightPanel from "@/components/RightPanel";
import SuccessPopover from "@/components/SuccessPopover";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
const ExperiencePage = () => {
  const selectedTechs = useSelector(selectTechnologies);
  const mainSelection = useSelector(selectMainTechnology);
  const router = useRouter();
  const [areBudgetsLoaded, setAreBudgetsLoaded] = useState(false);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);
  const normalizeTechName = (techName) => {
    const mappings = {
      "Next.js": "React",
      "C#": ".NET",
    };
    return mappings[techName] || techName;
  };
  const [selectedItems, setSelectedItems] = useState({
    Seniority: null,
    Duration: null,
    Budget: null,
    BudgetIndex: null, // Track which budget option was selected
  });
  const [calculatedBudgets, setCalculatedBudgets] = useState({
    budget1: { value: null, isRecommended: false },
    budget2: { value: null, isRecommended: false },
    budget3: { value: null, isRecommended: false },
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Calculate budgets when selections change
  const calculateBudgets = () => {
    const rawTechStack =
      selectedTechs.length > 0 ? selectedTechs[0]?.label : mainSelection?.label;
    const techStack = normalizeTechName(rawTechStack);
    const seniority = selectedItems.Seniority?.split(" ")[0];
    if (techStack && seniority && selectedItems.Duration) {
      if (!areBudgetsLoaded) {
        setIsLoadingBudget(true);
      }
      const techBudgets = budgetData[techStack]?.[seniority];
      if (techBudgets) {
        if (!areBudgetsLoaded) {
          setTimeout(() => {
            setCalculatedBudgets({
              budget1: {
                value:
                  typeof techBudgets.budget1 === "object"
                    ? techBudgets.budget1.value
                    : techBudgets.budget1,
                isRecommended:
                  typeof techBudgets.budget1 === "object"
                    ? techBudgets.budget1.isRecommended || false
                    : false,
              },
              budget2: {
                value:
                  typeof techBudgets.budget2 === "object"
                    ? techBudgets.budget2.value
                    : techBudgets.budget2,
                isRecommended:
                  typeof techBudgets.budget2 === "object"
                    ? techBudgets.budget2.isRecommended || false
                    : false,
              },
              budget3: {
                value:
                  typeof techBudgets.budget3 === "object"
                    ? techBudgets.budget3.value
                    : techBudgets.budget3,
                isRecommended:
                  typeof techBudgets.budget3 === "object"
                    ? techBudgets.budget3.isRecommended || false
                    : false,
              },
            });
            setAreBudgetsLoaded(true);
            setIsLoadingBudget(false);
          }, 3000);
        } else {
          setCalculatedBudgets({
            budget1: {
              value:
                typeof techBudgets.budget1 === "object"
                  ? techBudgets.budget1.value
                  : techBudgets.budget1,
              isRecommended:
                typeof techBudgets.budget1 === "object"
                  ? techBudgets.budget1.isRecommended || false
                  : false,
            },
            budget2: {
              value:
                typeof techBudgets.budget2 === "object"
                  ? techBudgets.budget2.value
                  : techBudgets.budget2,
              isRecommended:
                typeof techBudgets.budget2 === "object"
                  ? techBudgets.budget2.isRecommended || false
                  : false,
            },
            budget3: {
              value:
                typeof techBudgets.budget3 === "object"
                  ? techBudgets.budget3.value
                  : techBudgets.budget3,
              isRecommended:
                typeof techBudgets.budget3 === "object"
                  ? techBudgets.budget3.isRecommended || false
                  : false,
            },
          });
        }
      }
    } else {
      setCalculatedBudgets({
        budget1: { value: null, isRecommended: false },
        budget2: { value: null, isRecommended: false },
        budget3: { value: null, isRecommended: false },
      });
      setAreBudgetsLoaded(false);
      setIsLoadingBudget(false);
    }
  };
  useEffect(() => {
    calculateBudgets();
  }, [selectedTechs, mainSelection, selectedItems]);
  const LoadingBudget = () => (
    <div className="flex items-center justify-center h-[72px] bg-[#6B6B6B80] border border-[#515050] rounded-lg">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
  const Loader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1C] p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-transparent border-t-emerald-500 border-l-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 border-4 border-transparent border-t-emerald-400 border-l-emerald-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          <div className="absolute w-8 h-8 border-4 border-transparent border-t-emerald-300 border-l-emerald-300 rounded-full animate-[spin_2s_linear_infinite]"></div>
        </div>
        <p className="text-white text-sm mt-4">Analyzing Budget...</p>
      </div>
    </div>
  );

  const formatBudget = (amount) => {
    if (!amount) return "$--,---";
    return `$${amount.toLocaleString()}`;
  };
  const isFormComplete = () => {
    // Check only required fields: Seniority, Duration, and Budget
    return (
      selectedItems.Seniority !== null &&
      selectedItems.Duration !== null &&
      selectedItems.Budget !== null &&
      selectedItems.BudgetIndex !== null
    );
  };

  const handleSelection = (category, label) => {
    if (category === "Budget") {
      // Find which budget option was selected
      const budgetIndex = ["budget1", "budget2", "budget3"].findIndex(
        (_, index) =>
          formatBudget(calculatedBudgets[`budget${index + 1}`].value) === label
      );
      setSelectedItems((prev) => ({
        ...prev,
        [category]: label,
        BudgetIndex: budgetIndex !== -1 ? `budget${budgetIndex + 1}` : null,
      }));
    } else {
      // Reset budgets state when Seniority or Duration changes
      if (category === "Seniority" || category === "Duration") {
        setAreBudgetsLoaded(false);
        setIsLoadingBudget(false);
      }
      setSelectedItems((prev) => ({
        ...prev,
        [category]: label,
        ...(category === "Seniority" || category === "Duration"
          ? { Budget: null, BudgetIndex: null }
          : {}),
      }));
    }
  };
  const pageContent = {
    title: "Set Experience and Engagement",
    description:
      "Choose the seniority and duration to see tailored hiring budgets that fit your needs.",
    sections: [
      {
        title: "Seniority",
        items: [
          {
            label: "Mid Senior",
            subLabel: "2-5 years of experience",
            category: "Seniority",
          },
          {
            label: "Senior",
            subLabel: "6-9 years of experience",
            category: "Seniority",
          },
        ],
      },
      {
        title: "Engagement Duration",
        items: [
          { label: "3 Months", category: "Duration" },
          { label: "6 Months", category: "Duration" },
          { label: "9 Months", category: "Duration" },
          { label: "12 Months", category: "Duration" },
        ],
      },
      {
        title: "Budget (starts from)",
        // description: "Starts From",
        items: isLoadingBudget
          ? [
              <LoadingBudget key={1} />,
              <LoadingBudget key={2} />,
              <LoadingBudget key={3} />,
            ]
          : [
              {
                label: formatBudget(calculatedBudgets.budget1.value),
                category: "Budget",
                recommended:
                  areBudgetsLoaded && calculatedBudgets.budget1.isRecommended,
              },
              {
                label: formatBudget(calculatedBudgets.budget2.value),
                category: "Budget",
                recommended:
                  areBudgetsLoaded && calculatedBudgets.budget2.isRecommended,
              },
              {
                label: formatBudget(calculatedBudgets.budget3.value),
                category: "Budget",
                recommended:
                  areBudgetsLoaded && calculatedBudgets.budget3.isRecommended,
              },
            ],
      },
    ],
  };
  const RightPanelComponent = <RightPanel />;

  return (
    <PageLayout rightPanel={RightPanelComponent}>
      <div className="space-y-3 md:space-y-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-start gap-2 md:gap-3">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-gray-300 transition-colors mt-1 md:mt-2"
            >
              <ArrowLeft className="w-6 h-6 md:w-6 md:h-6" />
            </button>
            <div>
              <h1 className="text-[24px] md:text-[32px] font-bold text-white mb-1 md:mb-1">
                {pageContent.title}
              </h1>
              <p className="text-gray-400 italic text-[10px] md:text-[12px] font-inter">
                {pageContent.description}
              </p>
            </div>
          </div>
        </div>
        {pageContent.sections.map((section, index) => (
          <div key={index} className="space-y-2 md:space-y-4">
            <h2 className="text-lg md:text-lg font-semibold text-white font-inter">
              {section.title}
            </h2>

            <div
              className={`grid grid-cols-3 md:grid-cols-${
                section.title === "Engagement Duration" ? "4" : "3"
              } gap-2 md:gap-4`}
            >
              {section.items.map((item, itemIndex) => {
                const isSelected = selectedItems[item.category] === item.label;
                const isSenioritySection = item.category === "Seniority";
                return (
                  <div
                    key={itemIndex}
                    onClick={() => handleSelection(item.category, item.label)}
                    className={`bg-[#6B6B6B80] border hover:bg-gray-700 group relative font-inter
                                                rounded-lg p-3 md:p-3 cursor-pointer transition-all duration-300 h-[55px] md:h-[65px] flex flex-col justify-center
                                                ${
                                                  isSelected
                                                    ? "border-emerald-500 border-2"
                                                    : "border-[#515050]"
                                                }
                                                ${
                                                  !isSenioritySection
                                                    ? "text-center"
                                                    : ""
                                                }`}
                  >
                    {item.recommended && areBudgetsLoaded && (
                      <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-green-500 px-1 py-1 rounded-bl-lg rounded-tl-lg rounded-tr-lg shadow-lg z-10">
                        <Image
                          src="/like.png"
                          alt="Recommended"
                          width={30}
                          height={30}
                          className="object-contain brightness-150"
                        />
                        {/* <span className="text-white font-bold text-[6px]">
                          Recommended
                        </span> */}
                      </div>
                    )}
                    <div
                      className={`text-gray-400 font-medium text-sm md:text-sm transition-colors group-hover:text-white
                                                      ${
                                                        isSelected
                                                          ? "text-white"
                                                          : ""
                                                      }`}
                    >
                      {item.label}
                    </div>
                    {item.subLabel && (
                      <div className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1 group-hover:text-gray-300 transition-colors">
                        {item.subLabel}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-[9px] md:text-sm mt-3 md:mt-6 mb-2 md:mb-4">
        * The recommended pricing above aligns closely with similar use cases
        we've effectively catered to in the past, ensuring optimal value and
        quality talent
      </p>
      <div className="flex justify-end mt-8 md:mt-16">
        <button
          onClick={async () => {
            // Prevent multiple submissions
            if (!isFormComplete() || isSubmitting) return;
            const token = localStorage.getItem("recruitment_flow_token");
            if (!token) {
              console.error("No token found");
              return;
            }
            setIsSubmitting(true);
            try {
              // Get the actual numeric budget value
              const budgetValue = selectedItems.BudgetIndex
                ? calculatedBudgets[selectedItems.BudgetIndex].value
                : null;
              // Save data only on submit
              const response = await fetch("/api/lead-line-item", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  temporary_token: token,
                  experience: selectedItems.Seniority,
                  seniority: selectedItems.Seniority,
                  engagement_duration: selectedItems.Duration,
                  budget: budgetValue,
                }),
              });
              const data = await response.json();
              if (!data.success) {
                console.error("Error updating record:", data.error);
                return;
              }
              // Only show success popover after successful save
              setIsPopoverOpen(true);
            } catch (error) {
              console.error("Error updating record:", error);
            } finally {
              setIsSubmitting(false);
            }
          }}
          disabled={!isFormComplete() || isSubmitting}
          className={`${
            isFormComplete()
              ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              : "bg-gray-600 cursor-not-allowed opacity-50"
          } text-white px-6 md:px-10 py-2 md:py-4 text-sm md:text-base rounded-lg transition-colors relative z-10`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      <SuccessPopover
        isOpen={isPopoverOpen}
        onClose={() => {
          setIsPopoverOpen(false);
          router.push("/experience");
        }}
      />
      {isLoadingBudget && <Loader />}
    </PageLayout>
  );
};
export default ExperiencePage;
