// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   mainSelection: null, // For first page selection (e.g., Frontend, Backend)
//   previousSelection: null, // Add this to track previous selection
//   selectedTechnologies: [], // For specific technologies within the main selection
//   mustHaveSkills: [], // Skills identified as must-have during chat
//   goodToHaveSkills: [], // Skills identified as good-to-have during chat
//   explanation: "", // Explanation of the skills analysis
//   analyzing: false, // Whether currently analyzing a PDF
//   selectedCategories: {}, // Track selections by category for fullstack
// };

// export const techSlice = createSlice({
//   name: "tech",
//   initialState,
//   reducers: {
//     setMainSelection: (state, action) => {
//       // state.mainSelection = action.payload;
//       // state.selectedTechnologies = []; // Clear specific selections when main selection changes
//       state.previousSelection = state.mainSelection; // Store previous selection
//       state.mainSelection = action.payload;

//       // Clear skills only if technology changed
//       if (state.previousSelection?.label !== action.payload.label) {
//         state.selectedTechnologies = [];
//         state.mustHaveSkills = [];
//         state.goodToHaveSkills = [];
//       }
//     },
//     removeMustHaveSkill: (state, action) => {
//       const skill = action.payload;
//       state.mustHaveSkills = state.mustHaveSkills.filter((s) => s !== skill);
//     },
//     removeGoodToHaveSkill: (state, action) => {
//       const skill = action.payload;
//       state.goodToHaveSkills = state.goodToHaveSkills.filter(
//         (s) => s !== skill
//       );
//     },
//     toggleTechnology: (state, action) => {
//       const tech = action.payload;
//       const isFullstack = state.mainSelection?.label === "Fullstack";

//       // changes starts

//       // Clear skills for any technology change
//       const currentTech = state.selectedTechnologies.find(
//         (t) => t.category === tech.category
//       );
//       if (!currentTech || currentTech.label !== tech.label) {
//         state.mustHaveSkills = [];
//         state.goodToHaveSkills = [];
//       }

//       // Update selections
//       if (state.mainSelection?.label === "Fullstack") {
//         state.selectedTechnologies = state.selectedTechnologies.filter(
//           (t) => t.category !== tech.category
//         );
//         state.selectedCategories = {
//           ...state.selectedCategories,
//           [tech.category]: tech,
//         };
//         state.selectedTechnologies.push(tech);
//       } else {
//         state.selectedTechnologies = [tech];
//         state.selectedCategories = { [tech.category]: tech };
//       }

//       // changes ends

//       // For fullstack, allow one selection per category
//       if (isFullstack) {
//         // Remove any existing tech in the same category
//         state.selectedTechnologies = state.selectedTechnologies.filter(
//           (t) => t.category !== tech.category
//         );
//         // Update selected categories
//         state.selectedCategories = {
//           ...state.selectedCategories,
//           [tech.category]: tech,
//         };
//         // Add new tech
//         state.selectedTechnologies.push(tech);
//       } else {
//         // For non-fullstack, allow only one selection total
//         state.selectedTechnologies = [tech];
//         state.selectedCategories = { [tech.category]: tech };
//       }
//     },
//     clearSelections: (state) => {
//       state.mainSelection = null;
//       state.selectedTechnologies = [];
//       state.selectedCategories = {};
//     },
//     addMustHaveSkill: (state, action) => {
//       const skill = action.payload;
//       if (!state.mustHaveSkills.includes(skill)) {
//         state.mustHaveSkills.push(skill);
//       }
//     },
//     addGoodToHaveSkill: (state, action) => {
//       const skill = action.payload;
//       if (!state.goodToHaveSkills.includes(skill)) {
//         state.goodToHaveSkills.push(skill);
//       }
//     },
//     setExplanation: (state, action) => {
//       state.explanation = action.payload;
//     },
//     clearSkills: (state) => {
//       state.mustHaveSkills = [];
//       state.goodToHaveSkills = [];
//       state.explanation = "";
//     },
//     setAnalyzing: (state, action) => {
//       state.analyzing = action.payload;
//     },
//   },
// });

// export const {
//   setMainSelection,
//   toggleTechnology,
//   clearSelections,
//   addMustHaveSkill,
//   addGoodToHaveSkill,
//   removeMustHaveSkill,
//   removeGoodToHaveSkill,
//   setExplanation,
//   clearSkills,
//   setAnalyzing,
// } = techSlice.actions;

// export const selectMainTechnology = (state) => state.tech.mainSelection;
// export const selectTechnologies = (state) => state.tech.selectedTechnologies;
// export const selectMustHaveSkills = (state) => state.tech.mustHaveSkills;
// export const selectGoodToHaveSkills = (state) => state.tech.goodToHaveSkills;
// export const selectExplanation = (state) => state.tech.explanation;
// export const selectAnalyzing = (state) => state.tech.analyzing;

// // Selector to check if fullstack selection is valid
// export const selectFullstackValidation = (state) => {
//   const mainSelection = state.tech.mainSelection;
//   const selectedTechs = state.tech.selectedTechnologies;

//   // Only validate for fullstack
//   if (mainSelection?.label !== "Fullstack") return false;

//   // Check if a stack-based technology is selected
//   const hasStack = selectedTechs.some((tech) => tech.category === "stack");
//   if (hasStack) return true;

//   // Check if both frontend and backend are selected
//   const hasFrontend = selectedTechs.some(
//     (tech) => tech.category === "frontend"
//   );
//   const hasBackend = selectedTechs.some((tech) => tech.category === "backend");

