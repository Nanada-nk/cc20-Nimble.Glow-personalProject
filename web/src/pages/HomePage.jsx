import Footer from "../layouts/Footer"
import CategorySection from "./home/CategorySection.jsx"
import FeaturedProduct from "./home/FeaturedProduct.jsx"
import HeroSection from "./home/HeroSection.jsx"
import ProductList from "./home/ProductList.jsx"




function HomePage() {
  return (
    <div className="bg-pri-wh">
     
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProduct />
        <ProductList />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
