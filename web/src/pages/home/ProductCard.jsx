import { Link, useNavigate } from "react-router";
import { toast } from 'react-toastify';
import authStore from "../../stores/authStore.js";
import useCartStore from "../../stores/cartStore.js";

function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.url || "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png";
  const token = authStore((state) => state.token);
  const addItemToCartStore = useCartStore((state) => state.addItem);
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.preventDefault();
  

    if (!token) {
        toast.error("Please login to add items to your cart.");
        navigate("/login")
        return;
    }
    
   
    addItemToCartStore({ productId: product.id, count: 1 });
  };

  return (
    <div className="bg-white w-full xl:w-80 rounded-lg shadow-md overflow-hidden group text-center p-4 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-1000">
      <div>
        <Link to={`/products/${product.id}`}>
          <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
            <img 
              src={imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          </div>
          <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-pri-gr1">{product.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 h-10 overflow-hidden mt-1">{product.description}</p>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-gray-700 mb-2">{product.price.toFixed(2)} THB</p>
        
        <div className="flex items-center justify-center gap-2">
            <Link to={`/products/${product.id}`} className="flex-1">
                <button className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm">
                    Details
                </button>
            </Link>

            <button 
                onClick={handleAddToCart}
                className="flex-1 bg-pri-gr1 text-white font-bold py-2  rounded-md hover:bg-[#5a6e47] transition-colors text-sm"
            >
                Add to Cart
            </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

