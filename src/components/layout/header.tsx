import { Link } from "react-router";
import senseBaseLogo from "../../assets/sensebaseLogo.png";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="w-full px-2 py-2 flex items-center justify-between">
        
        {/* Logo Placeholder */}
        <Link to="/" className="flex items-center gap-2">
          <img src={senseBaseLogo} alt="sensebase logo" className="h-14 w-14 object-contain" />
          <span className="text-xl font-bold text-[#0A1A2F]">sensebase</span>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-[#0A1A2F] font-medium">
          <li><Link to="/demo" className="hover:text-blue-600">Demo</Link></li>
          <li><Link to="/boards/new" className="hover:text-blue-600">New Board</Link></li>
          <li><Link to="/boards" className="hover:text-blue-600">Your Boards</Link></li>
          <li><Link to="/pricing" className="hover:text-blue-600">Pricing</Link></li>
          <li><Link to="/support" className="hover:text-blue-600">Support</Link></li>
          <li><Link to="/signin" className="hover:text-blue-600">Sign In</Link></li>
        </ul>

        {/* Get Started Button */}
        <Link
          to="/get-started"
          className="
            hidden md:block 
            bg-gradient-to-br from-[#C7E3FF] to-[#A4CCF5] 
            text-[#0A1A2F] 
            font-semibold 
            px-5 py-2 
            rounded-full 
            shadow-sm 
            hover:shadow-md 
            hover:brightness-105 
            transition-all 
            duration-200
          "
        >
          Get Started
        </Link>

      </nav>
    </header>
  );
}
