import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { defaultResumeData, sampleResumeData, genId } from '../utils/defaultData'

// ─── Context ──────────────────────────────────────────────────────────────────
const ResumeContext = createContext(null)
export const useResume = () => useContext(ResumeContext)

// ─── Reducer ──────────────────────────────────────────────────────────────────
function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_ALL':
      return { ...action.payload }

    case 'UPDATE_PERSONAL':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } }

    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    case 'ADD_ITEM': {
      const { section, item } = action.payload
      return { ...state, [section]: [...state[section], { id: genId(), ...item }] }
    }
    case 'UPDATE_ITEM': {
      const { section, id, data } = action.payload
      return {
        ...state,
        [section]: state[section].map(item => item.id === id ? { ...item, ...data } : item),
      }
    }
    case 'REMOVE_ITEM': {
      const { section, id } = action.payload
      return { ...state, [section]: state[section].filter(item => item.id !== id) }
    }
    case 'REORDER_ITEM': {
      const { section, fromIndex, toIndex } = action.payload
      const arr = [...state[section]]
      const [moved] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, moved)
      return { ...state, [section]: arr }
    }

    case 'TOGGLE_SECTION': {
      const key = action.payload
      const active = state.settings.activeSections
      const next = active.includes(key)
        ? active.filter(s => s !== key)
        : [...active, key]
      return { ...state, settings: { ...state.settings, activeSections: next } }
    }
    case 'REORDER_SECTIONS': {
      return { ...state, settings: { ...state.settings, sectionOrder: action.payload } }
    }

    case 'ADD_CUSTOM_SECTION': {
      const newSection = { id: genId(), title: 'Custom Section', entries: [] }
      return { ...state, customSections: [...state.customSections, newSection] }
    }
    case 'UPDATE_CUSTOM_SECTION': {
      const { id, data } = action.payload
      return {
        ...state,
        customSections: state.customSections.map(s => s.id === id ? { ...s, ...data } : s),
      }
    }
    case 'REMOVE_CUSTOM_SECTION': {
      return { ...state, customSections: state.customSections.filter(s => s.id !== action.payload) }
    }

    case 'RESET':
      return { ...defaultResumeData }
    case 'LOAD_SAMPLE':
      return { ...sampleResumeData }

    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'resumeforge_v1'

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, defaultResumeData, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...init, ...JSON.parse(saved) } : { ...sampleResumeData }
    } catch {
      return { ...sampleResumeData }
    }
  })

  // Auto-save on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('localStorage save failed:', e)
    }
  }, [state])

  // ── Action helpers ──────────────────────────────────────────────────────────
  const updatePersonal  = useCallback((data) => dispatch({ type: 'UPDATE_PERSONAL', payload: data }), [])
  const updateSummary   = useCallback((val)  => dispatch({ type: 'UPDATE_SUMMARY', payload: val }), [])
  const updateSettings  = useCallback((data) => dispatch({ type: 'UPDATE_SETTINGS', payload: data }), [])

  const addItem      = useCallback((section, item = {})       => dispatch({ type: 'ADD_ITEM',    payload: { section, item } }), [])
  const updateItem   = useCallback((section, id, data)        => dispatch({ type: 'UPDATE_ITEM', payload: { section, id, data } }), [])
  const removeItem   = useCallback((section, id)              => dispatch({ type: 'REMOVE_ITEM', payload: { section, id } }), [])
  const reorderItem  = useCallback((section, from, to)        => dispatch({ type: 'REORDER_ITEM', payload: { section, fromIndex: from, toIndex: to } }), [])

  const toggleSection   = useCallback((key)   => dispatch({ type: 'TOGGLE_SECTION', payload: key }), [])
  const reorderSections = useCallback((order) => dispatch({ type: 'REORDER_SECTIONS', payload: order }), [])

  const addCustomSection    = useCallback(()       => dispatch({ type: 'ADD_CUSTOM_SECTION' }), [])
  const updateCustomSection = useCallback((id, d)  => dispatch({ type: 'UPDATE_CUSTOM_SECTION', payload: { id, data: d } }), [])
  const removeCustomSection = useCallback((id)     => dispatch({ type: 'REMOVE_CUSTOM_SECTION', payload: id }), [])

  const resetResume  = useCallback(() => dispatch({ type: 'RESET' }), [])
  const loadSample   = useCallback(() => dispatch({ type: 'LOAD_SAMPLE' }), [])

  const value = {
    resume: state,
    updatePersonal, updateSummary, updateSettings,
    addItem, updateItem, removeItem, reorderItem,
    toggleSection, reorderSections,
    addCustomSection, updateCustomSection, removeCustomSection,
    resetResume, loadSample,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}