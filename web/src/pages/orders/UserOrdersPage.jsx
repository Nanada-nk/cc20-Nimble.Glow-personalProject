import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { BubblesIcon } from 'lucide-react';


import authStore from '../../stores/authStore.js';
import ordersApi from '../../api/ordersApi.js';
import Footer from '../../layouts/Footer.jsx';

function UserOrdersPage() {
  const navigate = useNavigate();
  const token = authStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserOrders = async () => {
    if (!token) {
      toast.error("Please login to view your orders.");
      navigate('/login');
      return;
    }
    try {
      setIsLoading(true);
      const response = await ordersApi.getUserOrders(token);
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error("Failed to load your orders.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><BubblesIcon className="w-12 h-12 animate-spin" /></div>
  }

  return (
    <>

      <div className="container mx-auto min-h-230 px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="font-bold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm">Total: <span className="font-semibold">{order.cartTotal.toFixed(2)} THB</span></p>
                  <p className="text-sm">Status: <span className="font-semibold">{order.orderStatus.replace('_', ' ')}</span></p>
                  <p className="text-sm text-gray-500 mt-1">
                    Shipping to: <span className="font-medium text-gray-700">{order.shipping?.address?.address || 'N/A'}</span>
                  </p>
                </div>
                <div>

                  {order.orderStatus === 'PENDING_PAYMENT' || order.orderStatus === 'NOT_PROCESSED' ? (
                    <Link to={`/checkout/${order.id}`} className="btn btn-primary btn-sm">
                      Pay Now
                    </Link>
                  ) : (
                    <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserOrdersPage;