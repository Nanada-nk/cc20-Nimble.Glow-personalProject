import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router";
import FormInput from '../../components/FormInput.jsx';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Pencil, BubblesIcon } from 'lucide-react';
import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import { schemaEditProfile } from '../../validator/schema.js';
import ProfileLayout from '../../components/ProfileLayout.jsx';


function EditProfilePage() {
  const navigate = useNavigate();
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const checkAuth = authStore((state) => state.checkAuth);
  const setAuthUser = authStore((state) => state.setAuthUser);
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schemaEditProfile),
    mode: "onBlur",
  });

  const initializePageData = async () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        profileImagePreview: user.profileImage,
      });
      setProfileImagePreview(user.profileImage);
    } else if (token) {
      checkAuth();
    } else {
      toast.error("Please login to continue.");
      navigate('/login');
    }
  }


  useEffect(() => {
    initializePageData()
  }, [])


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  }


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
      setAuthUser(resp.data.user);
      toast.success("Profile updated successfully!");
      navigate('/profile')
    } catch (error) {
      // console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
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
    <ProfileLayout title="Edit Profile">
      <div className="bg-bg-cr3 p-8 rounded-3xl shadow-lg space-y-4">

        <div className="flex flex-col items-center mb-6">
          <div
            className="relative w-24 h-24 rounded-full group"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={profileImagePreview || 'https://res.cloudinary.com/dhoyopcr7/image/upload/v1752042093/user-alt-1-svgrepo-com_i9clsu.png'}
              alt="Profile Preview"
              className="w-full h-full object-cover rounded-full border-2 border-pri-gr1"
            />
            <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer transition-transform group-hover:scale-110">
              <Pencil className="w-4 h-4 text-pri-gr1" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput label="First Name" name="firstName" register={register} error={errors.firstName} />
          <FormInput label="Last Name" name="lastName" register={register} error={errors.lastName} />
          <FormInput label="Mobile" name="mobile" register={register} error={errors.mobile} />

          <FormInput label="Email" name="email" register={register} error={errors.email} />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <BubblesIcon className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>


      <p className="text-center text-sm mt-4">
        <Link to="/profile" className="font-bold text-pri-gr1 hover:underline">
          Back to Profile
        </Link>
      </p>
    </ProfileLayout>
  )

}

export default EditProfilePage