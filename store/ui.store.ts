import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * UI Store
 * Global UI state management
 */

interface UIState {
  isSidebarOpen: boolean;
  isLoading: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // State
      isSidebarOpen: false,
      isLoading: false,

      // Actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "ui-store" }
  )
);
