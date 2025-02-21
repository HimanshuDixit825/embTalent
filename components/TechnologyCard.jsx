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
} from "@/app/store/techSlice";

const updateTechSkills = async (token, skills) => {
  try {
    // console.error('\n[Client] updateTechSkills called with:', { token, skills });
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
    // console.error('[Client] Update API Response:', result);

    if (!response.ok || !result.success) {
      // console.error('[Client] Tech skills update failed:', result.error);
      throw new Error(result.error || "Failed to update tech skills");
    }

    // console.error('[Client] Tech skills updated successfully:', result.data);
    return result.data;
  } catch (error) {
    // console.error('[Client] Tech skills update error:', error);
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
    // console.error('\n[Client] Card clicked - Label:', label, 'Category:', category);

    if (isMainSelection) {
      // console.error('[Client] Main selection clicked:', { label, category });
      try {
        // Create initial record with domain
        // console.error('[Client] Creating initial record with domain:', label);
        // console.error('[Client] Making POST request with:', {
        // domain: label,
        // tech_skills: []
        // });
        // if (isMainSelection) {
        //     dispatch(
        //       setMainSelection({
        //         label,
        //         imageSrc,
        //         category,
        //         href,
        //       })
        //     );
        //     if (href) {
        //       router.push(href);
        //     }
        //   }
        const response = await fetch("/api/lead-line-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain: label,
            tech_skills: [],
          }),
        });

        const responseText = await response.text();
        // console.error('[Client] Raw API Response:', responseText);

        let result;
        try {
          result = JSON.parse(responseText);
          // console.error('[Client] Parsed API Response:', result);
        } catch (parseError) {
          // console.error('[Client] Failed to parse API response:', parseError);
          throw new Error("Invalid API response");
        }

        if (!response.ok || !result.success) {
          // console.error('[Client] Failed to create record:', {
          //     status: response.status,
          //     statusText: response.statusText,
          //     error: result.error
          // });
          throw new Error(result.error || "Failed to create record");
        }

        const { data } = result;
        // console.error('[Client] Record created successfully:', data);

        // Store token in localStorage
        // console.error('[Client] Storing token in localStorage:', data.temporary_token);
        localStorage.setItem("recruitment_flow_token", data.temporary_token);
        if (isMainSelection) {
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
        // Update Redux state
        // console.error('[Client] Updating Redux state');
        dispatch(setMainSelection({ label, imageSrc, category }));

        // Wait for token to be set in localStorage
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Then navigate
        // console.error('[Client] Navigating to:', href);
        if (href) {
          //   window.location.href = href;
          router.push(href);
        }
      } catch (error) {
        // console.error('[Client] Error creating record:', error);
        // Still allow navigation even if record creation fails
        dispatch(setMainSelection({ label, imageSrc, category }));
        if (href) {
          setTimeout(() => {
            // window.location.href = href;
            router.push(href);
          }, 100);
        }
      }
    } else {
      const isFullstack = mainSelection?.label === "Fullstack";
      // console.error('[Client] Technology selection:', {
      //     mainSelection: mainSelection?.label,
      //     isFullstack,
      //     selectedTech: { label, category }
      // });

      try {
        // Get token from localStorage or create new record
        let token = localStorage.getItem("recruitment_flow_token");
        // console.error('[Client] Retrieved token from localStorage:', token);

        if (!token) {
          // console.error('[Client] No token found, creating new record');
          // If no token, create a new record
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
          // console.error('[Client] API Response:', result);

          if (!response.ok || !result.success) {
            // console.error('[Client] Failed to create record:', result.error);
            throw new Error(result.error || "Failed to create record");
          }

          const { data } = result;
          // console.error('[Client] New record created:', data);
          token = data.temporary_token;
          localStorage.setItem("recruitment_flow_token", token);
        }

        // console.error('[Client] Using token for updates:', token);

        if (isFullstack) {
          // console.error('[Client] Fullstack route detected - Main Selection:', mainSelection?.label);
          // For fullstack route
          dispatch(toggleTechnology({ label, imageSrc, category }));

          // Check if this is a stack selection
          if (category === "stack") {
            // Update tech_skills and navigate
            await updateTechSkills(token, [label]);
            // console.error('[Client] Stack category detected - Routing to /create-jd');
            setTimeout(() => {
              //   window.location.href = "/create-jd";
              router.push("/create-jd");
            }, 100);
          } else {
            // For frontend/backend selections
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
            // console.error('[Client] Frontend/Backend status:', { hasFrontend, hasBackend });

            if (hasFrontend && hasBackend) {
              // Update tech_skills with both selections
              const skills = nextTechs.map((tech) => tech.label);
              await updateTechSkills(token, skills);
              // console.error('[Client] Frontend + Backend selected - Routing to /create-jd');
              setTimeout(() => {
                // window.location.href = "/create-jd";
                router.push("/create-jd");
              }, 100);
            }
          }
        } else {
          // For non-fullstack routes
          dispatch(toggleTechnology({ label, imageSrc, category }));
          // Update tech_skills and navigate
          await updateTechSkills(token, [label]);
          //   window.location.href = "/create-jd";
          router.push("/create-jd");
        }
      } catch (error) {
        // console.error('[Client] Error updating tech skills:', error);
        // Still allow navigation even if update fails
        if (isFullstack) {
          dispatch(toggleTechnology({ label, imageSrc, category }));
          if (category === "stack") {
            // window.location.href = "/create-jd";
            router.push("/create-jd");
          }
        } else {
          dispatch(toggleTechnology({ label, imageSrc, category }));
          //   window.location.href = "/create-jd";
          router.push("/create-jd");
        }
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group rounded-lg transition-all duration-300 cursor-pointer
                transform hover:-translate-y-1 hover:shadow-lg w-[100px] h-[131px] flex flex-col items-center justify-center p-3
                ${
                  isSelected
                    ? "bg-emerald-900 bg-opacity-50"
                    : "bg-[#3A3A3A80] border border-[#515050]  hover:bg-gray-700"
                }`}
    >
      <div
        className="transform transition-all duration-300 
                group-hover:scale-110 w-[70px] h-[70px] flex items-center justify-center"
      >
        <Image
          src={imageSrc}
          alt={label}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <span className="text-white text-xs font-bold text-center transition-all duration-300 group-hover:text-opacity-90 mt-2">
        {label}
      </span>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
      )}
    </button>
  );
};

export default TechnologyCard;
