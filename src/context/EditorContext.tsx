"use client";

import { Site } from "@prisma/client";
import { createContext, useState, useContext, useMemo, ReactNode } from "react";

// State interface - all form data and UI state
interface EditorState {
  id?: string;
  name: string;
  subdomain: string;
  description: string;
  selectedLayoutId: string | null;
  showTemplateModal: boolean;
  templateSelected: boolean;
  subdomainAvailable: boolean | null;
  checkingSubdomain: boolean;
  loading: boolean;
  isNew: boolean;
}

// Context type with state and all updater functions
interface EditorContextType {
  state: EditorState;
  setName: (name: string) => void;
  setSubdomain: (subdomain: string) => void;
  setDescription: (description: string) => void;
  setSelectedLayout: (layoutId: string | null) => void;
  setShowTemplateModal: (show: boolean) => void;
  setTemplateSelected: (selected: boolean) => void;
  setSubdomainAvailable: (available: boolean | null) => void;
  setCheckingSubdomain: (checking: boolean) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
}

// Create context (must be outside provider)
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Initial state for new sites
const newSiteInitialState: EditorState = {
  id: undefined,
  name: "",
  subdomain: "",
  description: "",
  selectedLayoutId: null,
  showTemplateModal: true,
  templateSelected: false,
  subdomainAvailable: null,
  checkingSubdomain: false,
  loading: false,
  isNew: true,
};

// Helper to create initial state from existing site
const createInitialStateFromSite = (site: Site): EditorState => ({
  id: site.id,
  name: site.name,
  subdomain: site.subdomain,
  description: site.description || "",
  selectedLayoutId: site.layoutId,
  showTemplateModal: false,
  templateSelected: true,
  subdomainAvailable: true, // Existing subdomain is already valid
  checkingSubdomain: false,
  loading: false,
  isNew: false,
});

// Provider component - auto-detects new vs existing based on site prop
export function EditorProvider({
  site,
  children,
}: {
  site?: Site;
  children: ReactNode;
}) {
  // Determine initial state based on whether site is provided
  const initialState = site
    ? createInitialStateFromSite(site)
    : newSiteInitialState;

  const [id, setId] = useState(initialState.id);
  const [name, setName] = useState(initialState.name);
  const [subdomain, setSubdomain] = useState(initialState.subdomain);
  const [description, setDescription] = useState(initialState.description);
  const [selectedLayoutId, setSelectedLayoutId] = useState(
    initialState.selectedLayoutId
  );
  const [showTemplateModal, setShowTemplateModal] = useState(
    initialState.showTemplateModal
  );
  const [templateSelected, setTemplateSelected] = useState(
    initialState.templateSelected
  );
  const [subdomainAvailable, setSubdomainAvailable] = useState(
    initialState.subdomainAvailable
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(
    initialState.checkingSubdomain
  );
  const [loading, setLoading] = useState(initialState.loading);
  const [isNew] = useState(initialState.isNew); // isNew is read-only

  // Convenience function to set layout id
  const setSelectedLayout = (layoutId: string | null) => {
    setSelectedLayoutId(layoutId);
  };

  // Reset form to initial state (either new site defaults or original site data)
  const resetForm = () => {
    setId(initialState.id);
    setName(initialState.name);
    setSubdomain(initialState.subdomain);
    setDescription(initialState.description);
    setSelectedLayoutId(initialState.selectedLayoutId);
    setShowTemplateModal(initialState.showTemplateModal);
    setTemplateSelected(initialState.templateSelected);
    setSubdomainAvailable(initialState.subdomainAvailable);
    setCheckingSubdomain(initialState.checkingSubdomain);
    setLoading(initialState.loading);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state: {
        id,
        name,
        subdomain,
        description,
        selectedLayoutId,
        showTemplateModal,
        templateSelected,
        subdomainAvailable,
        checkingSubdomain,
        loading,
        isNew,
      },
      setName,
      setSubdomain,
      setDescription,
      setSelectedLayout,
      setShowTemplateModal,
      setTemplateSelected,
      setSubdomainAvailable,
      setCheckingSubdomain,
      setLoading,
      resetForm,
    }),
    [
      id,
      name,
      subdomain,
      description,
      selectedLayoutId,
      showTemplateModal,
      templateSelected,
      subdomainAvailable,
      checkingSubdomain,
      loading,
      isNew,
    ]
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

// Generic hook for when you don't care about new vs existing
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
