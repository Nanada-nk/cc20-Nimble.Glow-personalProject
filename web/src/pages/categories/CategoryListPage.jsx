
import { useState, useEffect } from 'react';
import categoriesApi from "../../api/categoriesApi.js"
import { BubblesIcon } from 'lucide-react';
import Footer from "../../layouts/Footer.jsx"
import ProductListPage from "../../pages/products/ProductListPage.jsx";

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const categoryName = urlParams.get('categoryName');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const resp = await categoriesApi.getAll();
      const returnData = resp.data.categories
      setCategories(returnData);
      if (categoryName !== null) {
        const filterCategory = returnData.filter((category) => category.name === categoryName)
        setSelectedCategory(filterCategory[0]);
      } else {
        setSelectedCategory(returnData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log('categoryName', categoryName);
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <BubblesIcon className="w-12 h-12 animate-spin text-pri-gr1" />
      </div>
    );
  }

  return (
    <section className="pt-12 bg-bg-cr3">
      <div className="container mx-auto  px-4 text-center min-h-220">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`btn ${selectedCategory?.id === category.id ? 'btn-primary' : 'btn-ghost'}`}
              >
                {category.name}
              </button>)
          }
          )}
        </div>
        {selectedCategory && <ProductListPage selectedCategory={selectedCategory} />}
      </div>
      <Footer />

    </section >




  );
}

export default CategoryListPage