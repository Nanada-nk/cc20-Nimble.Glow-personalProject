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
import OrderSummary from "../../components/OrderSummary.jsx";
import OrderItemList from "../../components/OrderItemList.jsx";
import ViewReviewModal from "../../components/ViewReviewModal.jsx"

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = authStore((state) => state.token);
  const fileInputRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  
  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const [viewingReview, setViewingReview] = useState(null);

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

  const handleOpenWriteReviewModal = (item) => {
    setReviewingItem(item);
    reset({ rating: 0, comment: "" });
    setReviewImages([]);
    setReviewImagePreviews([]);
    setIsWriteReviewModalOpen(true);
  };
  console.log('handleOpenWriteReviewModal', handleOpenWriteReviewModal)

  const handleCloseWriteReviewModal = () => setIsWriteReviewModalOpen(false);
  console.log('handleCloseWriteReviewModal', handleCloseWriteReviewModal)

  const handleOpenViewReviewModal = (item) => {
    setViewingReview({
      ...item.review,
      productTitle: item.product.title,
    });
    setIsViewReviewModalOpen(true);
  };
  console.log('handleOpenViewReviewModal', handleOpenViewReviewModal)

  const handleCloseViewReviewModal = () => setIsViewReviewModalOpen(false)
  console.log('handleCloseViewReviewModal', handleCloseViewReviewModal)

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
    console.log('indexToRemove', indexToRemove)
    setReviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setReviewImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };
  console.log('handleRemoveReviewImage', handleRemoveReviewImage)

  const onReviewSubmit = async (data) => {
     if (!reviewingItem) return
    try {
      const formData = new FormData();
      console.log("formData", formData);
      formData.append("rating", data.rating);
      formData.append("comment", data.comment || "");
      reviewImages.forEach((file) => formData.append("images", file));

      const createReviewsApi = await reviewsApi.create(
        reviewingItem.id,
        formData,
        token
      );
      console.log("createReviewsApi", createReviewsApi);
      toast.success(`Review for ${reviewingItem.product.title} submitted!`);
      handleCloseWriteReviewModal();
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
      </div>
    );
  }





  return (
    <>
      <div className="container mx-auto p-4 md:p-8 min-h-240">
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>

        <OrderSummary order={order} />

        <OrderItemList
          order={order}
          onOpenWriteReview={handleOpenWriteReviewModal}
          onOpenViewReview={handleOpenViewReviewModal}
        />

      </div>

      <ViewReviewModal
        isOpen={isViewReviewModalOpen}
        onClose={handleCloseViewReviewModal}
        reviewData={viewingReview}
        productTitle={viewingReview?.productTitle}
      />

      <Modal
        isOpen={isWriteReviewModalOpen}
        onClose={handleCloseWriteReviewModal}
        onConfirm={handleSubmit(onReviewSubmit)}
        title={`Reviewing: ${reviewingItem?.product.title}`}
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
