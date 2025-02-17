import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string; 
}

interface AuthContextType {
  user: UserType | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < currentTime) {
        console.warn("Token expirado. Cerrando sesión.");
        logout();
        return;
      }

      // 🔹 Obtener los datos del usuario desde la API
      const response = await api.get("/users/me");
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role, // 🔹 Asegúrate de que el backend envíe `role`
      });
    } catch (error) {
      console.error("Error verificando el token:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    sessionStorage.setItem("token", token);
    setLoading(true);
    await verifyToken(token);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Personaliza esto según tus necesidades
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
