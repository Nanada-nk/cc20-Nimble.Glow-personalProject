import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import { BubblesIcon, SearchIcon } from 'lucide-react';

import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import UserTable from '../../components/UserTable.jsx';
import Modal from '../../components/Modal.jsx';
import SelectInput from '../../components/SelectInput.jsx';
import RadioGroupInput from '../../components/RadioGroupInput.jsx';


const roleOptions = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPERADMIN", label: "Super admin" },
]

const statusOptions = [
  { value: true, label: "Active", className: "checked:bg-green-500" },
  { value: false, label: "Disabled", className: "checked:bg-red-500" },
]

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editData, setEditData] = useState({ role: '', enabled: false })

  const fetchUsers = async () => {
    console.log("A. fetchUsers called.")
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN')) {
      toast.error("Unauthorized access.")
      actionLogout();
      navigate('/login', { replace: true });
      return;
    }

    setIsLoadingUsers(true);
    setErrorLoadingUsers(null);
    try {
      console.log("B. Calling userApi.getListAllUser...")
      const resp = await userApi.getListAllUser(token);
      console.log("C. API call SUCCEEDED. Response data:", resp.data)
      setUsers(resp.data.users || []);

    } catch (err) {
      console.error("D. API call FAILED.", err)
      setErrorLoadingUsers(err.response?.data?.message || "Failed to load users.");
      toast.error(err.response?.data?.message || "Failed to load users.")

    } finally {
      console.log("E. FINALLY block reached. Setting isLoadingUsers to false.");
      setIsLoadingUsers(false)
    }
  };

  useEffect(() => {
    console.log("AdminUserManagementPage: Component Mounted/Updated");
    if (token) {
      fetchUsers();
    }
  }, [token]);

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

  const handleOpenEditModal = (userToEdit) => {
    console.log('userToEdit handleOpenEditModal', userToEdit)
    setSelectedUser(userToEdit)
    setEditData({ role: userToEdit.role, enabled: userToEdit.enabled })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleConfirmChange = async () => {
    if (!selectedUser) return
    try {
      await userApi.updateUserStatus(selectedUser.id, editData, token)
      toast.success(`User ${selectedUser.firstName} has been updated.`)
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === selectedUser.id ? { ...user, ...editData } : user
      ))
      handleCloseModal()
    } catch (err) {
      console.log('error for handleConfirmChange', err)
      toast.error(err.response?.data?.message || "Failed to update user.")
    }
  }

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
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pri-gr1"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>


      <UserTable
        users={currentUsers}
        onDisableUser={handleDisableUser}
        onEditUser={handleOpenEditModal}
        currentUserRole={userRole}
      />


      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="join">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="join-item btn btn-sm">«</button>
          <button className="join-item btn btn-sm">Page {currentPage}</button>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="join-item btn btn-sm">»</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmChange}
        title={`Edit User: ${selectedUser?.firstName}`}
        confirmText="Save Changes"
      >
        <SelectInput
          label="Role"
          value={editData.role}
          onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
          options={roleOptions}
        />

        <RadioGroupInput
          label="Status"
          name="status-radio"
          selectedValue={editData.enabled}
          onChange={(newValue) => setEditData(prev => ({ ...prev, enabled: newValue }))}
          options={statusOptions}
        />
      </Modal>

    </div>
  );
}

export default AdminUserManagementPage;