import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mainSelection: null, // For first page selection (e.g., Frontend, Backend)
    selectedTechnologies: [], // For specific technologies within the main selection
    mustHaveSkills: [], // Skills identified as must-have during chat
    goodToHaveSkills: [], // Skills identified as good-to-have during chat
    explanation: '', // Explanation of the skills analysis
    analyzing: false, // Whether currently analyzing a PDF
    selectedCategories: {}, // Track selections by category for fullstack
};

export const techSlice = createSlice({
    name: 'tech',
    initialState,
    reducers: {
        setMainSelection: (state, action) => {
            state.mainSelection = action.payload;
            state.selectedTechnologies = []; // Clear specific selections when main selection changes
        },
        removeMustHaveSkill: (state, action) => {
            const skill = action.payload;
            state.mustHaveSkills = state.mustHaveSkills.filter(s => s !== skill);
        },
        removeGoodToHaveSkill: (state, action) => {
            const skill = action.payload;
            state.goodToHaveSkills = state.goodToHaveSkills.filter(s => s !== skill);
        },
        toggleTechnology: (state, action) => {
            const tech = action.payload;
            const isFullstack = state.mainSelection?.label === 'Fullstack';

            // For fullstack, allow one selection per category
            if (isFullstack) {
                // Remove any existing tech in the same category
                state.selectedTechnologies = state.selectedTechnologies.filter(
                    t => t.category !== tech.category
                );
                // Update selected categories
                state.selectedCategories = {
                    ...state.selectedCategories,
                    [tech.category]: tech
                };
                // Add new tech
                state.selectedTechnologies.push(tech);
            } else {
                // For non-fullstack, allow only one selection total
                state.selectedTechnologies = [tech];
                state.selectedCategories = { [tech.category]: tech };
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
            state.explanation = '';
        },
        setAnalyzing: (state, action) => {
            state.analyzing = action.payload;
        }
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
    setAnalyzing
} = techSlice.actions;

export const selectMainTechnology = (state) => state.tech.mainSelection;
export const selectTechnologies = (state) => state.tech.selectedTechnologies;
export const selectMustHaveSkills = (state) => state.tech.mustHaveSkills;
export const selectGoodToHaveSkills = (state) => state.tech.goodToHaveSkills;
export const selectExplanation = (state) => state.tech.explanation;
export const selectAnalyzing = (state) => state.tech.analyzing;

// Selector to check if fullstack selection is valid
export const selectFullstackValidation = (state) => {
    const mainSelection = state.tech.mainSelection;
    const selectedTechs = state.tech.selectedTechnologies;

    // Only validate for fullstack
    if (mainSelection?.label !== 'Fullstack') return false;

    // Check if a stack-based technology is selected
    const hasStack = selectedTechs.some(tech => tech.category === 'stack');
    if (hasStack) return true;

    // Check if both frontend and backend are selected
    const hasFrontend = selectedTechs.some(tech => tech.category === 'frontend');
    const hasBackend = selectedTechs.some(tech => tech.category === 'backend');

    return hasFrontend && hasBackend;
};

export default techSlice.reducer;
