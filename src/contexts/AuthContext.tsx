import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { isAuthenticated as checkAuth, getCurrentUser, logout as authLogout, User } from "../api/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {},
  setIsLoggedIn: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        // For GitHub Pages, we'll use mock data
        if (window.location.hostname === 'srishirana.github.io') {
          const mockUser = localStorage.getItem('user');
          if (mockUser) {
            setUser(JSON.parse(mockUser));
            setIsLoggedIn(true);
          }
          setLoading(false);
          return;
        }

        // For local development with real backend
        const userAuth = checkAuth();
        if (userAuth) {
          const userData = getCurrentUser();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Use setTimeout to ensure the app renders first
    const timer = setTimeout(() => {
      initAuth();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn,
        user,
        loading,
        logout,
        setUser,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
