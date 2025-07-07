import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authApi from "../api/authApi.js";

const authStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      actionRegister: async (registerData) => {
        try {
          const response = await authApi.register(registerData);
          return response;
        } catch (error) {
          throw error;
        }
      },

      actionLogin: async (loginData) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login(loginData);
          const { accessToken } = response.data;
          set({ token: accessToken, user: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      actionLogout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);

export default authStore;