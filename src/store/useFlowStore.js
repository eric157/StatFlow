import { create } from 'zustand'

const wizardDefaults = {
  goal: 'compare',
  dataType: 'numerical',
  groups: '2',
  normality: 'unknown',
}

export const useFlowStore = create((set) => ({
  activePhase: 'all',
  searchQuery: '',
  selectedMethodId: null,
  wizard: wizardDefaults,
  openStageIds: [],
  setActivePhase: (phase) => set({ activePhase: phase }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectMethod: (id) => set({ selectedMethodId: id }),
  setWizard: (updates) =>
    set((state) => ({
      wizard: {
        ...state.wizard,
        ...updates,
      },
    })),
  setOpenStageIds: (ids) => set({ openStageIds: ids }),
  ensureStageOpen: (id) =>
    set((state) => {
      if (state.openStageIds.includes(id)) {
        return { openStageIds: state.openStageIds }
      }
      return { openStageIds: [...state.openStageIds, id] }
    }),
  resetFilters: () => set({ activePhase: 'all', searchQuery: '' }),
  clearSelection: () => set({ selectedMethodId: null }),
}))
