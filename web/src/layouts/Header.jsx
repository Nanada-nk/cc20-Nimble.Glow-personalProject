import { Link } from "react-router"
import NimbleGlowLogo from "/src/components/NimbleGlowLogo.jsx"
import { Search, User, ShoppingCart, Menu } from "lucide-react"

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-cr4 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NimbleGlowLogo className="w-[150px]" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-gray-600 hover:text-pri-gr1">
              <Search size={20} />
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-pri-gr1">
              <User size={20} />
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-pri-gr1">
              <ShoppingCart size={20} />
            </Link>
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
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li className="menu-title">
                  <span>Shop by Category</span>
                </li>
                <li>
                  <Link to="/category/essential">Essential Series</Link>
                </li>
                <li>
                  <Link to="/category/supplement">Supplement Series</Link>
                </li>
                <li>
                  <Link to="/category/lip">Lip Series</Link>
                </li>
                <li>
                  <Link to="/category/body">Body Series</Link>
                </li>
                <div className="divider my-1" />
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
                <li>
                  <button onClick={() => alert("Logout!")}>Logout</button>
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