//   return hasFrontend && hasBackend;
// };

// export default techSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainSelection: null,
  previousSelection: null,
  selectedTechnologies: [],
  mustHaveSkills: [],
  goodToHaveSkills: [],
  explanation: "",
  analyzing: false,
  selectedCategories: {},
};

export const techSlice = createSlice({
  name: "tech",
  initialState,
  reducers: {
    setMainSelection: (state, action) => {
      const isSameTechnology =
        state.mainSelection?.label === action.payload.label;
      state.previousSelection = state.mainSelection;
      state.mainSelection = action.payload;

      // Only clear skills and selections if technology changed
      if (!isSameTechnology) {
        state.selectedTechnologies = [];
        state.mustHaveSkills = [];
        state.goodToHaveSkills = [];
        state.explanation = "";
      }
    },
    restoreSkills: (state, action) => {
      state.mustHaveSkills = action.payload.mustHave || [];
      state.goodToHaveSkills = action.payload.goodToHave || [];
    },
    removeMustHaveSkill: (state, action) => {
      const skill = action.payload;
      state.mustHaveSkills = state.mustHaveSkills.filter((s) => s !== skill);
    },
    removeGoodToHaveSkill: (state, action) => {
      const skill = action.payload;
      state.goodToHaveSkills = state.goodToHaveSkills.filter(
        (s) => s !== skill
      );
    },
    toggleTechnology: (state, action) => {
      const tech = action.payload;
      const isFullstack = state.mainSelection?.label === "Fullstack";

      // Check if it's the same technology
      const currentTech = state.selectedTechnologies.find(
        (t) => t.category === tech.category
      );
      const isSameTechnology = currentTech?.label === tech.label;

      if (isFullstack) {
        // If selecting frontend/backend, clear any stack selection
        if (tech.category === "frontend" || tech.category === "backend") {
          // Remove any stack selection
          state.selectedTechnologies = state.selectedTechnologies.filter(
            (t) => t.category !== "stack"
          );
          delete state.selectedCategories["stack"];
        }

        // If selecting stack, clear frontend/backend selections
        if (tech.category === "stack") {
          // Remove any frontend/backend selections
          state.selectedTechnologies = state.selectedTechnologies.filter(
            (t) => t.category !== "frontend" && t.category !== "backend"
          );
          delete state.selectedCategories["frontend"];
          delete state.selectedCategories["backend"];
        }

        // Remove any existing tech in the same category
        state.selectedTechnologies = state.selectedTechnologies.filter(
          (t) => t.category !== tech.category
        );

        // Update selected categories
        state.selectedCategories = {
          ...state.selectedCategories,
          [tech.category]: tech,
        };

        // Add new tech
        state.selectedTechnologies.push(tech);

        // Only clear skills if technology changed
        if (!isSameTechnology) {
          state.mustHaveSkills = [];
          state.goodToHaveSkills = [];
        }
      } else {
        // For non-fullstack, allow only one selection total
        state.selectedTechnologies = [tech];
        state.selectedCategories = { [tech.category]: tech };

        // Only clear skills if technology changed
        if (!isSameTechnology) {
          state.mustHaveSkills = [];
          state.goodToHaveSkills = [];
        }
      }
    },
    clearSelections: (state) => {
      state.mainSelection = null;
      state.selectedTechnologies = [];
      state.selectedCategories = {};
    },
    addMustHaveSkill: (state, action) => {
      const skill = action.payload;
      if (!state.mustHaveSkills.includes(skill)) {
        state.mustHaveSkills.push(skill);
      }
    },
    addGoodToHaveSkill: (state, action) => {
      const skill = action.payload;
      if (!state.goodToHaveSkills.includes(skill)) {
        state.goodToHaveSkills.push(skill);
      }
    },
    setExplanation: (state, action) => {
      state.explanation = action.payload;
    },
    clearSkills: (state) => {
      state.mustHaveSkills = [];
      state.goodToHaveSkills = [];
      state.explanation = "";
    },
    setAnalyzing: (state, action) => {
      state.analyzing = action.payload;
    },
  },
});

export const {
  setMainSelection,
  toggleTechnology,
  clearSelections,
  addMustHaveSkill,
  addGoodToHaveSkill,
  removeMustHaveSkill,
  removeGoodToHaveSkill,
  setExplanation,
  clearSkills,
  setAnalyzing,
  restoreSkills,
} = techSlice.actions;

export const selectMainTechnology = (state) => state.tech.mainSelection;
export const selectTechnologies = (state) => state.tech.selectedTechnologies;
export const selectMustHaveSkills = (state) => state.tech.mustHaveSkills;
export const selectGoodToHaveSkills = (state) => state.tech.goodToHaveSkills;
export const selectExplanation = (state) => state.tech.explanation;
export const selectAnalyzing = (state) => state.tech.analyzing;

export const selectFullstackValidation = (state) => {
  const mainSelection = state.tech.mainSelection;
  const selectedTechs = state.tech.selectedTechnologies;

  if (mainSelection?.label !== "Fullstack") return false;

  const hasStack = selectedTechs.some((tech) => tech.category === "stack");
  if (hasStack) return true;

  const hasFrontend = selectedTechs.some(
    (tech) => tech.category === "frontend"
  );
  const hasBackend = selectedTechs.some((tech) => tech.category === "backend");

  return hasFrontend && hasBackend;
};

export default techSlice.reducer;
