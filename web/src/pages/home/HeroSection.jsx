import { Link } from "react-router"

function HeroSection() {
  return (
    
    <section
      className="relative h-[25vh] bg-cover bg-center text-white md:h-[65vh]"
      style={{
        backgroundImage: `
          url('https://res.cloudinary.com/dhoyopcr7/image/upload/v1751857640/head_zcmzhq.png')
        `,
      }}
    >
    
      <div className="relative z-10 flex h-full items-center justify-end ">
       
        <div className="max-w-2xl text-center md:text-left lg:mr-5 xl:mr-50 2xl:mr-100 duration-1000">
          <h1 className="text-xl font-bold text-pri-gr1 drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl font-serif duration-1000">
            Be Confident In Yourself.
          </h1>
          <p className="mt-3 text-md text-gray-800 drop-shadow-sm sm:text-lg md:text-xl duration-1000">#มั่นใจในความเป็นตัวเอง</p>
          <Link to="/login" className="mt-6 inline-block">
            <button className="rounded-lg bg-pri-gr1 px-10 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">
              Shop now
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
