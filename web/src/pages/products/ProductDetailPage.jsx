/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import productsApi from "../../api/productsApi.js";
import useCartStore from "../../stores/cartStore.js";
import { BubblesIcon, CheckCircle, Truck, Info } from "lucide-react";
import Footer from "../../layouts/Footer.jsx";
import UserReviewHistoryPage from "../reviews/UserReviewHistoryPage.jsx";
import authStore from "../../stores/authStore.js";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate()
  const user = authStore((state) => state.user)
  const actionAddItem = useCartStore((state) => state.actionAddItem)
  const isLoggedIn = useCartStore((state) => state.isLoggedIn)

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity", 1);
  const totalPrice = (product?.price * quantity).toFixed(2);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const resp = await productsApi.getById(id);
      const fetchedProduct = resp.data.product;
      setProduct(fetchedProduct);

      if (fetchedProduct.images && fetchedProduct.images.length > 0) {
        setMainImage(fetchedProduct.images[0].url);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Could not load product details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const onAddToCartSubmit = async (data) => {

    if (!isLoggedIn || !user) {
      navigate("/login")
      toast.error("Please login to add items to your cart.");
      return;
    }
    if (user.role !== 'CUSTOMER') {
      toast.info("Only customers can add items to the cart.");
      return;
    }
    await actionAddItem({ productId: product.id, count: Number(data.quantity) });
  };

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BubblesIcon className="w-12 h-12 animate-spin text-pri-gr1" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-bg-cr3 min-h-230">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            <div className="flex flex-col gap-4">
              <div className="aspect-square bg-white rounded-lg shadow-lg shadow-pri-ic overflow-hidden">
                <img
                  src={mainImage || "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === image.url
                      ? "border-pri-gr1"
                      : "border-transparent"
                      }`}
                    onClick={() => setMainImage(image.url)}>
                    <img
                      src={image.url}
                      alt={`Thumbnail ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">
                {product.category?.name || "Uncategorized"}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-pri-gr1 font-serif my-2">
                {product.title}
              </h1>
              <p className="text-3xl text-gray-800 font-semibold my-2">
                {product.price.toFixed(2)} THB
              </p>

              <div
                className={`badge py-4 ${product.stockQuantity > 0 ? "badge-success" : "badge-error"
                  } text-white my-2`}>
                {product.stockQuantity > 0
                  ? `In Stock: ${product.stockQuantity}`
                  : "Out of Stock"}
              </div>

              <div className="divider"></div>

              <form
                onSubmit={handleSubmit(onAddToCartSubmit)}
                className="flex items-center gap-4 my-6">
                <input
                  type="number"
                  {...register("quantity", { valueAsNumber: true, min: 1 })}
                  className="input input-bordered w-24"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-circle bg-pri-gr1 text-white text-lg border-none hover:bg-[#5a6e47] flex-grow">
                  {isSubmitting
                    ? "Adding..."
                    : `Add to Cart  |  ${totalPrice} THB`}
                </button>
              </form>

              <div className="divider"></div>

              <div className="space-y-3 text-sm text-gray-600 mt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span>Free Shipping on all orders.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-green-500" />
                  <span>Order before 11:00 AM for same day dispatch.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Info size={20} className="text-blue-500" />
                  <span>Support & ordering open 7 days a week.</span>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-16">
            <div className="tabs tabs-lifted">
              <a
                className={`tab ${activeTab === "description" ? "tab-active" : ""
                  }`}
                onClick={() => setActiveTab("description")}>
                Description
              </a>
              <a
                className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("reviews")}>
                Reviews ({product.reviews.length})
              </a>
            </div>

            {activeTab === "description" && (
              <div className="bg-white p-8 rounded-b-lg rounded-tr-lg shadow-lg">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <UserReviewHistoryPage productId={product.id} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetailPage;
