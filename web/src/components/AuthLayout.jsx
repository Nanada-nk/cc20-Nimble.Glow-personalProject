import NimbleGlowLogo from "../components/NimbleGlowLogo.jsx"

function AuthLayout({ children }) {
  const defaultImage ="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_lbralc.jpg"
    return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr3">
     
      <div className="relative hidden lg:block">
        <img
          src={defaultImage}
          alt="Nimble.Glow background"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>

      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
export default AuthLayout