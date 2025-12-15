import { Link } from "react-router";
import senseBaseLogo from "../../assets/sensebaseLogo.png";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={senseBaseLogo} alt="sensebase logo" className="h-14 w-14 object-contain" />
          <span className="text-xl font-bold text-[#0A1A2F]">sensebase</span>
        </Link>

        {/* Center Navigation */}
        <ul className="hidden lg:flex items-center gap-10 text-[#0A1A2F] text-base font-medium">
          <li><Link to="/demo" className="hover:text-gray-600 transition-colors">Demo</Link></li>
          <li><Link to="/boards/new" className="hover:text-gray-600 transition-colors">New Board</Link></li>
          <li><Link to="/boards" className="hover:text-gray-600 transition-colors">Your Boards</Link></li>
          <li><Link to="/pricing" className="hover:text-gray-600 transition-colors">Pricing</Link></li>
          <li><Link to="/support" className="hover:text-gray-600 transition-colors">Support</Link></li>
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-[#0A1A2F] text-base font-medium hover:text-gray-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="
              bg-[#0A1A2F]
              text-white
              text-base
              font-semibold 
              px-7 py-3 
              rounded-md
              hover:bg-[#1a2a3f]
              transition-colors
              duration-200
            "
          >
            Get Started
          </Link>
        </div>

      </nav>
    </header>
  );
}
