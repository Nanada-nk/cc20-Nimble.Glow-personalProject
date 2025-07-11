import { Outlet } from "react-router"
import Header from "./Header.jsx"
import CartDrawer from "../components/CartDrawer.jsx"


function MainLayout() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main>
        <Outlet />
      </main>

    </>
  )
}
export default MainLayout