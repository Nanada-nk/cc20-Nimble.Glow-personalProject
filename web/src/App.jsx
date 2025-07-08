import { Slide, ToastContainer } from "react-toastify"
import AppRouter from "./router/AppRouter"
import authStore from "./stores/authStore";
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