import { PencilIcon, TrashIcon } from 'lucide-react'

function useProductTableColumns({ onEdit, onDelete }) {
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '60px' },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.images?.[0]?.url || 'https://res.cloudinary.com/dhoyopcr7/image/upload/v1752044189/ad-product-svgrepo-com_zogf2n.png'}
          alt={row.title}
          className="w-12 h-12 object-cover rounded-md my-2"
        />
      )
    },
    { name: 'Title', selector: row => row.title, sortable: true },
    { name: 'Category', selector: row => row.category?.name || 'N/A', sortable: true },
    { name: 'Price', selector: row => row.price, sortable: true },
    { name: 'Stock', selector: row => row.stockQuantity, sortable: true },
    { name: 'Created by', selector: row => row.createdBy?.firstName || 'N/A', sortable:true },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(row)} className='text-blue-600 hover:text-blue-900' title='Edit Product'>
            <PencilIcon size={20} />
          </button>
          <button onClick={() => onDelete(row)} className='text-red-600 hover:text-red-900' title='Delete Product'>
            <TrashIcon size={20} />
          </button>
        </div>
      )
    },
  ];
  return columns
}
export default useProductTableColumns