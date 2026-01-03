
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-exam-purple flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q♡</span>
          </div>
          <span className="text-xl font-semibold text-exam-dark-purple">QUIZYFY</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-exam-purple transition-colors">
            Home 🏠︎
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-exam-purple transition-colors">
                Dashboard ✈︎
              </Link>
              <Button variant="outline" onClick={logout}>
                Log Out ⍈
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-gray-700 hover:text-exam-purple transition-colors">
                Log In ⟳
              </Link>
              <Link to="/auth">
                <Button>Sign Up ✓</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button - we'd implement a proper mobile menu in production */}
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
