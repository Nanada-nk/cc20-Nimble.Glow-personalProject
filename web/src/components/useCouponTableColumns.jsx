import { PencilIcon, TrashIcon } from 'lucide-react'

function useCouponTableColumns({ onEdit, onDelete }) {
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    { name: 'Code', selector: row => row.code, sortable: true },
    { name: 'Discount (%)', selector: row => row.discount, sortable: true },
    { name: 'Usage', selector: row => `${row.usageCount || 0} / ${row.usageLimit || '∞'}`, sortable: true },
    {
      name: 'Expires At',
      selector: row => new Date(row.expiredAt).toLocaleString(),
      sortable: true
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(row)} className='text-blue-600 hover:text-blue-900' title='Edit Coupon'>
            <PencilIcon size={20} />
          </button>
          <button onClick={() => onDelete(row)} className='text-red-600 hover:text-red-900' title='Delete Coupon'>
            <TrashIcon size={20} />
          </button>
        </div>
      )
    },
  ];

  return columns;
}
export default useCouponTableColumns