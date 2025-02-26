"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setMainSelection,
  toggleTechnology,
  selectMainTechnology,
  selectTechnologies,
  selectFullstackValidation,
  restoreSkills,
} from "@/app/store/techSlice";

const updateTechSkills = async (token, skills) => {
  try {
    const response = await fetch("/api/lead-line-item", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temporary_token: token,
        tech_skills: skills,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to update tech skills");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};

const TechnologyCard = ({
  imageSrc,
  label,
  href,
  category,
  isMainSelection = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mainSelection = useSelector(selectMainTechnology);
  const selectedTechs = useSelector(selectTechnologies);
  const isFullstackValid = useSelector(selectFullstackValidation);

  const isSelected = isMainSelection
    ? mainSelection?.label === label
    : selectedTechs.some(
        (tech) => tech.label === label && tech.category === category
      );

  const handleClick = async (e) => {
    e.preventDefault();

    if (isMainSelection) {
      try {
        const previousLabel = mainSelection?.label;
        const isSameTechnology = previousLabel === label;
        let token = localStorage.getItem("recruitment_flow_token");

        if (isSameTechnology && token) {
          // Same technology - fetch existing record to restore skills
          try {
            const response = await fetch(`/api/lead-line-item?token=${token}`);
            const result = await response.json();

            if (result.success && result.data) {
              // Update Redux state first
              dispatch(
                setMainSelection({
                  label,
                  imageSrc,
                  category,
                  href,
                })
              );

              // Restore skills if they exist
              if (
                result.data.must_have?.length > 0 ||
                result.data.good_to_have?.length > 0
              ) {
                dispatch(
                  restoreSkills({
                    mustHave: result.data.must_have || [],
                    goodToHave: result.data.good_to_have || [],
                  })
                );
              }
            }
          } catch (error) {
            console.error("Error fetching existing skills:", error);
          }
        } else {
          // Different technology - create new record with empty skills
          const response = await fetch("/api/lead-line-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              domain: label,
              tech_skills: [],
              must_have: [],
              good_to_have: [],
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to create record");
          }

          token = result.data.temporary_token;
          localStorage.setItem("recruitment_flow_token", token);

          // Update Redux state (this will clear skills due to techSlice logic)
          dispatch(
            setMainSelection({
              label,
              imageSrc,
              category,
              href,
            })
          );
        }

        // Navigate after state updates
        if (href) {
          router.push(href);
        }
      } catch (error) {
        console.error("Error handling technology selection:", error);
        // Still allow navigation even if API calls fail
        dispatch(
          setMainSelection({
            label,
            imageSrc,
            category,
            href,
          })
        );
        if (href) {
          router.push(href);
        }
      }
    } else {
      // Non-main selection handling (Fullstack and specific technologies)
      const isFullstack = mainSelection?.label === "Fullstack";

      try {
        let token = localStorage.getItem("recruitment_flow_token");

        if (!token) {
          const response = await fetch("/api/lead-line-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              domain: mainSelection.label,
              tech_skills: [],
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to create record");
          }

          token = result.data.temporary_token;
          localStorage.setItem("recruitment_flow_token", token);
        }

        // Check if it's the same technology
        const currentTech = selectedTechs.find((t) => t.category === category);
        const isSameTechnology = currentTech?.label === label;

        if (isSameTechnology && token) {
          // Same technology - fetch and restore existing skills
          try {
            const response = await fetch(`/api/lead-line-item?token=${token}`);
            const result = await response.json();

            if (result.success && result.data) {
              dispatch(toggleTechnology({ label, imageSrc, category }));

              // Restore skills if they exist
              if (
                result.data.must_have?.length > 0 ||
                result.data.good_to_have?.length > 0
              ) {
                dispatch(
                  restoreSkills({
                    mustHave: result.data.must_have || [],
                    goodToHave: result.data.good_to_have || [],
                  })
                );
              }

              if (isFullstack) {
                if (category === "stack") {
                  router.push("/create-jd");
                } else {
                  const hasFrontend = selectedTechs.some(
                    (tech) => tech.category === "frontend"
                  );
                  const hasBackend = selectedTechs.some(
                    (tech) => tech.category === "backend"
                  );

                  if (hasFrontend && hasBackend) {
                    router.push("/create-jd");
                  }
                }
              } else {
                router.push("/create-jd");
              }
            }
          } catch (error) {
            console.error("Error fetching existing skills:", error);
            // Continue with normal flow if fetch fails
            handleDifferentTechnology();
          }
        } else {
          handleDifferentTechnology();
        }

        function handleDifferentTechnology() {
          if (isFullstack) {
            dispatch(toggleTechnology({ label, imageSrc, category }));

            if (category === "stack") {
              updateTechSkills(token, [label]).then(() => {
                router.push("/create-jd");
              });
            } else {
              const nextTechs = [...selectedTechs];
              if (nextTechs.findIndex((t) => t.category === category) === -1) {
                nextTechs.push({ label, imageSrc, category });
              }

              const hasFrontend = nextTechs.some(
                (tech) => tech.category === "frontend"
              );
              const hasBackend = nextTechs.some(
                (tech) => tech.category === "backend"
              );

              if (hasFrontend && hasBackend) {
                updateTechSkills(
                  token,
                  nextTechs.map((tech) => tech.label)
                ).then(() => {
                  router.push("/create-jd");
                });
              }
            }
          } else {
            dispatch(toggleTechnology({ label, imageSrc, category }));
            updateTechSkills(token, [label]).then(() => {
              router.push("/create-jd");
            });
          }
        }
      } catch (error) {
        console.error("Error handling technology selection:", error);
        // Still allow navigation even if update fails
        if (isFullstack) {
          dispatch(toggleTechnology({ label, imageSrc, category }));
          if (category === "stack") {
            router.push("/create-jd");
          }
        } else {
          dispatch(toggleTechnology({ label, imageSrc, category }));
          router.push("/create-jd");
        }
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group rounded-lg transition-all duration-300 cursor-pointer
                transform hover:-translate-y-1 hover:shadow-lg w-full aspect-[3/3.5] sm:aspect-[3/4] flex flex-col items-center justify-center p-2 sm:p-3
                ${
                  isSelected
                    ? "bg-emerald-900 bg-opacity-50"
                    : "bg-[#3A3A3A80] border border-[#515050] hover:bg-gray-700"
                }`}
    >
      <div
        className="transform transition-all duration-300
                group-hover:scale-110 w-[55%] sm:w-[60%] aspect-square flex items-center justify-center"
      >
        <Image
          src={imageSrc}
          alt={label}
          width={64}
          height={64}
          className="object-contain w-full h-full"
        />
      </div>
      <span className="text-white text-[10px] sm:text-[11px] md:text-xs font-bold text-center transition-all duration-300 group-hover:text-opacity-90 mt-2">
        {label}
      </span>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
      )}
    </button>
  );
};

export default TechnologyCard;
