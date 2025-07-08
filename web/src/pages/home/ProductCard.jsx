import { Link } from "react-router"

function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0 ? product.images[0].url : "https://via.placeholder.com/300"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group text-center p-4 flex flex-col justify-between">
      <div>
        <img src={imageUrl || "../../assets/product.jpg"} alt={product.title} className="w-full h-48 object-cover mb-4" />
        <h3 className="font-bold text-lg text-gray-800 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 h-10 overflow-hidden">{product.description}</p>
      </div>

      <div className="mt-4">
        <p className="font-semibold text-gray-700">Price: {product.price} THB</p>

        <Link to={`/product/${product.id}`}>
          <button className="mt-2 w-full bg-[#677e52] text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
            Add to Cart
          </button>
        </Link>

      </div>
    </div>
  )
}

export default ProductCard
