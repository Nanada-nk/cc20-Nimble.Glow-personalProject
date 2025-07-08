import { ArrowDown } from "lucide-react"
import { Link } from "react-router"

function HeroSection() {
  return (

    <section className="grid h-1/2">
      <img
        src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751978597/head2_xbgrx0.png"
        alt="Nimble.Glow hero background"
        className="w-full h-full object-left object-cover col-start-1 row-start-1 duration-1000"
      />

      <div className="flex h-full w-full items-center justify-end text-center md:text-left col-start-2 row-start-1 bg-gradient-to-b from-[#f8e8da] to-[#efdfd4] duration-1000">
        <div className="max-w-[200px]  sm:max-w-2xl p-8 md:p-0 md:mr-10 lg:mr-20 xl:mr-40 duration-1000">
          <h1 className="font-bold text-pri-gr1 drop-shadow-sm text-sm sm:text-lg md:text-2xl lg:text-5xl font-serif duration-1000">
            Be Confident In Yourself.
          </h1>
          <p className="mt-4  text-gray-800 drop-shadow-sm text-sm sm:text-lg md:text-xl duration-1000">
            #มั่นใจในความเป็นตัวเอง
          </p>
          <Link to="/login" className="mt-4 md:mt-6 inline-block duration-1000">
            <button className="rounded-lg bg-pri-gr1 px-5 py-2 md:px-10 md:py-3 font-bold text-white shadow-md transition-transform hover:scale-105 duration-700">
              Shop now
            </button>
          </Link>
        </div>
      </div>

      <a
        href="#categories" 
        className="hidden min-[1920px]:flex absolute bottom-5 right-4 z-20 w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm items-center justify-center cursor-pointer hover:bg-white/75 transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6 text-pri-gr1" />
      </a>

    </section>
  )
}

export default HeroSection
