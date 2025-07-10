
import { useState, useEffect } from 'react';
import productsApi from '../../api/productsApi.js';
import ProductCard from '../home/ProductCard.jsx';
import { BubblesIcon } from 'lucide-react';


function ProductListPage({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const fetchProductsAndCategories = async () => {

    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      const params = { categoryId: selectedCategory.id, limit: 20 };
      const resp = await productsApi.getAll(params);
      setProducts(resp.data.products);
    } catch (error) {
      console.error(`Failed to fetch products for category ${selectedCategory.id}:`, error);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchProductsAndCategories();
  }, [selectedCategory])



  return (
    <section className="pb-12 bg-bg-cr3">
      <div className="container mx-auto px-4">
        <div className="divider text-2xl font-bold text-pri-gr1 my-8">{selectedCategory.name}</div>


        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter((product) => product.category.name === selectedCategory.name).map((product) => {
              return (
                <ProductCard key={product.id} product={product} />
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-16">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  )
}
export default ProductListPage
