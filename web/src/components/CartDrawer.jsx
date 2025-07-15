import { Link, useNavigate } from 'react-router';
import { X } from 'lucide-react';
import useCartStore from '../stores/cartStore.js';
import authStore from '../stores/authStore.js';
import { toast } from 'react-toastify';
import ordersApi from '../api/ordersApi.js';
import { useEffect, useState } from 'react';
import authApi from '../api/authApi.js';
import shippingApi from '../api/shippingApi.js';
import couponsApi from '../api/couponsApi.js';

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
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState('');
  const navigate = useNavigate();
  const token = authStore((state) => state.token);


const fetchData = async () => {
  if (!token) {
      console.log("fetchData stopped: No token available.");
      return;
    }

    // console.log("fetchData running with token:", token);

    try {
      const results = await Promise.allSettled([
        authApi.getMe(token),
        shippingApi.getMethods(token),
        couponsApi.getAvailableCoupons(token)
      ]);
      
      if (results[0].status === 'fulfilled') {
        const userAddresses = results[0].value.data.user.addresses;
        setAddresses(userAddresses);
        if (userAddresses.length > 0) setSelectedAddressId(userAddresses[0].id);
      } else { toast.error("Could not load addresses."); }

      if (results[1].status === 'fulfilled') {
        const methods = results[1].value.data.methods;
        setShippingMethods(methods);
        if (methods.length > 0) setSelectedShippingMethod(methods[0]);
      } else { toast.error("Could not load shipping methods."); }

      if (results[2].status === 'fulfilled') {
        setCoupons(results[2].value.data.coupons);
      }
      // console.log('Coupon API Result:', results[2])

    } catch (error) {
      console.error("A critical error occurred in fetchData:", error);
      toast.error("Could not load cart information.");
    }
}

  useEffect(() => {
    if (isCartOpen) {
      fetchData();
    }
  }, [isCartOpen])


  const handleCheckout = async () => {
    if (items.length === 0) return toast.warn("Your cart is empty.");
    if (!selectedAddressId) return toast.error("Please select a shipping address.");
    if (!selectedShippingMethod) return toast.error("Please select a shipping method.");

    try {
      const orderData = {
        addressId: selectedAddressId,
        shippingMethod: selectedShippingMethod,
        couponId: selectedCouponId || null,
      };
      // console.log('orderData', orderData)
      const response = await ordersApi.createOrder(orderData, token);
      // console.log('response', response)

      const newOrder = response.data.order;
      // console.log('newOrder', newOrder)

      toast.success("Order created successfully!");
      toggleCart();
      clearCart();
      navigate(`/checkout/${newOrder.id}`);
    } catch (err) {
      // console.log('err', err)
      toast.error(err.response?.data?.message || "Failed to create order.");
    }
  };
  // console.log('handleCheckout', handleCheckout)
  
  if (!isCartOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleCart}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-pri-wh shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-pri-gr1">
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
          <>
            <div className="p-4 border-t border-pri-gr1 space-y-4">

              <div>
                <h3 className="font-bold mb-2">Shipping Address</h3>
                <div className='space-y-2 max-h-28 overflow-y-auto'>
                  {addresses.map(address => (
                    <div key={address.id} className="p-2 border border-pri-gr1 rounded-lg flex items-center gap-4 text-sm cursor-pointer" onClick={() => setSelectedAddressId(address.id)}>
                      <input type="radio" name="shipping-address" className="radio radio-primary radio-sm" checked={selectedAddressId === address.id} readOnly />
                      <p>{address.address}</p>
                    </div>
                  ))}
                </div>
                <Link to="/profile/addresses" className="text-xs text-blue-600 hover:underline mt-2 inline-block">+ Add/Manage Addresses</Link>
              </div>


              <div>
                <label htmlFor="shipping-method" className="font-bold mb-2 block">Shipping Method</label>
                <select id="shipping-method" className="select select-bordered w-full" value={selectedShippingMethod} onChange={(e) => setSelectedShippingMethod(e.target.value)}>
                  {shippingMethods.map((method) => (
                    <option key={method} value={method}>{method.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="coupon" className="font-bold mb-2 block">Apply Coupon</label>
                <select id="coupon" className="select select-bordered w-full" value={selectedCouponId} onChange={(e) => setSelectedCouponId(e.target.value)}>
                  <option value="">No Coupon</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.code} - (Discount: {coupon.discount}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-pri-gr1 space-y-4 mt-auto">
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
          </>
        )}
      </div>
    </div >
  );
}
export default CartDrawer

