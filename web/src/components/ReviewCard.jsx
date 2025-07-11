/** @format */

import Rating from "./Rating.jsx";

function ReviewCard({ review }) {
  const profileImageUrl =
    review.user?.profileImage ||
    "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752042093/user-alt-1-svgrepo-com_i9clsu.png";
  return (
    <div className="border-t border-gray-200 py-4">
      <div className="flex items-start mb-2">
        
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-4">
          <img
            src={profileImageUrl}
            alt={review.user?.firstName || "User"}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                {review.user?.firstName || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">{review.reviewDate}</p>
            </div>
           
            <Rating rating={review.rating} />
          </div>
          <p className="text-gray-600 mt-2">{review.comment}</p>
        </div>
      </div>

     
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-2 pl-14">
          {review.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="Review image"
              className="w-20 h-20 object-cover rounded-md border"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
