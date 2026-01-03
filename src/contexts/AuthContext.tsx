
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, isAuthenticated, logout } from "../api/auth";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  setUser: () => {},
  setIsLoggedIn: () => {},
  logout: () => {},
});

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
        const userAuth = isAuthenticated();
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

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        setUser,
        setIsLoggedIn,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
