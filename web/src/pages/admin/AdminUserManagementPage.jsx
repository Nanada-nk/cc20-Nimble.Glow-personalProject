import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import DataTable from 'react-data-table-component';
import userApi from '../../api/userApi.js';
import authStore from '../../stores/authStore.js';
import Modal from '../../components/Modal.jsx';
import SelectInput from '../../components/SelectInput.jsx';
import useConfirm from '../../hooks/useConfirm.js';
import useUserTableColumns from '../../components/useUserTableColumns.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema } from '../../validator/schema.js';

const roleOptions = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPERADMIN", label: "Super Admin" }
];

function AdminUserManagementPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const token = authStore((state) => state.token);
  const currentUser = authStore((state) => state.user);
  const userRole = currentUser?.role;

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(editUserSchema)
  });

  const fetchUsers = async () => {
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN')) {
      toast.error("Unauthorized access.");
      authStore.getState().actionLogout();
      navigate('/login', { replace: true });
      return;
    }
    try {
      setIsLoading(true);
      const resp = await userApi.getListAllUser(token);
      setUsers(resp.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
      toast.error(err.response?.data?.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleDisableUser = async (userToDisable) => {
    const result = await confirm({
      title: 'Confirm Action',
      text: `Are you sure you want to disable user: ${userToDisable.firstName}?`,
      confirmButtonText: 'Yes, Disable User',
      icon: 'warning'
    });
    if (result.isConfirmed) {
      try {
        await userApi.disableUser(userToDisable.id, token);
        toast.success(`User ${userToDisable.firstName} has been disabled.`);
        setUsers(prevUsers => prevUsers.filter(userFromPrev => userFromPrev.id !== userToDisable.id))
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to disable user.");
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenEditModal = (userToEdit) => {
    setSelectedUser(userToEdit);
    reset({ role: userToEdit.role });
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }


  const onSubmit = async (data) => {
    if (!selectedUser) return;
    try {
      await userApi.updateUserStatus(selectedUser.id, { role: data.role }, token);
      toast.success(`Role for ${selectedUser.firstName} updated.`);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: data.role } : u));
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    }
  }

  const columns = useUserTableColumns({
    currentUserRole: userRole,
    onEditUser: handleOpenEditModal,
    onDisableUser: handleDisableUser
  })

  const filteredUsers = users.filter(userFromPrev =>
    userFromPrev.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userFromPrev.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userFromPrev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userFromPrev.mobile?.includes(searchTerm)
  )

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" /></div>;
  }


  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
      </header>

      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name, email, or mobile..."
      />

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        responsive
        highlightOnHover
        pointerOnHover
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit(onSubmit)}
        title={`Edit Role for: ${selectedUser?.firstName}`}
        confirmText="Save Role"
        isConfirmDisabled={isSubmitting}
      >
        <SelectInput
          label="Role"
          name="role"
          register={register}
          error={errors.role}
          options={roleOptions}
        />
      </Modal>
    </div>
  );
}

export default AdminUserManagementPage;
