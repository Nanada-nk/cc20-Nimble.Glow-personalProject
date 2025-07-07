import { Link } from "react-router"


const NimbleGlowLogo = ({ className }) => {
  return (
    <Link to="/" className={`flex items-center justify-center ${className}`}>
      <img
        src="https://res.cloudinary.com/dhoyopcr7/image/upload/v1751854695/logo_bp3ha8.png"
        alt="Nimble.Glow Logo"
        className="w-full h-auto"
      />
    </Link>
  )
}

export default NimbleGlowLogo
