
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AdminSidebar from '../components/AdminSidebar.jsx';
import authStore from '../stores/authStore.js';
import { toast } from 'react-toastify';


function AdminLayout() {
  const navigate = useNavigate();
  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const userRole = authStore((state) => state.user?.role);
  const checkAuth = authStore((state) => state.checkAuth); 

  
  useEffect(() => {
    
    checkAuth(); 
    
    
    const currentToken = authStore.getState().token;
    const currentUserRole = authStore.getState().user?.role;

    if (!currentToken || (currentUserRole !== 'ADMIN' && currentUserRole !== 'SUPERADMIN')) {
      toast.error("Access Denied. You must be an Administrator to view this page.");
      navigate('/login', { replace: true }); 
    }
  }, [navigate, isLoggedIn, userRole, checkAuth]); 




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