function OrderItem({ item, orderStatus, onOpenWriteReview, onOpenViewReview }) {
  const { product, count, price } = item;
  const userReview = item.review
  console.log('userReview', userReview)

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4">
      <div className="flex items-center">
        <img
          src={product.images?.[0]?.url || "https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png"}
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
        {userReview ? (
          <button
            onClick={() => onOpenViewReview(item)}
            className="btn btn-outline btn-success btn-sm">
            View Your Review
          </button>
        ) : (
          (orderStatus === "DELIVERED" || orderStatus === "COMPLETED") && (
            <button
              onClick={() => onOpenWriteReview(item)}
              className="btn btn-outline btn-primary btn-sm">
              Write a Review
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default OrderItem