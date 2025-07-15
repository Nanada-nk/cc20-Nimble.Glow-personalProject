import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import productsApi from "../api/productsApi.js"
import authStore from "./authStore.js";

const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      isLoading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
      },
      isLoading: false,

      fetchProducts: async (params = {}) => {
        set({ isLoading: true });
        try {
          const resp = await productsApi.getAll(params);
          set({
            products: resp.data.products || [],
            pagination: {
              currentPage: resp.data.currentPage,
              totalPages: resp.data.totalPages,
              totalProducts: resp.data.totalProducts,
            },
            isLoading: false,
          });
        } catch (err) {
          // const errorMessage = err.response?.data?.message || "Failed to load products.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      actionCreateProduct: async (formData) => {
        const token = authStore.getState().token;
        try {
          await productsApi.create(formData, token);
          toast.success("Product created successfully!");
          await get().fetchProducts();
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to create product.";
          toast.error(errorMessage);
          throw err;
        }
      },

      actionUpdateProduct: async (id, formData) => {
        const token = authStore.getState().token;
        try {
          await productsApi.updateProduct(id, formData, token);
          toast.success("Product updated successfully!");
          await get().fetchProducts();
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to update product.";
          toast.error(errorMessage);
          throw err;
        }
      },

      actionDeleteProduct: async (id) => {
        const token = authStore.getState().token;
        try {
          await productsApi.deleteProduct(id, token);
          toast.success("Product deleted successfully!");
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to delete product.";
          toast.error(errorMessage);
          throw err;
        }
      },
    }),
    {
      name: "product-storage",
      partialize: (state) => ({}),
    }
  )
);

export default useProductStore;