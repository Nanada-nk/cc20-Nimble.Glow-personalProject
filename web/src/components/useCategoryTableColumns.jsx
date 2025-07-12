import { PencilIcon, TrashIcon } from 'lucide-react';

const useCategoryTableColumns = ({ onEdit, onDelete }) => {
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    { name: 'Name', selector: row => row.name, sortable: true},
    { 
      name: 'Created By', 
      selector: row => row.createdBy?.firstName || 'N/A', 
      sortable: true,
    },
    { 
      name: 'Created At', 
      selector: row => new Date(row.createdAt).toLocaleString('th-TH'),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(row)} className='text-blue-600 hover:text-blue-900' title='Edit Category'>
            <PencilIcon size={20} />
          </button>
          <button onClick={() => onDelete(row)} className='text-red-600 hover:text-red-900' title='Delete Category'>
            <TrashIcon size={20} />
          </button>
        </div>
      )
    },
  ];

  return columns;
}

export default useCategoryTableColumns;