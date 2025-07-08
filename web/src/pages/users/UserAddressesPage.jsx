import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router";
import FormInput from '../../components/FormInput.jsx';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { PlusIcon, EditIcon, TrashIcon, X, BubblesIcon } from 'lucide-react';
import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import { schemaAddress } from '../../validator/schema.js';
import useConfirm from '../../hooks/useConfirm.js';
import ProfileLayout from '../../components/ProfileLayout.jsx';


function UserAddressesPage() {
  const navigate = useNavigate();
  const confirm = useConfirm()

  const token = authStore((state) => state.token);
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const actionLogout = authStore((state) => state.actionLogout);

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaAddress),
    mode: 'onBlur',
  });

  if (!isLoggedIn || !token) {
    toast.error("Please login to manage your addresses.");
    navigate('/login');
    return;
  }

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const resp = await userApi.getMyAddresses(token);
      setAddresses(resp.data.addresses || []);
    } catch (err) {
      // console.error("Failed to fetch addresses:", err);
      setError(err.response?.data?.message)
      toast.error("Failed to load addresses.")
      if (err.response?.status === 401) {
        actionLogout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);


  const handleShowForm = (addressItem = null) => {
    if (addressItem) {
      setEditingAddressId(addressItem.id);
      reset({ address: addressItem.address });
    } else {
      setEditingAddressId(null);
      reset({ address: '' });
    }
    setIsFormVisible(true);
  };


  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingAddressId(null);
    reset({});
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddressId) {
        const resp = await userApi.updateMyAddress(editingAddressId, data, token);
        setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? resp.data.address : addr));
        toast.success("Address updated!");
      } else {
        const resp = await userApi.addMyAddress(data, token);
        setAddresses(prev => [...prev, resp.data.address]);
        toast.success("Address added!");
      }
      handleCancelForm();
      setIsFormVisible(false);
    } catch (err) {
      // console.error("Address submission failed:", err);
      toast.error("Failed to save address.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await confirm({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this address?',
      confirmButtonText: 'Yes, Delete',
    })

    if (result.isConfirmed) {
      try {
        await userApi.deleteAddress(addressId, token);
        toast.success("Address deleted successfully!");
        setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== addressId));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete address.");
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-cr2">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
        <p className="ml-2 text-pri-gr1">Loading Addresses...</p>
      </div>
    );
  }


  return (
    <ProfileLayout title="Your Addresses">
      <div className="bg-bg-cr3 p-6 md:p-8 rounded-3xl shadow-lg space-y-4">
        {!isFormVisible && (
          <button
            onClick={() => handleShowForm()}
            className="inline-flex items-center justify-center w-full bg-pri-gr2 hover:bg-[#b8c47a] text-text-dark font-bold py-3 rounded-lg text-base transition-colors"
          >
            <PlusIcon size={20} className="mr-2" /> Add New Address
          </button>
        )}

        {isFormVisible && (
          <div className="p-4 border border-gray-300 rounded-lg shadow-inner bg-bg-cr4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-pri-gr1">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
              <button 
              onClick={handleCancelForm} 
              className="text-gray-500 hover:text-gray-700" 
              title="Close Form">

                <X size={20} />

              </button>
            </div>
            <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-3">

              <FormInput
                label="Address Details"
                name="address"
                register={register}
                error={errors.address}
                placeholder="Example: 456/78 Nimble.Glow Tower, Bangkok"
                isTextArea={true}
                rows={4}
              />

              <button
                type="submit"
                disabled={isFormSubmitting}
                className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-2 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2 mt-4"
              >

                {isFormSubmitting 
                ? <BubblesIcon className="w-4 h-4 animate-spin" /> 
                : null}

                <p>{editingAddressId 
                ? 'Update Address' 
                : 'Save Address'}</p>

              </button>
            </form>
          </div>
        )}

        {addresses.length === 0 && !isFormVisible && (
          <p className="text-center text-gray-600">You have no saved addresses.</p>
        )}

        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-bg-cr4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-pri-gr1">Address</h3>
                <div className="flex space-x-2">
                  <button 
                  onClick={() => handleShowForm(addr)} 
                  className="text-gray-600 hover:text-pri-gr1" 
                  title="Edit Address">

                    <EditIcon size={20} />
                  </button>

                  <button 
                  onClick={() => handleDeleteAddress(addr.id)} 
                  className="text-red-600 hover:text-red-800" 
                  title="Delete Address">

                    <TrashIcon size={20} />
                  </button>

                </div>
              </div>

              <p className="text-gray-700 break-words">{addr.address}</p>

            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
        <Link to="/profile" className="font-bold text-pri-gr1 hover:underline">
          Back to Profile
        </Link>
      </p>

    </ProfileLayout>
  );
}

export default UserAddressesPage;