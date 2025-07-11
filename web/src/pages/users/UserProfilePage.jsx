import { useEffect } from 'react';
import { Link } from "react-router";
import { BubblesIcon } from 'lucide-react'
import authStore from '../../stores/authStore.js';
import ProfileLayout from '../../components/ProfileLayout.jsx';


function UserProfilePage() {
  const user = authStore((state) => state.user);
  const checkAuth = authStore((state) => state.checkAuth);


  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
      </div>
    );
  }


  return (
    <ProfileLayout title={`Hello, ${user.firstName || 'User'}!`}>
      <div className="bg-bg-cr3 p-8 rounded-3xl shadow-lg space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-bg-cr4 border-2 border-pri-gr1">

            <img
              src={user.profileImage || 'https://res.cloudinary.com/dhoyopcr7/image/upload/v1752042093/user-alt-1-svgrepo-com_i9clsu.png'}
              alt="Profile"
              className="w-full h-full object-cover"
            />

          </div>
          <h3 className="mt-2 text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile Details:</h2>

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

        </div>

        <Link to="/profile/edit" className="inline-flex items-center justify-center w-full bg-pri-gr1 hover:bg-[#5a6e47] text-white font-bold py-3 rounded-lg text-base transition-colors mt-4">
          Edit Profile
        </Link>

        {(user.role === 'SUPERADMIN' || user.role === 'ADMIN') && (
          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center w-full bg-orange-700 hover:bg-orange-900 text-white font-bold py-3 rounded-lg text-base transition-colors mt-2"
          >
            Go to Admin Management
          </Link>
        )}
      </div>


      <div className='flex gap-4 justify-center mt-4'>
        <Link to="/profile/change-password" className="btn btn-outline btn-sm border-pri-gr1 text-pri-gr1 hover:bg-pri-gr1 hover:text-white">
          Change Password
        </Link>
        <Link to="/profile/addresses" className="btn btn-outline btn-sm border-pri-gr1 text-pri-gr1 hover:bg-pri-gr1 hover:text-white">
          Manage Addresses
        </Link>
        <Link to="/orders" className="btn btn-outline btn-sm border-pri-gr1 text-pri-gr1 hover:bg-pri-gr1 hover:text-white">
          My Orders
        </Link>
      </div>

    </ProfileLayout>
  );
}

export default UserProfilePage;