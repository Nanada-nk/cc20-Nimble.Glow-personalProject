import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BubblesIcon } from 'lucide-react';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import categoriesApi from '../../api/categoriesApi.js'
import authStore from '../../stores/authStore.js';
import FormInput from '../../components/FormInput.jsx'
import Modal from '../../components/Modal.jsx';
import useConfirm from '../../hooks/useConfirm.js';
import useCategoryTableColumns from '../../components/useCategoryTableColumns.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import { categorySchema } from '../../validator/schema.js';



function AdminCategoryManagementPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const token = authStore((state) => state.token);
  const user = authStore((state) => state.user);

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);


  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    toast.error("Unauthorized access.");
    navigate("/login");
    return;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(categorySchema)
  });


  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const resp = await categoriesApi.getAll();
      setCategories(resp.data.categories || []);
    } catch (err) {
      toast.error("Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchCategories();
  }, [user]);


  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    reset({ name: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    reset({ name: category.name });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (category) => {
    const result = await confirm({ text: `Are you sure you want to delete category: ${category.name}?` });
    if (result.isConfirmed) {
      try {
        await categoriesApi.deleteCategory(category.id, token);
        toast.success("Category deleted successfully!");
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete category.");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {

        await categoriesApi.updateCategory(editingCategory.id, data, token);
        toast.success("Category updated successfully!");
      } else {

        await categoriesApi.create(data, token);
        toast.success("Category created successfully!");
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };


  const columns = useCategoryTableColumns({
    onEdit: handleOpenEditModal,
    onDelete: handleDelete,
  });

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          Create New Category
        </button>
      </header>

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by category name..."
      />

      <DataTable
        columns={columns}
        data={filteredCategories}
        pagination
        responsive
        highlightOnHover
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit(onSubmit)}
        title={editingCategory ? "Edit Category" : "Create New Category"}
        confirmText={isSubmitting ? "Saving..." : "Save"}
        isConfirmDisabled={isSubmitting}
      >

        <FormInput
          label="Category Name"
          name="name"
          register={register}
          error={errors.name}
          placeholder="Enter category name"
        />

      </Modal>
    </div>
  );
}

export default AdminCategoryManagementPage;