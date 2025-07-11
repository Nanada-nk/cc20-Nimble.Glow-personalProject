import { Link, useNavigate } from "react-router"
import NimbleGlowLogo from "/src/components/NimbleGlowLogo.jsx"
import { User, ShoppingCart, Menu, LogOut, Store } from "lucide-react"
import { toast } from "react-toastify"
import authStore from "../stores/authStore.js"
import useCartStore from "../stores/cartStore.js"
import { useEffect } from "react"


function Header() {

  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const actionLogout = authStore((state) => state.actionLogout);
  const { itemCount, fetchCart, toggleCart } = useCartStore()
  const navigate = useNavigate();

  const handleLogout = () => {
    actionLogout();
    toast.success("You have been logged out.");
    navigate("/")
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

  return (
    <header className="sticky top-0 z-50 bg-bg-cr4 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NimbleGlowLogo className="w-[150px]" />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="text-gray-600 hover:text-pri-gr1">
              <Store size={20} />
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-pri-gr1" title="My Profile">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-pri-gr1" title="Logout">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-pri-gr1" title="Login">
                <User size={20} />
              </Link>
            )}

            <button onClick={toggleCart} className="text-gray-600 hover:text-pri-gr1 relative">
              <ShoppingCart size={25} className="relative" />
              {isLoggedIn && itemCount > 0 && (
                <div className="absolute bg-bg-cr flex items-center justify-center w-6 h-6 top-2 -right-4 rounded-full text-red-500 font-bold text-md">
                  {itemCount}
                </div>
              )}
            </button>




          </div>


          <div className="md:hidden">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <Menu size={24} className="text-gray-600" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-bg-cr3 rounded-box w-52 mt-3 z-[1] text-pri-gr1"
              >

                {isLoggedIn ? (
                  <>
                    <li><Link to="/profile">My Profile</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </>
                ) : (
                  <li><Link to="/login">Login</Link></li>
                )}


                <div className="divider my-1" />
                <li className="menu-title">
                  <span>Shop by Category</span>
                </li>
                <li><Link to="/categories">All Categories</Link></li>
                <li><Link to="/category/essential">Essential Series</Link></li>
                <li><Link to="/category/supplement">Supplement Series</Link></li>
                <li><Link to="/category/lip">Lip Series</Link></li>
                <li><Link to="/category/body">Body Series</Link></li>
                <div className="divider my-1" />
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
