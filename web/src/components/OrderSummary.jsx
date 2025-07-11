function OrderSummary({ order }) {
  if (!order) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-2">
      <p>
        <strong>Order #:</strong> {order.orderNumber}
      </p>
      <p>
        <strong>Order Status:</strong>{' '}
        <span className="font-semibold">
          {order.orderStatus.replace('_', ' ')}
        </span>
      </p>
      <p>
        <strong>Shipping to:</strong>{' '}
        {order.shipping?.address?.address || 'N/A'}
      </p>
      <p>
        <strong>Tracking #:</strong>{' '}
        {order.shipping?.trackingNumber || 'Awaiting tracking information'}
      </p>
      <p>
        <strong>Payment Status:</strong>{' '}
        <span className="font-semibold">
          {order.payment?.status || 'N/A'}
        </span>
      </p>
    </div>
  );
}

export default OrderSummary;