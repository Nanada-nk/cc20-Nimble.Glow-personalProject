import { Link } from "react-router"

function Footer() {
  return (
    <footer className="bg-[#677e52] text-white pt-12 pb-8">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">About Nimble.Glow</h3>
          <p className="text-sm text-gray-300">
            Welcome to Nimble.Glow. The intention is to be a driving force for consumers to truly get to know their own
            skin. Because nowadays, marketing in the skincare industry or most brands often try to present skin
            problems, create, claim or create new beauty standards.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white">
                HOME
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-gray-300 hover:text-white">
                SHOP
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-white">
                ABOUT US
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Customer Service</h3>
          <p className="text-sm text-gray-300">
            Have questions or need assistance? Our dedicated customer service team is here to help. Contact us.
          </p>
          <p className="text-sm text-gray-300 mt-2">Phone: 9045570623</p>
          <p className="text-sm text-gray-300">nimble.glow@gmail.com</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 border-t border-gray-500 pt-6 text-center text-sm text-gray-300">
        <p>Nimble-Glow-Beauty © 2023 Nimble-Glow. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
