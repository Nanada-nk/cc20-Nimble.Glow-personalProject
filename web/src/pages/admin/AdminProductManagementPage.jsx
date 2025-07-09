import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { BubblesIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import productsApi from '../../api/productsApi.js';
import categoriesApi from '../../api/categoriesApi.js';
import authStore from '../../stores/authStore.js';
import FormInput from '../../components/FormInput.jsx'
import Modal from '../../components/Modal.jsx';
import useConfirm from '../../hooks/useConfirm.js';
import useProductTableColumns from '../../components/useProductTableColumns.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import SelectInput from '../../components/SelectInput.jsx';
import { productSchema } from '../../validator/schema.js';

function AdminProductManagementPage() {
  const confirm = useConfirm();
  const token = authStore((state) => state.token);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([])
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting } } = useForm({
      resolver: yupResolver(productSchema)
    });

  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true);
      const [productsResp, categoriesResp] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setProducts(productsResp.data.products || []);
      setCategories(categoriesResp.data.categories || []);
    } catch (err) {
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...filesToUpload, ...files];
      setFilesToUpload(newFiles);
      const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), id: null }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const removedImage = imagePreviews[indexToRemove];

    if (removedImage.id) {
      setImagesToDelete(prev => [...prev, removedImage.id]);
    }

    if (removedImage.url.startsWith('blob:')) {
      const fileIndex = imagePreviews
        .slice(0, indexToRemove)
        .filter(p => p.url.startsWith('blob:')).length;
      setFilesToUpload(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    reset({ title: '', description: '', price: 0, stockQuantity: 0, categoryId: '' });
    setImagePreviews([]);
    setFilesToUpload([]);
    setImagesToDelete([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId
    });
   
    setImagePreviews(product.images.map(img => ({ id: img.id, url: img.url })));
    setFilesToUpload([])
    setImagesToDelete([])
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = async (product) => {
    const { isConfirmed } = await confirm({ text: `Are you sure to delete: ${product.title}?` });
    if (isConfirmed) {
      try {
        await productsApi.deleteProduct(product.id, token);
        toast.success("Product deleted!");
        fetchProductsAndCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const onSubmit = async (data) => {
    try {

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      filesToUpload.forEach(file => {
        formData.append('images', file);
      });

      if (editingProduct) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        await productsApi.updateProduct(editingProduct.id, formData, token);
        toast.success("Product updated!");
      } else {
        await productsApi.create(formData, token);
        toast.success("Product created!");
      }
      fetchProductsAndCategories();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };

  const columns = useProductTableColumns({ onEdit: handleOpenEditModal, onDelete: handleDelete });
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">Create New Product</button>
      </header>

      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by product title..." />

      <DataTable columns={columns} data={filteredProducts} pagination responsive highlightOnHover />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit(onSubmit)}
        title={editingProduct ? "Edit Product" : "Create New Product"}
        confirmText={isSubmitting ? "Saving..." : "Save"}
        isConfirmDisabled={isSubmitting}
      >


        <FormInput label="Title" name="title" register={register} error={errors.title} />
        <FormInput label="Description" name="description" register={register} error={errors.description} />
        <FormInput label="Price" name="price" type="number" register={register} error={errors.price} />
        <FormInput label="Stock Quantity" name="stockQuantity" type="number" register={register} error={errors.stockQuantity} />
        <br />
        <SelectInput label="Category" name="categoryId" register={register} error={errors.categoryId} options={categoryOptions} />

        <div className="mt-4">
          <label className="label"><span className="label-text">Images</span></label>
          <div className="grid grid-cols-3 gap-2">

            {imagePreviews.map((preview, index) => (
              <div key={preview.id || preview.url} className="relative">
                <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                  <XIcon size={12} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50"
            >
              <UploadCloudIcon size={24} />
              <span>Add Images</span>
            </button>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

      </Modal>
    </div>
  );
}
export default AdminProductManagementPage