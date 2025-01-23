import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { id: number; name: string; email: string } | null;
  login: (user: { id: number; name: string; email: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  const login = (user: { id: number; name: string; email: string }) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
