import { Link, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import useCartStore from '../stores/cartStore.js';
import authStore from '../stores/authStore.js';
import { toast } from 'react-toastify';
import ordersApi from '../api/ordersApi.js';
import { useEffect, useState } from 'react';
import authApi from '../api/authApi.js';

function CartDrawer() {
  const items = useCartStore((state) => state.items)
  const cartTotal = useCartStore((state) => state.cartTotal)
  const itemCount = useCartStore((state) => state.itemCount)
  const isCartOpen = useCartStore((state) => state.isCartOpen)
  const toggleCart = useCartStore((state) => state.toggleCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const actionRemoveItem = useCartStore((state) => state.actionRemoveItem)
  const actionAddItem = useCartStore((state) => state.actionAddItem)
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();
  const token = authStore((state) => state.token);

  const fetchAddresses = async () => {
    if (!token) return
    try {
      const resp = await authApi.getMe(token);
      console.log('resp', resp)
      const userAddresses = resp.data.user.addresses;
      console.log('userAddresses', userAddresses)
      setAddresses(userAddresses);
      if (userAddresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(userAddresses[0].id);
      }
    } catch (error) {
      console.log('error', error)
      toast.error("Could not load addresses.");
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      fetchAddresses();
    }
  }, [isCartOpen])


  const handleCheckout = async () => {
    if (items.length === 0) {
      return toast.warn("Your cart is empty.");
    }
    if (!selectedAddressId) {
      return toast.error("Please select a shipping address.");
    }
    try {
      const response = await ordersApi.createOrder({ addressId: selectedAddressId }, token);
      console.log('response', response)
      const newOrder = response.data.order;
      console.log('newOrder', newOrder)

      toast.success("Order created successfully!");
      toggleCart();
      clearCart();
      navigate(`/checkout/${newOrder.id}`);
    } catch (err) {
      console.log('err', err)
      toast.error(err.response?.data?.message || "Failed to create order.");
    }
  };

  if (!isCartOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleCart}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({itemCount})</h2>
          <button onClick={toggleCart} className="btn btn-ghost btn-sm btn-circle">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex-grow flex flex-col justify-center items-center text-gray-500 h-full">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.product.images?.[0]?.url} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <p className="font-semibold">{item.product.title}</p>
                  <p className="text-sm text-gray-500">{item.price.toFixed(2)} THB</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => actionRemoveItem(item.id)} className="btn btn-xs btn-outline">-</button>
                    <span>{item.count}</span>
                    <button onClick={() => actionAddItem({ productId: item.productId, count: 1 })} className="btn btn-xs btn-outline">+</button>
                  </div>
                </div>
                <p className="font-semibold">{(item.price * item.count).toFixed(2)} THB</p>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <div className='space-y-2 max-h-32 overflow-y-auto'>
              {addresses.map(address => (
                <div key={address.id} className="p-2 border rounded-lg flex items-center gap-4 text-sm cursor-pointer" onClick={() => setSelectedAddressId(address.id)}>
                  <input
                    type="radio"
                    name="shipping-address"
                    className="radio radio-primary radio-sm"
                    checked={selectedAddressId === address.id}
                    readOnly
                  />
                  <p>{address.address}</p>
                </div>
              ))}
            </div>
            <Link to="/profile/addresses" className="text-xs text-blue-600 hover:underline mt-2 inline-block">+ Add/Manage Addresses</Link>
          </div>
        )}

        <div className="p-4 border-t space-y-4 mt-auto">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{cartTotal.toFixed(2)} THB</span>
          </div>
          <button
            onClick={handleCheckout}
            className="btn btn-primary w-full bg-pri-gr1 border-none text-white"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div >
  );
}
export default CartDrawer

