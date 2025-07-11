/** @format */

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import reviewsApi from "../../api/reviewsApi.js";
import ReviewCard from "../../components/ReviewCard.jsx";
import { BubblesIcon } from "lucide-react";

function UserReviewHistoryPage({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const resp = await reviewsApi.getByProduct(productId);
      setReviews(resp.data.reviews || []);
    } catch (error) {
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="bg-white p-8 rounded-b-lg rounded-tr-lg shadow-lg">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <BubblesIcon className="w-8 h-8 animate-spin text-pri-gr1" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No reviews for this product yet.
        </p>
      )}
    </div>
  );
}

export default UserReviewHistoryPage;
