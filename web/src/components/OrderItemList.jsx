import OrderItem from "./OrderItem.jsx";



function OrderItemList({ order, onOpenWriteReview, onOpenViewReview }) {
  if (!order?.products) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Items in this order</h2>
      <div className="space-y-4">
        {order.products.map((item) => ( 
          <OrderItem
            key={item.id}
            item={item} 
            orderStatus={order.orderStatus}
            onOpenWriteReview={onOpenWriteReview}
            onOpenViewReview={onOpenViewReview}
          />
        ))}
      </div>


      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{order.cartTotal.toFixed(2)} THB</span>
        </div>


        {order.orderDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>- {order.orderDiscount.toFixed(2)} THB</span>
          </div>
        )}


        <div className="flex justify-between font-bold text-xl mt-2">
          <span>TOTAL</span>
          <span className='text-pri-gr1'>{order.payment?.amount.toFixed(2)} THB</span>
        </div>
      </div>



    </div>
  );
}

export default OrderItemList;