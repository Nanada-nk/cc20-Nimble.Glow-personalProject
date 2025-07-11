/** @format */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Footer from "../../layouts/Footer.jsx";
import authStore from "../../stores/authStore.js";
import ordersApi from "../../api/ordersApi.js";
import reviewsApi from "../../api/reviewsApi.js";
import { reviewSchema } from "../../validator/schema.js";
import { BubblesIcon, UploadCloudIcon, XIcon } from "lucide-react";
import Modal from "../../components/Modal.jsx";
import RatingInput from "../../components/RatingInput";

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = authStore((state) => state.token);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(reviewSchema),
  });

  const fetchOrderDetails = async () => {
    if (!token || !orderId) return;
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrderById(orderId, token);
      console.log("response", response);
      setOrder(response.data.order);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to load order details.");
      navigate("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('fetchOrderDetails', fetchOrderDetails)
    fetchOrderDetails();
  }, []);

  const handleOpenReviewModal = (product) => {
    setReviewingProduct(product);
    reset({ rating: 0, comment: "" });
    setReviewImages([]);
    setReviewImagePreviews([]);
    setIsReviewModalOpen(true);
  };
  console.log('handleOpenReviewModal', handleOpenReviewModal)
  const handleCloseReviewModal = () => setIsReviewModalOpen(false);
  console.log('handleCloseReviewModal', handleCloseReviewModal)
  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - reviewImages.length);
    console.log("files", files);
    if (files.length > 0) {
      setReviewImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      console.log("newPreviews", newPreviews);
      setReviewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  console.log('handleReviewImageChange', handleReviewImageChange)

  const handleRemoveReviewImage = (indexToRemove) => {
    setReviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setReviewImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  console.log('handleRemoveReviewImage', handleRemoveReviewImage)
  const onReviewSubmit = async (data) => {
    try {
      const formData = new FormData();
      console.log("formData", formData);
      formData.append("rating", data.rating);
      formData.append("comment", data.comment || "");
      reviewImages.forEach((file) => formData.append("images", file));

      const createReviewsApi = await reviewsApi.create(
        reviewingProduct.productId,
        formData,
        token
      );
      console.log("createReviewsApi", createReviewsApi);
      toast.success(`Review for ${reviewingProduct.product.title} submitted!`);
      handleCloseReviewModal();
      fetchOrderDetails();
    } catch (err) {
      console.log("err", err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    }
  };
  console.log('onReviewSubmit', onReviewSubmit)
  if (isLoading || !order) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <BubblesIcon className="w-12 h-12 animate-spin text-pri-gr1" />
        <div className="text-center text-red-500"><p>Order not found.</p></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 min-h-230">
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-2">
          <p>
            <strong>Order #:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Order Status:</strong>{" "}
            <span className="font-semibold">
              {order.orderStatus.replace("_", " ")}
            </span>
          </p>
          <p>
            <strong>Shipping to:</strong>{" "}
            {order.shipping?.address?.address || "N/A"}
          </p>
          <p>
            <strong>Shipping Method:</strong>{" "}
            {order.shipping?.method || "N/A"}
          </p>
          <p>
            <strong>Tracking #:</strong>{" "}
            {order.shipping?.trackingNumber || "Awaiting tracking information"}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span className="font-semibold">
              {order.payment?.status || "N/A"}
            </span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Items in this order</h2>
          <div className="space-y-4">
            {order.products.map(({ product, count, price }) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4">
                <div className="flex items-center">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png"
                    }
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-bold">{product.title}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {count} @ {price.toFixed(2)} THB
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  {(order.orderStatus === "DELIVERED" ||
                    order.orderStatus === "COMPLETED") && (
                      <button
                        onClick={() =>
                          handleOpenReviewModal({
                            productId: product.id,
                            product,
                          })
                        }
                        className="btn btn-outline btn-primary btn-sm">
                        Write a Review
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-4 text-xl font-bold">
            Total: {order.cartTotal.toFixed(2)} THB
          </div>
        </div>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onConfirm={handleSubmit(onReviewSubmit)}
        title={`Reviewing: ${reviewingProduct?.product.title}`}
        confirmText={isSubmitting ? "Submitting..." : "Submit Review"}
        isConfirmDisabled={isSubmitting}>
        <div className="space-y-4">
          <RatingInput name="rating" control={control} />
          {errors.rating && (
            <p className="text-red-500 text-xs">{errors.rating.message}</p>
          )}

          <textarea
            {...register("comment")}
            className="textarea textarea-bordered w-full"
            placeholder="Share your happiness about this product..."></textarea>

          <div className="mt-4">
            <label className="label">
              <span className="label-text">Add Photos</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {reviewImagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReviewImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-700">
                    <XIcon size={12} />
                  </button>
                </div>
              ))}
              {reviewImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50">
                  <UploadCloudIcon size={24} />
                  <span className="text-xs mt-1">Add Images</span>
                </button>
              )}
            </div>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleReviewImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </Modal>
      <Footer />
    </>
  );
}

export default OrderDetailPage;
