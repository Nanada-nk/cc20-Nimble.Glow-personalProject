import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "./ProductCard.jsx";
import productsApi from "../../api/productsApi.js";
import { BubblesIcon } from 'lucide-react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchProducts = async () => {
    setIsLoading(true);
    try {

      const resp = await productsApi.getAll({ limit: 4 });
      setProducts(resp.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products for homepage:", error);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-[#fcf5eb] ">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Products</h2>


        {isLoading ? (
          <div className="flex justify-center p-12">
            <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 duration-1000">

            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/categories" className="text-gray-600 hover:text-[#677e52] underline font-semibold">
            Click for more Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductList;



















// import { useState, useEffect } from "react"
// import ProductCard from "./ProductCard"
// import { Link } from "react-router"

// const mockProducts = [
//   {
//     id: 1,
//     title: "Green Tea Deep Repair Cream",
//     description: "Moisturizer post-face and replenishing moisture. Helps strengthen the skin barrier.",
//     price: 629,
//     images: [{ url: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751857640/head_zcmzhq.png" }],
//   },
//   {
//     id: 2,
//     title: "Super-Light Sunscreen + Biome Balance",
//     description: "Hybrid filters sunscreen, lightweight for sensitive skin.",
//     price: 570,
//     images: [{ url: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751857640/head_zcmzhq.png" }],
//   },
//   {
//     id: 3,
//     title: "Green Tea Calming Cream + Biome Balance",
//     description:
//       "A biome that helps slow down skin that soothes and strengthens the skin's protective barrier for a healthy glow.",
//     price: 620,
//     images: [{ url: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751857640/head_zcmzhq.png" }],
//   },
//   {
//     id: 4,
//     title: "Hydrating Gentle Cleanser + Biome Balance",
//     description: "Biome Balance facial cleanser for people with sensitive skin with gentle cream-foam.",
//     price: 790,
//     images: [{ url: "https://res.cloudinary.com/dhoyopcr7/image/upload/v1751857640/head_zcmzhq.png" }],
//   },
// ]

// function ProductList() {
//   const [products, setProducts] = useState([])

//   useEffect(() => {
//     setProducts(mockProducts)
//   }, [])

//   return (
//     <section className="py-12 bg-[#fcf5eb]">
//       <div className="container mx-auto px-4">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Products</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//         <div className="text-center mt-12">
//           <Link to="/products" className="text-gray-600 hover:text-[#677e52] underline">
//             Click for more Products
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default ProductList
