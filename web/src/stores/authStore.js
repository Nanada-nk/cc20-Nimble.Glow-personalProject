import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import authApi from "../api/authApi.js";

const authStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isLoggedIn: false,


      setAuthUser: (user) => {
        // console.log("setAuthUser: Updating user state.", user);
        set({ user: user, isLoggedIn: !!user });
      },


      checkAuth: async () => {
        // console.log("1. checkAuth action STARTING...")
        const currentToken = get().token;
        // console.log("2. Token from store is:", currentToken);

        if (currentToken) {
          try {
            const resp = await authApi.getMe(currentToken);
            // console.log("3. getMe API call SUCCEEDED.");
            set({ user: resp.data.user, isLoggedIn: true, isLoading: false });
          } catch (error) {
            // console.error("4. getMe API call FAILED.", error);
            set({ user: null, token: null, isLoggedIn: false, isLoading: false })
          }
        } else {
          set({ isLoading: false });
        }
      },
      actionRegister: async (registerData) => {
        try {
          const response = await authApi.register(registerData);
          return response;
        } catch (error) {
          next(error);
        }
      },

      actionLogin: async (loginData) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login(loginData);
          const { accessToken, user } = response.data;
          // console.log("actionLogin: Login successful, accessToken =", accessToken, "user =", user)
          set({ token: accessToken, user: user, isLoggedIn: true, isLoading: false });
          return response
        } catch (error) {
          // console.error("actionLogin: Login failed, error =", error)
          set({ isLoading: false });
          next(error);
        }
      },

      actionLogout: () => {
        // console.log("actionLogout: Logging out user.");
        // console.trace("Call stack:")
        
        set({ user: null, token: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default authStore;