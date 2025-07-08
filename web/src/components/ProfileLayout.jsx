import { useNavigate } from "react-router";
import NimbleGlowLogo from "./NimbleGlowLogo.jsx";
import authStore from "../stores/authStore.js";
import { LogOut } from 'lucide-react'

function ProfileLayout({ children, title }) {
  const navigate = useNavigate();
  const actionLogout = authStore((state) => state.actionLogout);
  const defaultImage = "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_2_vlg6tn.jpg"

  const handleLogout = () => {
    actionLogout();
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr2">

      <div className="relative hidden lg:block">
        <img
          src={defaultImage}
          alt="Skincare products background"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>


      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="w-full flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">{title}</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-800 text-white rounded-lg hover:bg-red-500 transition-colors font-semibold text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
export default ProfileLayout