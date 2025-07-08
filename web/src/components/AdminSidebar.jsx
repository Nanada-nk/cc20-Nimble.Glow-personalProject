
import { Link, useLocation, useNavigate } from "react-router"; 
import { TrashIcon } from 'lucide-react'; 


import authStore from "../stores/authStore";
import { toast } from "react-toastify"; 



const ADMIN_NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard' }, 
  { path: '/admin/products', label: 'Product Management' },
  { path: '/admin/orders', label: 'Order Management' },
  { path: '/admin/users', label: 'Customer Management' },
  { path: '/admin/categories', label: 'Category Management' },
  { path: '/admin/coupons', label: 'Coupon Management' },
  { path: '/admin/reviews', label: 'Review Management' },
];


function AdminSidebar() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const actionLogout = authStore((state) => state.actionLogout); 

  const handleLogout = () => {
    actionLogout();
    toast.success("Logged out successfully!");
    navigate("/login"); 
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex-shrink-0 mb-8">
         
          <Link to="/admin">
              <h2 className="text-2xl font-bold text-pri-gr1">Nimble.Glow</h2>
          </Link>
      </div>
      <nav className="flex-grow">
        <ul>
          {ADMIN_NAV_LINKS.map((link) => (
            <li key={link.path} className="mb-2">
              <Link 
                to={link.path} 
               
                className={`block p-2 rounded hover:bg-gray-700 ${location.pathname === link.path ? 'bg-gray-700' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button 
          onClick={handleLogout} 
          className="w-full text-left p-2 rounded hover:bg-gray-700 flex items-center"
        >
          <TrashIcon size={18} className="mr-2" /> Logout 
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;