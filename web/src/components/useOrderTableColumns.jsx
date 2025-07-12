import { ImageIcon, PencilIcon } from 'lucide-react';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'DELIVERED':
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'PENDING_PAYMENT':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

function useOrderTableColumns({ onEdit }) {
  const columns = [
    { name: 'Order #', selector: row => row.orderNumber, sortable: true },
    { name: 'Customer', selector: row => `${row.cart.user.firstName} ${row.cart.user.lastName}`, sortable: true },
    {
      name: 'Proof of payment',
      cell: row => (
        row.payment?.slipImageUrl ? (
          <a href={row.payment.slipImageUrl} target="_blank" rel="noopener noreferrer">
            <ImageIcon size={20} className="text-blue-500 hover:text-blue-700" />
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        )
      )
    },
    {
      name: 'Discount',
      selector: row => row.orderDiscount,
      sortable: true,
      cell: row => (
        <span className={row.orderDiscount > 0 ? 'text-red-600' : 'text-gray-400'}>
          {row.orderDiscount.toFixed(2)}
        </span>
      )
    },
    {
      name: 'Total',
      selector: row => (row.payment?.amount ?? row.cartTotal),
      sortable: true,
      cell: row => (row.payment?.amount ?? row.cartTotal).toFixed(2)
    },
    { name: 'Coupon Used', selector: row => row.coupon?.code || 'N/A', sortable: true },
    {
      name: 'Order Status',
      selector: row => row.orderStatus,
      sortable: true,
      cell: row => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(row.orderStatus)}`}>
          {row.orderStatus.replace('_', ' ')}
        </span>
      ),
    },
    {
      name: 'Tracking #',
      selector: row => row.shipping?.trackingNumber,
      sortable: true,
      cell: row => row.shipping?.trackingNumber || <span className="text-gray-400">N/A</span>
    },
    {
      name: 'Payment',
      selector: row => row.payment?.status || 'N/A',
      sortable: true,
      cell: row => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(row.payment?.status)}`}>
          {row.payment?.status || 'NOT_PAID'}
        </span>
      ),
    },
    { name: 'Date', selector: row => new Date(row.createdAt).toLocaleString('th-TH'), sortable: true },
    {
      name: 'Action',
      cell: row => (
        <button onClick={() => onEdit(row)} className='text-blue-600 hover:text-blue-900' title='Edit Order Status'>
          <PencilIcon size={20} />
        </button>
      )
    },
  ];

  return columns;
}



export default useOrderTableColumns;