const categories = [
  { name: "Essential series", img: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751864221/A_photorealistic_image_of_a_tube_of_Nimble_Glow_Super-Light_Sunscreen_Biome_Balance_sunscreen._The_tube_is_predominantly_fffdf4_with_the_brand_name_and_product_description_in_a_bold_bright_orange_Quiche_Sans_f_itxmdh.jpg" },
  { name: "Supplement Series", img: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751864238/%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A0%E0%B8%B2%E0%B8%9E_%E0%B9%81%E0%B8%9A%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C_Nimble_Glow_%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99_Brightening_Booster_Serum_%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B9%81%E0%B8%94%E0%B8%94_ytd1oe.jpg" },
  { name: "Lip Series", img: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751804781/nimble-glow-products/juwaybciid6bwmbjf4dc.jpg" },
  { name: "Body Series", img: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751804872/nimble-glow-products/wmhrcddya7m2ftngvdzy.jpg" },
]

function CategorySection() {
  return (
    <section className="py-12 bg-bg-cr4">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop By Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 duration-1000">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center hover:animate-pulse">
              <div className="w-50 h-80 rounded-br-4xl rounded-md overflow-hidden shadow-md">
                <img
                  src={category.img || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 font-semibold text-gray-700">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
