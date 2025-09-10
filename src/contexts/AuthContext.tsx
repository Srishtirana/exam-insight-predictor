
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
      const userAuth = isAuthenticated();
      if (userAuth) {
        const userData = getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    initAuth();
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
