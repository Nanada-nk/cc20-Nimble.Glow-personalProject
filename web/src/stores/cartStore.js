import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import cartApi from "../api/cartApi.js"
import authStore from "./authStore.js";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      cartTotal: 0,
      isLoading: false,
      isCartOpen: false,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      fetchCart: async () => {
        const token = authStore.getState().token;
        if (!token) {
          get().clearCart();
          return;
        }
        set({ isLoading: true });
        try {
          const resp = await cartApi.getCart(token);
          const cartData = resp.data.cart;
          if (cartData) {
            const count = cartData.products.reduce((sum, item) => sum + item.count, 0);
            set({ items: cartData.products, itemCount: count, cartTotal: cartData.cartTotal });
          } else {
            set({ items: [], itemCount: 0, cartTotal: 0 });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      actionAddItem: async (productData) => {
        const token = authStore.getState().token;
        if (!token) return toast.error("Please login to add items to cart.");
        
        try {
          await cartApi.addItemToCart(productData, token);
          toast.success("Item added to cart!");
          await get().fetchCart(); 
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to add item.");
          throw error;
        }
      },

      actionRemoveItem: async (cartItemId) => {
        const token = authStore.getState().token;
        if (!token) return;
        try {
          await cartApi.removeItem(cartItemId, token);
          toast.success("Item removed from cart.");
          await get().fetchCart();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to remove item.");
          throw error;
        }
      },
      
      clearCart: () => set({ items: [], itemCount: 0, cartTotal: 0 ,isCartOpen: false }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({}),
    }
  )
);

export default useCartStore;