function OrderItem({ product, count, price, orderStatus, onOpenWriteReview, onOpenViewReview }) {
  const userReview = product.reviews?.[0];

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4">
      <div className="flex items-center">
        <img
          src={product.images?.[0]?.url || "https://...default-image.png"}
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
            onClick={() => onOpenViewReview(product)}
            className="btn btn-outline btn-success btn-sm">
            View Your Review
          </button>
        ) : (
          (orderStatus === "DELIVERED" || orderStatus === "COMPLETED") && (
            <button
              onClick={() => onOpenWriteReview({ productId: product.id, product })}
              className="btn btn-outline btn-primary btn-sm">
              Write a Review
            </button>
          )
        )}
      </div>
    </div>
  );
}

function OrderItemList({ order, onOpenWriteReview, onOpenViewReview }) {
  if (!order?.products) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Items in this order</h2>
      <div className="space-y-4">
        {order.products.map(({ product, count, price }) => (
          <OrderItem
            key={product.id}
            product={product}
            count={count}
            price={price}
            orderStatus={order.orderStatus}
            onOpenWriteReview={onOpenWriteReview}
            onOpenViewReview={onOpenViewReview}
          />
        ))}
      </div>
      <div className="text-right mt-4 text-xl font-bold">
        Total: {order.cartTotal.toFixed(2)} THB
      </div>
    </div>
  );
}

export default OrderItemList;