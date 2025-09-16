import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { loginUser} from "../services/authService";
import apiClient from "../lib/axios/axios";
import type { LoginPayload } from "../types/Auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicia en true para verificar el token
  const navigate = useNavigate();

  useEffect(() => {
    // Comprobar si existe un token al cargar la app
    const token = Cookies.get("access_token");
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Finaliza la carga inicial
  }, []);

  const login = async (credentials: LoginPayload) => {
    const data = await loginUser(credentials);
    if (data.access_token) {
      // Guardar tokens en cookies
      Cookies.set("access_token", data.access_token, { expires: 1, secure: true }); // Expira en 1 día
      Cookies.set("refresh_token", data.refresh_token, { expires: 7, secure: true }); // Expira en 7 días

      // Configurar el header de autorización para futuras peticiones
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      setIsAuthenticated(true);
      navigate("/menu");
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    delete apiClient.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};