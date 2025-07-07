import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router";
import NimbleGlowLogo from '../../components/NimbleGlowLogo.jsx';
import FormInput from '../../components/FormInput.jsx';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import { PlusIcon, EditIcon, TrashIcon, X } from 'lucide-react'; // ลบ MapPin/LocationIcon ออก
import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import { schemaAddress } from '../../validator/schema.js';


function UserAddressesPage() {
  const navigate = useNavigate();
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

  const fetchAddresses = async () => {
    if (!isLoggedIn || !token) {
      toast.error("Please login to manage your addresses.");
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const resp = await userApi.getMyAddresses(token);
      setAddresses(resp.data.addresses || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setError(err.response?.data?.message || "Failed to load addresses.");
      toast.error(err.response?.data?.message || "Failed to load addresses.");
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
  }, [isLoggedIn, token, navigate, actionLogout]);

  const handleAddNewClick = () => {
    setEditingAddressId(null);
    reset({});
    setIsFormVisible(true);
  };

  const handleEditClick = (addressItem) => {
    setEditingAddressId(addressItem.id);
    reset(addressItem);
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
        toast.success("Address updated successfully!");
        setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? resp.data.address : addr));
      } else {
        const resp = await userApi.addMyAddress(data, token);
        toast.success("Address added successfully!");
        setAddresses(prev => [...prev, resp.data.address]);
      }
      handleCancelForm();
    } catch (err) {
      console.error("Address submission failed:", err);
      toast.error(err.response?.data?.message || "Failed to save address.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    try {
      await userApi.deleteAddress(addressId, token);
      toast.success("Address deleted successfully!");
      setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== addressId));
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error(err.response?.data?.message || "Failed to delete address.");
    }
  };



  const handleLogout = () => {
    actionLogout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-cr2">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
        <p className="ml-2 text-pri-gr1">Loading Addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-cr2">
        <p className="text-red-500">Error: {error}</p>
        <button onClick={() => navigate('/profile')} className="ml-4 px-4 py-2 bg-pri-gr1 text-white rounded-lg">Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-bg-cr2">
      <div className="relative hidden lg:block">
        <img
          src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854578/Innovative_Ingredients_Local_Ingredients_for_skincare_brand_Nimble_Glow_in_lab_%E0%B8%82%E0%B8%AD%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87_%E0%B8%94%E0%B8%B9%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B8%E0%B9%88%E0%B8%99_%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%AA%E0%B8%B5_fffdf4_2_vlg6tn.jpg"
          alt="Skincare products background"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center bg-black/20">
          <NimbleGlowLogo className="w-[250px]" />
        </div>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="w-full flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Your Addresses</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Log out
            </button>
          </div>

          <div className="bg-bg-cr3 p-8 rounded-3xl shadow-lg space-y-4">
            {!isFormVisible && (
              <button
                onClick={handleAddNewClick}
                className="inline-flex items-center justify-center w-full bg-pri-gr2 hover:bg-[#4a5e37] text-white font-bold py-3 rounded-lg text-base transition-colors"
              >
                <PlusIcon size={20} className="mr-2" /> Add New Address
              </button>
            )}

            {isFormVisible && (
              <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-bg-cr4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-pri-gr1">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                  <button onClick={handleCancelForm} className="text-gray-500 hover:text-gray-700" title="Close Form">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                  <FormInput
                    label="Address Details"
                    name="address"
                    register={register}
                    error={errors.address}
                    placeholder="Example: 456/78 Nimble.Glow Tower, Rama 4 Road, Bangkok 10120"
                    isTextArea={true}
                    rows={4}
                  />

                  <button
                    type="submit"
                    disabled={isFormSubmitting}
                    className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-2 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2 mt-4"
                  >
                    {isFormSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <BubblesIcon className="w-4 h-4 animate-spin" />
                        <p>Saving...</p>
                      </div>
                    ) : (
                      <p>{editingAddressId ? 'Update Address' : 'Add Address'}</p>
                    )}
                  </button>
                </form>
              </div>
            )}

            {addresses.length === 0 && !isLoading && !isFormVisible ? (
              <p className="text-center text-gray-600">You have no saved addresses.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-bg-cr4">
                    <div className="flex items-center justify-between mb-2">

                      <h3 className="font-bold text-lg text-pri-gr1">Address</h3>
                      <div className="flex space-x-2">

                        <button onClick={() => handleEditClick(addr)} className="text-gray-600 hover:text-pri-gr1" title="Edit Address">
                          <EditIcon size={20} />
                        </button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-600 hover:text-red-800" title="Delete Address">
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700">{addr.address}</p>

                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/profile" className="font-bold text-pri-gr1 hover:underline">
              Back to Profile
            </Link>
          </p>




        </div>
      </div>
    </div>
  );
}

export default UserAddressesPage;