import { useState, useEffect } from 'react';
import categoriesApi from "../../api/categoriesApi.js"
import { BubblesIcon } from 'lucide-react';
import { Link } from 'react-router';

function CategorySection() {

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const resp = await categoriesApi.getAll();
      setCategories(resp.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <BubblesIcon className="w-12 h-12 animate-spin text-pri-gr1" />
      </div>
    );
  }

  return (
    <section id="categories" className="py-12 min-[1920px]:py-20 bg-bg-cr4 ">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 duration-1000">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center hover:animate-pulse">
              <Link to={`/categories?categoryName=${encodeURIComponent(category.name)}`}>
                <div className="w-50 h-80 rounded-br-4xl rounded-md overflow-hidden shadow-md">
                  <img
                    src={category.products?.[0]?.images?.[0]?.url || "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 font-semibold text-gray-700">{category.name}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
