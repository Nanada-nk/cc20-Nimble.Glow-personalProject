import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { BubblesIcon, UploadCloudIcon } from 'lucide-react';

import Footer from '../../layouts/Footer.jsx';
import authStore from '../../stores/authStore.js';
import ordersApi from '../../api/ordersApi.js';
import paymentsApi from '../../api/paymentsApi.js';


function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = authStore((state) => state.token);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);


  const fetchOrderDetails = async () => {
    if (!token || !orderId) return;
    try {
      setIsLoading(true);
      const response = await ordersApi.getOrderById(orderId, token);
      console.log('response', response)
      setOrder(response.data.order);
    } catch (error) {
      console.log('error', error)
      toast.error("Failed to load order details.");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, token, navigate]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('file', file)
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleConfirmPayment = async () => {
    if (!slipFile) {
      return toast.error("Please upload your payment slip.");
    }
    if (!order || !order.payment) {
      return toast.error("Payment information for this order not found.");
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      console.log('formData', formData)
      formData.append('slipImage', slipFile);
      const uploadSlip = await paymentsApi.uploadSlip(order.payment.id, formData, token);
      console.log('uploadSlip', uploadSlip)
      toast.success("Payment confirmation sent successfully!");
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.log('error', error)
      toast.error(error.response?.data?.message || "Failed to confirm payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BubblesIcon className="w-12 h-12 animate-spin text-pri-gr1" />
      </div>
    );
  }

  return (
    <>
      <div className="p-10 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start duration-700">


          <div className='w-[427px]'>
            <div className='pb-6'>
              <h2 className='text-xl font-bold'>ขั้นตอนการชำระเงิน</h2>
              <h3 className='font-bold mb-4'>Payment process</h3>
              <ul className='list-disc list-inside space-y-2 text-gray-700'>
                <li className='font-semibold'>ตรวจสอบจำนวนเงินที่ต้องโอน</li>
                <p className='ml-6'>Check the amount to be transferred.</p>
                <li className='font-semibold'>สแกน QR Code หรือโอนเงินผ่าน Mobile Banking</li>
                <p className='ml-6'>Scan QR Code or transfer money via Mobile Banking.</p>
                <li className='font-semibold'>บันทึกสลิปการโอนเงินให้ถูกต้อง</li>
                <p className='ml-6'>Record the transfer slip correctly.</p>
                <li className='font-semibold'>อัปโหลดสลิปและกดยืนยันการชำระเงิน</li>
                <p className='ml-6'>Upload the slip and confirm payment.</p>
                <li className='font-semibold'>ระบบจะแสดงหลักฐาน/สรุปการโอนเงิน</li>
                <p className='ml-6'>The system will display proof/summary of the money transfer.</p>
              </ul>
            </div>


            <div className='mt-8 mb-4'>
              <h2 className='text-xl font-bold mb-4'>Shipping to:</h2>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-gray-700">{order.shipping?.address?.address || 'No address selected.'}</p>
              </div>
            </div>

            <div className='p-6 bg-gray-50 rounded-lg'>
              <h3 className='text-lg font-bold'>Your Order ID: {order.orderNumber}</h3>
              <div className='mt-4 space-y-4'>
                {order.products.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img src={item.product.images[0]?.url} alt={item.product.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div>
                        <p className='font-semibold'>{item.product.title}</p>
                        <p className='text-sm text-gray-500'>Qty: {item.count}</p>
                      </div>
                    </div>
                    <p className='font-semibold'>{(item.price * item.count).toFixed(2)} THB</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between font-bold text-xl">
                <span>TOTAL</span>
                <span className='text-red-500'>{order.cartTotal.toFixed(2)} THB</span>
              </div>
            </div>
          </div>



          <div className='outline-2 outline-pri-gr1 py-10 px-6 h-auto w-[427px] rounded-lg flex flex-col items-center shadow-lg shadow-pri-gr1 duration-700'>
            <h2 className='text-2xl font-bold mb-2'>THAI QR PAYMENT</h2>
            <img src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1752200246/QRcode_nofkwy.jpg" alt="QR Code" className='h-[500px]' />
            <div className='w-full max-w-sm mt-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                อัปโหลดสลิปการโอนเงิน
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              >
                {slipPreview ? (
                  <img src={slipPreview} alt="Slip preview" className="max-h-48 rounded-md" />
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload a file</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className='hidden' accept="image/*" />
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="btn btn-primary w-full max-w-sm mt-6"
            >
              {isSubmitting ? <span className="loading loading-spinner"></span> : "แจ้งยืนยันการชำระเงิน"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CheckoutPage;