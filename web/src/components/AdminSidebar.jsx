
import { Link, useLocation, useNavigate } from "react-router";
import { ChartColumnStackedIcon, FolderCog, PackageSearch, Star, Ticket, TrashIcon, UsersRound } from 'lucide-react';
import authStore from "../stores/authStore";
import { toast } from "react-toastify";
import NimbleGlowLogo from "./NimbleGlowLogo";



const adminNavLinks = [
  { path: '/admin/users', label: 'Customer Management', icon: <UsersRound size={18} /> },
  { path: '/admin/categories', label: 'Category Management', icon: <ChartColumnStackedIcon size={20} /> },
  { path: '/admin/products', label: 'Product Management', icon: <PackageSearch size={20} /> },
  { path: '/admin/orders', label: 'Order Management', icon: <FolderCog size={20} /> },
  { path: '/admin/coupons', label: 'Coupon Management', icon: <Ticket size={20} /> },
  { path: '/admin/reviews', label: 'Review Management', icon: <Star size={20} /> },
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
    <div className="w-64 bg-pri-gr1 text-white p-4 flex flex-col">
      <div className="flex-shrink-0 mb-8">


        <NimbleGlowLogo />

      </div>
      <nav className="flex-grow">
        <ul>
          {adminNavLinks.map((linker) => (
            <li key={linker.path} className="mb-2">
              <Link
                to={linker.path}

                className={`flex items-center gap-2 p-2 rounded hover:bg-green-950  ${location.pathname === linker.path ? 'bg-green-950' : ''}`}
              >
                {linker.icon} {linker.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-left p-2 rounded hover:bg-green-950 flex items-center"
        >
          <TrashIcon size={18} className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;