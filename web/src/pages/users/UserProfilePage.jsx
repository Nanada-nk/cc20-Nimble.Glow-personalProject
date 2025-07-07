import { useEffect } from 'react';
import { Link, useNavigate } from "react-router";
import NimbleGlowLogo from '../../components/NimbleGlowLogo.jsx';

import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react'
import authApi from '../../api/authApi.js';
import authStore from '../../stores/authStore.js';




function UserProfilePage() {
  const navigate = useNavigate();

  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const setAuthUser = authStore((state) => state.setAuthUser);
  const actionLogout = authStore((state) => state.actionLogout);


  useEffect(() => {
    const fetchUserProfile = async () => {

      if (!user && token) {
        try {

          const resp = await authApi.getMe(token);
          const fetchedUser = resp.data.user;
          setAuthUser(fetchedUser);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast.error(error.response?.data?.message || "Failed to load user profile. Please login again.");
          actionLogout();
          navigate('/login');
        }
      } else if (!user && !token) {

        toast.error("Please login to view your profile.");
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [user, token, setAuthUser, actionLogout, navigate]);

  // Logout Handler
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
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-5xl">👤</span> // Placeholder icon
                )}
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>


            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile Details :</h2>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-gray-700 text-sm">First Name:</p>
                <p className="text-gray-800 text-base p-2 bg-bg-cr2 rounded-lg">{user.firstName}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm">Last Name:</p>
                <p className="text-gray-800 text-base p-2 bg-bg-cr2 rounded-lg">{user.lastName}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm">Mobile:</p>
                <p className="text-gray-800 text-base p-2 bg-bg-cr2 rounded-lg">{user.mobile}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-sm">Email:</p>
                <p className="text-gray-800 text-base p-2 bg-bg-cr2 rounded-lg">{user.email}</p>
              </div>
            </div>


            <Link
              to="/profile/edit"
              className="inline-flex items-center justify-center w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors mt-4"
            >
              Edit Profile
            </Link>
          </div>


          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/profile/change-password" className="font-bold text-pri-gr1 hover:underline mr-4">
              Change Password
            </Link>
            <Link to="/profile/addresses" className="font-bold text-pri-gr1 hover:underline">
              Manage Addresses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;