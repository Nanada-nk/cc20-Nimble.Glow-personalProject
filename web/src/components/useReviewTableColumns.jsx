import { Heart } from 'lucide-react';


const renderRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Heart key={i} size={16} className={ i <= rating ? 'text-pri-gr2 fill-pri-gr2' : 'text-pri-gr2'} />
    );
  }
  return <div className="flex">{stars}</div>;
};

function useReviewTableColumns() {
  const columns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    {
      name: 'Product',
      selector: row => row.productOnOrder?.product?.title || 'N/A',
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
      selector: row => new Date(row.reviewDate).toLocaleString('th-TH'),
      sortable: true,
    },
  ];
  return columns;
}

export default useReviewTableColumns;