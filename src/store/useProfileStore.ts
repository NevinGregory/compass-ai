import { create } from 'zustand'

interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'info'
}

interface ExtractedSkills {
  languages: string[]
  tools: string[]
  frameworks: string[]
}

interface ProfileState {
  // Data
  targetRole: string | null
  resumeText: string
  extractedSkills: ExtractedSkills
  matchedSkills: string[]
  missingSkills: string[]
  matchScore: number | null

  // UI State
  isLoading: boolean
  error: string | null
  toast: ToastMessage | null

  // Actions
  setTargetRole: (role: string) => void
  setResumeText: (text: string) => void
  setExtractedSkills: (skills: ExtractedSkills) => void
  setMatchResults: (matched: string[], missing: string[], score: number) => void
  updateSkill: (skill: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
  reset: () => void
}

const initialState = {
  targetRole: null,
  resumeText: '',
  extractedSkills: {
    languages: [],
    tools: [],
    frameworks: []
  },
  matchedSkills: [],
  missingSkills: [],
  matchScore: null,
  isLoading: false,
  error: null,
  toast: null
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,

  setTargetRole: (role) => set({ targetRole: role }),

  setResumeText: (text) => set({ resumeText: text }),

  setExtractedSkills: (skills) => set({ extractedSkills: skills }),

  setMatchResults: (matched, missing, score) =>
    set({
      matchedSkills: matched,
      missingSkills: missing,
      matchScore: score
    }),

  updateSkill: (skill) =>
    set((state) => {
      const newMissingSkills = state.missingSkills.filter((s) => s !== skill)
      const newMatchedSkills = [...state.matchedSkills, skill]
      const newScore = Math.round(
        (newMatchedSkills.length / (newMatchedSkills.length + newMissingSkills.length)) * 100
      )
      return {
        matchedSkills: newMatchedSkills,
        missingSkills: newMissingSkills,
        matchScore: newScore
      }
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  showToast: (message, type = 'info') =>
    set({ toast: { message, type } }),

  clearToast: () => set({ toast: null }),

  reset: () => set(initialState)
}))
