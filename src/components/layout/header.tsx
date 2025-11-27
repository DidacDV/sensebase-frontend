import { Link } from "react-router";
import senseBaseLogo from "../../assets/sensebaseLogo.png";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={senseBaseLogo} alt="sensebase logo" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold text-[#0A1A2F]">sensebase</span>
        </Link>

        {/* Center Navigation */}
        <ul className="hidden lg:flex items-center gap-8 text-[#0A1A2F] text-sm font-medium">
          <li><Link to="/demo" className="hover:text-gray-600 transition-colors">Demo</Link></li>
          <li><Link to="/new" className="hover:text-gray-600 transition-colors">New Board</Link></li>
          <li><Link to="/boards" className="hover:text-gray-600 transition-colors">Your Boards</Link></li>
          <li><Link to="/pricing" className="hover:text-gray-600 transition-colors">Pricing</Link></li>
          <li><Link to="/support" className="hover:text-gray-600 transition-colors">Support</Link></li>
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/signin"
            className="text-[#0A1A2F] text-sm font-medium hover:text-gray-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/get-started"
            className="
              bg-[#0A1A2F]
              text-white
              text-sm
              font-semibold 
              px-5 py-2 
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
