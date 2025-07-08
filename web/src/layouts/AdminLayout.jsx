import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AdminSidebar from '../components/AdminSidebar.jsx';
import authStore from '../stores/authStore.js';
import { toast } from 'react-toastify';
import { BubblesIcon } from 'lucide-react';


function AdminLayout() {
  const navigate = useNavigate();
  const token = authStore(state => state.token)
  const checkAuth = authStore(state => state.checkAuth)
  const isLoading = authStore(state => state.isLoading)
  const user = authStore(state => state.user)


  const handleAccessControl = () => {
    checkAuth()
    if (isLoading) return;
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (token && user && (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      toast.error("Access Denied. You must be an Administrator to view this page.");
      navigate('/', { replace: true });
    }
  }

  useEffect(() => {
    handleAccessControl()
  }, []);


  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <BubblesIcon className="w-10 h-10 animate-spin text-pri-gr1" />
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;