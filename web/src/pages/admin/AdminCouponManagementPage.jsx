import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import authStore from '../../stores/authStore.js';
import couponsApi from '../../api/couponsApi.js';
import useCouponTableColumns from '../../components/useCouponTableColumns.jsx';

import { BubblesIcon } from 'lucide-react';
import SearchInput from '../../components/SearchInput.jsx';
import Modal from '../../components/Modal.jsx';
import FormInput from '../../components/FormInput.jsx';
import useConfirm from '../../hooks/useConfirm.js';
import { couponSchema } from '../../validator/schema.js';



function AdminCouponManagementPage() {
  const confirm = useConfirm();
  const token = authStore((state) => state.token);

  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(couponSchema)
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const resp = await couponsApi.getAll();
      setCoupons(resp.data.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('fetchCoupons', fetchCoupons)
    fetchCoupons();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    reset({ code: '', discount: 0, expiredAt: '', usageLimit: 0 });
    setIsModalOpen(true);
  };
  console.log('handleOpenCreateModal', handleOpenCreateModal)

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    let formattedExpiredAt = '';
    console.log('formattedExpiredAt', formattedExpiredAt)

    if (coupon.expiredAt && !isNaN(new Date(coupon.expiredAt).getTime())) {
      const date = new Date(coupon.expiredAt);
      console.log('date', date)
      
      const localDateTime = new Date(date.getTime() - (new Date().getTimezoneOffset() * 60000));
      console.log('localDateTime', localDateTime)
      
      formattedExpiredAt = localDateTime.toISOString().slice(0, 16);
    }

    reset({
      code: coupon.code,
      discount: coupon.discount,
      expiredAt: formattedExpiredAt,
      usageLimit: coupon.usageLimit,
    });

    setIsModalOpen(true);
  };
  console.log('handleOpenEditModal', handleOpenEditModal)

  const handleCloseModal = () => setIsModalOpen(false);
  console.log('handleCloseModal', handleCloseModal)

  const handleDelete = async (coupon) => {
    const { isConfirmed } = await confirm({ text: `Delete coupon: ${coupon.code}?` });
    if (isConfirmed) {
      try {
        await couponsApi.delete(coupon.id, token);
        toast.success("Coupon deleted!");
        fetchCoupons();
      } catch (err) {
        console.log('err', err)
        toast.error(err.response?.data?.message || "Failed to delete coupon.");
      }
    }
  };
  console.log('handleDelete', handleDelete)

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        expiredAt: data.expiredAt ? new Date(data.expiredAt).toISOString() : null,
      };
      console.log('payload', payload)

      if (editingCoupon) {
        await couponsApi.update(editingCoupon.id, payload, token);
        toast.success("Coupon updated!");
      } else {
        await couponsApi.create(payload, token);
        toast.success("Coupon created!");
      }
      fetchCoupons();
      handleCloseModal();
    } catch (err) {
      console.log('err', err)
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };
  console.log('onSubmit', onSubmit)

  const columns = useCouponTableColumns({ onEdit: handleOpenEditModal, onDelete: handleDelete });
  console.log('columns', columns)

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));
  console.log('filteredCoupons', filteredCoupons)

  if (isLoading) { return <div className="flex items-center justify-center min-h-screen"><BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" /></div>; }

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">Create New Coupon</button>
      </header>

      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by coupon code..." />

      <DataTable columns={columns} data={filteredCoupons} pagination responsive highlightOnHover />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit(onSubmit)}
        title={editingCoupon ? "Edit Coupon" : "Create New Coupon"}
        confirmText={isSubmitting ? "Saving..." : "Save"}
        isConfirmDisabled={isSubmitting}
      >
        <FormInput label="Coupon Code" name="code" register={register} error={errors.code} />
        <FormInput label="Discount (%)" name="discount" type="number" register={register} error={errors.discount} />
        <FormInput label="Usage Limit" name="usageLimit" type="number" register={register} error={errors.usageLimit} />
        <FormInput label="Expires At" name="expiredAt" type="datetime-local" register={register} error={errors.expiredAt} />
      </Modal>
    </div>
  );
}

export default AdminCouponManagementPage;