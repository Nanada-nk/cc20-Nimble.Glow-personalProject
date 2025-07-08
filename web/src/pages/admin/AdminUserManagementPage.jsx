import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import { SearchIcon } from 'lucide-react';

import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import UserTable from '../../components/UserTable.jsx';


function AdminUserManagementPage() {
  const navigate = useNavigate();

  const token = authStore((state) => state.token);
  const user = authStore((state) => state.user);
  const actionLogout = authStore((state) => state.actionLogout);
  const userRole = user?.role
  console.log("Value of userRole being checked is:", userRole)
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [errorLoadingUsers, setErrorLoadingUsers] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    if (!token || (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN')) {
      toast.error("Unauthorized access. Please login as an admin.");
      actionLogout();
      navigate('/login', { replace: true });
      return;
    }

    setIsLoadingUsers(true);
    setErrorLoadingUsers(null);
    try {
      const resp = await userApi.getListAllUser(token);
      setUsers(resp.data.users || []);
      setTotalUsers(resp.data.users?.length || 0);
    } catch (err) {
      console.error("AdminUserManagementPage: Failed to fetch users:", err)
      setErrorLoadingUsers(err.response?.data?.message || "Failed to load users.");
      toast.error(err.response?.data?.message || "Failed to load users.")
      if (err.response?.status === 401 || err.response?.status === 403) {
        actionLogout();
        navigate('/login', { replace: true })
      }
    } finally {
      setIsLoadingUsers(false)
    }
  };

  useEffect(() => {
    console.log("AdminUserManagementPage: Component Mounted/Updated");
    if (isLoadingUsers) {
      return;
    }
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchUsers();
  }, [token, user, isLoadingUsers, navigate, actionLogout]);

  const handleDisableUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to disable user ID: ${userId}?`)) {
      return;
    }
    try {
      await userApi.disableUser(userId, token);
      toast.success(`User ID: ${userId} has been disabled.`);
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, enabled: false } : user
      ));
    } catch (err) {
      console.error("AdminUserManagementPage: Failed to disable user:", err)
      toast.error(err.response?.data?.message || "Failed to disable user.");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm)
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);



  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
        <p className="ml-2 text-pri-gr1">Loading Users...</p>
      </div>
    );
  }

  if (errorLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">Error: {errorLoadingUsers}</p>
        <button onClick={() => navigate('/admin/users')} className="ml-4 px-4 py-2 bg-pri-gr1 text-white rounded-lg">Back to Admin Dashboard</button>
      </div>
    );
  }

  return (

    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
      </header>


      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customer..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri-gr1"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>


      <UserTable
        users={currentUsers}
        onDisableUser={handleDisableUser}
      />


      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} from {filteredUsers.length} total users
        </p>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1 ? 'z-10 bg-pri-gr1 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Next
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}

export default AdminUserManagementPage;