import { useEffect, useState, useCallback } from 'react';
import { toast } from "react-toastify";
import DataTable from 'react-data-table-component';
import { BubblesIcon } from 'lucide-react';

import authStore from '../../stores/authStore.js';
import reviewsApi from '../../api/reviewsApi.js';
import useReviewTableColumns from '../../components/useReviewTableColumns.jsx';
import SearchInput from '../../components/SearchInput.jsx';

function AdminReviewManagementPage() {
  const token = authStore((state) => state.token);

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp = await reviewsApi.getAllReviews(token);
      setReviews(resp.data.reviews || []);
    } catch (err) {
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const columns = useReviewTableColumns();

  const filteredReviews = reviews.filter(review =>
    (review.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (review.productOnOrder?.product?.title.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (review.user?.firstName.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
      </header>

      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by comment, product, or user email..."
      />

      <DataTable
        columns={columns}
        data={filteredReviews}
        pagination
        responsive
        highlightOnHover
      />
    </div>
  );
}

export default AdminReviewManagementPage;