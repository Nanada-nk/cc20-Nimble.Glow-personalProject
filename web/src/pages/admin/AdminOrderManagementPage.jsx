import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ordersApi from '../../api/ordersApi.js';
import authStore from '../../stores/authStore.js';
import Modal from '../../components/Modal.jsx';
import useOrderTableColumns from '../../components/useOrderTableColumns.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import SelectInput from '../../components/SelectInput.jsx';
import { orderStatusSchema } from '../../validator/schema.js';
import { useNavigate } from 'react-router';

const orderStatusOptions = [
  { value: 'NOT_PROCESSED', label: 'Not Processed' },
  { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'FAILED', label: 'Failed' },
];

function AdminOrderManagementPage() {
  const navigate = useNavigate()
  const token = authStore((state) => state.token);
  const user = authStore((state) => state.user);
  const userRole = user?.role;
  const actionLogout = authStore((state) => state.actionLogout)

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(orderStatusSchema)
  });

  const fetchOrders = async () => {
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN')) {
      toast.error("Unauthorized access.");
      actionLogout()
      navigate('/login', { replace: true });
      return;
    }
    try {
      setIsLoading(true);
      setError(null)
      const resp = await ordersApi.getAllAdminOrders(token)
      // console.log('resp', resp)
      // console.log('Data received from server:', resp.data.orders)
      setOrders(resp.data.orders || [])
    } catch (err) {
      // console.error("Full error object:", err)
      setError(err.response?.data?.message || "Failed to load orders.");
      toast.error(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { if (token) fetchOrders(); }, [token]);

  const handleOpenEditModal = (order) => {
    setEditingOrder(order);
    reset({
      orderStatus: order.orderStatus,
      trackingNumber: order.shipping?.trackingNumber || ''
    });
    setIsModalOpen(true);
  };
  // console.log('handleOpenEditModal', handleOpenEditModal)

  const handleCloseModal = () => setIsModalOpen(false);
  // console.log('handleCloseModal', handleCloseModal)

  const onSubmit = async (data) => {
    if (!editingOrder) return;
    // console.log('Dat/a being sent to the NEW API:', data)
    try {
      const updateStatus = await ordersApi.updateAdminOrderDetails(editingOrder.id, data, token);
      // console.log('updateStatus', updateStatus)
      toast.success("Order details updated successfully!");
      fetchOrders();
      handleCloseModal();
    } catch (err) {
      // console.log('err', err)
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const columns = useOrderTableColumns({ onEdit: handleOpenEditModal });
  // console.log('columns', columns)

  const filteredOrders = orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  // console.log('filteredOrders', filteredOrders)

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchOrders}
          className="btn btn-error text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </header>

      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Order Number..." />

      <DataTable columns={columns} data={filteredOrders} pagination responsive highlightOnHover />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit(onSubmit)}
        title={`Update Status for Order #${editingOrder?.orderNumber}`}
        confirmText={isSubmitting ? "Saving..." : "Save Status"}
        isConfirmDisabled={isSubmitting}
      >
        <SelectInput
          label="Order Status"
          name="orderStatus"
          register={register}
          error={errors.orderStatus}
          options={orderStatusOptions}
        />

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Tracking Number</span>
          </label>
          <input
            type="text"
            placeholder="Enter tracking number"
            className="input input-bordered w-full"
            {...register('trackingNumber')}
          />
        </div>
      </Modal>
    </div>
  );
}
export default AdminOrderManagementPage