

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router";
import NimbleGlowLogo from '../../components/NimbleGlowLogo.jsx';
import FormInput from '../../components/FormInput.jsx';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import { Pencil } from 'lucide-react';
import authApi from '../../api/authApi.js';
import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import { schemaEditProfile } from '../../validator/schema.js';


function EditProfilePage() {
  const navigate = useNavigate();
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const setAuthUser = authStore((state) => state.setAuthUser);
  const actionLogout = authStore((state) => state.actionLogout);

  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || 'https://via.placeholder.com/150?text=No+Image');

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaEditProfile),
    mode: "onBlur",
  });


  useEffect(() => {
    const fetchUserProfileAndSetForm = async () => {

      if (!user && token) {
        try {

          const resp = await authApi.getMe(token);
          const fetchedUser = resp.data.user;
          setAuthUser(fetchedUser);
          reset(fetchedUser);

          setProfileImagePreview(fetchedUser.profileImage || 'https://via.placeholder.com/150?text=No+Image');
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast.error(error.response?.data?.message || "Failed to load user profile. Please login again.");
          actionLogout();
          navigate('/login');
        }
      } else if (user) {

        reset(user);
        setProfileImagePreview(user.profileImage || 'https://via.placeholder.com/150?text=No+Image');
      } else {

        toast.error("Please login to view your profile.");
        navigate('/login');
      }
    };

    fetchUserProfileAndSetForm();

  }, [user, token, reset, navigate, setAuthUser, actionLogout]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setProfileImagePreview(user?.profileImage || 'https://via.placeholder.com/150?text=No+Image');
    };
  }

    const handleImageClick = () => {
      fileInputRef.current.click();
    };


    const onSubmit = async (data) => {
      try {

        const formData = new FormData();


        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('mobile', data.mobile);
        formData.append('email', data.email);


        if (selectedFile) {
          formData.append('profileImage', selectedFile);
        }


        const resp = await userApi.updateMyProfile(formData, token);

        const updatedUser = resp.data.user;
        setAuthUser(updatedUser);
        toast.success("Profile updated successfully!");

      } catch (error) {
        console.error("Profile update failed:", error);
        toast.error(error.response?.data?.message || "Failed to update profile.");
      }
    };


    const handleLogout = () => {
      actionLogout();
      toast.success("Logged out successfully!");
      navigate("/login");
    };


    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-bg-cr2">
          <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
          <p className="ml-2 text-pri-gr1">Loading Profile...</p>
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
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-pri-gr1">Hello, {user.firstName || 'User'} !</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Log out
              </button>
            </div>


            <div className="bg-bg-cr3 p-8 rounded-3xl shadow-lg space-y-4">

              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-pri-gr1">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 text-5xl">👤</span> // Placeholder icon ถ้าไม่มีรูป
                  )}

                  <div
                    className="absolute bottom-1 right-2 bg-pri-gr1 p-1 rounded-full cursor-pointer hover:bg-[#5a6e47] transition-colors"
                    onClick={handleImageClick}
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <h3 className="mt-2 text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>


              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit your profile :</h2>


              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  label="Edit your FirstName"
                  name="firstName"
                  placeholder="Enter Your FirstName"
                  register={register}
                  error={errors.firstName}
                />
                <FormInput
                  label="Edit your LastName"
                  name="lastName"
                  placeholder="Enter Your LastName"
                  register={register}
                  error={errors.lastName}
                />
                <FormInput
                  label="Edit your Mobile"
                  name="mobile"
                  placeholder="Enter Your Mobile"
                  register={register}
                  error={errors.mobile}
                />
                <FormInput
                  label="Edit your Email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  register={register}
                  error={errors.email}
                  disabled
                />

                <div className="text-right text-sm">
                  <Link to="/profile/change-password" className="font-bold text-pri-gr1 hover:underline">
                    Change Password
                  </Link>
                </div>


                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <BubblesIcon className="w-5 h-5 animate-spin" />
                      <p>Saving Changes...</p>
                    </div>
                  ) : (
                    <p>Save Changes</p>
                  )}
                </button>
              </form>
            </div>


            <p className="text-center text-sm text-gray-600 mt-4">
              <Link to="/profile/addresses" className="font-bold text-pri-gr1 hover:underline">
                Manage Addresses
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  
}

export default EditProfilePage