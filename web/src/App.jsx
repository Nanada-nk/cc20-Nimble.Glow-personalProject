import { Slide, ToastContainer } from "react-toastify"
import AppRouter from "./router/AppRouter.jsx"
import authStore from "./stores/authStore.js";
import { useEffect } from "react";


function App() {
  const checkAuth = authStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        transition={Slide}
      />
    </>
  )
}
export default App