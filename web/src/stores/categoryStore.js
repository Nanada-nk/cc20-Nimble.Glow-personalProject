import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import categoriesApi from "../api/categoriesApi.js";

const useCategoryStore = create(
  persist(
    (set) => ({
      categories: [],
      isLoading: false,

      fetchCategories: async () => {
        set({ isLoading: true });
        try {
          const resp = await categoriesApi.getAll();
          set({ categories: resp.data.categories || [], isLoading: false });
        } catch (error) {
          toast.error("Failed to load categories.");
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "category-storage",
     
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);

export default useCategoryStore;