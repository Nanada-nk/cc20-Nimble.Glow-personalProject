import { Link } from "react-router"


const NimbleGlowLogo = ({ className }) => (
  <Link to="/"  className={`flex items-center justify-center ${className}`}>
    <img
      src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854695/logo_bp3ha8.png"
      alt="Nimble.Glow Logo"
      width="250"
      height="43"
    />
  </Link>
)

function LoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr3">
      <div className="relative hidden lg:block">
        <img
          src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_lbralc.jpg"
          alt="Skincare products background"
          className="absolute w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo />
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#677e52]">Welcome Back</h1>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#677e52]">to Nimble.Glow !</h2>
          </div>
          <form className="bg-bg-cr4 p-8 rounded-3xl shadow-lg space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="font-bold text-gray-700">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                required
                className="block w-full px-3 py-2 bg-bg-cr2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677e52] placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="font-bold text-gray-700">
                Your Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                required
                className="block w-full px-3 py-2 bg-bg-cr border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677e52] placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#677e52] hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don't have an account ?{" "}
            <Link to="/register" className="font-bold text-[#677e52] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
