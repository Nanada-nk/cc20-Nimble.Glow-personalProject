import { Link } from "react-router"

function FeaturedProduct() {
  return (
    <section className="bg-pri-gr1 text-white">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-lg font-semibold">Nimble.Glow</h3>
          <h2 className="text-4xl font-bold mt-2">Brightening Pineapple Body Lotion</h2>
          <p className="m-4 text-gray-200">
            Discover Nimble.Glow Brightening Pineapple Body Lotion, body lotion with pineapple enzyme extract nourishes
            the skin to look brighter and smoother. It also helps increase moisture and strengthens the skin barrier to
            keep the skin moist for a long time.
          </p>
          <Link to="/product/pineapple-lotion">
            <button className="mt-6 bg-white text-pri-gr1 font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751865149/%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A0%E0%B8%B2%E0%B8%9E_%E0%B9%81%E0%B8%9A%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C_Nimble_Glow_%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99_Brightening_Pineapple_Body_Lotion_raz3ie.jpg"
            alt="Brightening Pineapple Body Lotion"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedProduct
