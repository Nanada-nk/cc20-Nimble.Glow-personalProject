import { Star } from 'lucide-react';


const renderRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} size={16} className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
    );
  }
  return <div className="flex">{stars}</div>;
};

function useReviewTableColumns() {
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    {
      name: 'Product',
      selector: row => row.product?.title || 'N/A',
      sortable: true,
      wrap: true
    },
    {
      name: 'Rating',
      selector: row => row.rating,
      sortable: true,
      cell: row => renderRating(row.rating)
    },
    { name: 'Comment', selector: row => row.comment, wrap: true },
    {
      name: 'User',
      selector: row => row.user?.firstName || 'N/A',
      sortable: true
    },
    {
      name: 'Date',
      selector: row => row.reviewDate,
      sortable: true,
    },
  ];
  return columns;
}

export default useReviewTableColumns;