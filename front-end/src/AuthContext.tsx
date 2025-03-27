import React, { createContext, useEffect, useState, ReactNode } from "react";

interface User {
  role: string;
}

interface AuthContextType {
  isAuth: boolean;
  isAdmin: User | null;
  setIsAuth: (value: boolean) => void;
  setIsAdmin: (value: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);  // Start with `false`
  const [isAdmin, setIsAdmin] = useState<User | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsAuth(true);
      setIsAdmin(parsedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isAdmin, setIsAuth, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
