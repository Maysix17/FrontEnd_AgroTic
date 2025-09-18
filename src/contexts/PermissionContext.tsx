import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { logoutUser, loginUser, refreshToken, getToken, decodeToken } from '../services/authService';
import type { User, Permission, DecodedToken, LoginPayload } from '../types/Auth';
import { setupAxiosInterceptors } from '../lib/axios/axios';

interface PermissionContextType {
  decodedToken: DecodedToken | null;
  user: DecodedToken | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  hasPermission: (modulo: string, recurso: string, accion: string) => boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: DecodedToken | null) => void;
  setPermissions: (permissions: Permission[]) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const hasPermission = (modulo: string, recurso: string, accion: string): boolean => {
    return permissions.some(p => p.modulo === modulo && p.recurso === recurso && p.accion === accion);
  };

  const login = async (payload: LoginPayload): Promise<void> => {
    try {
      const decoded = await loginUser(payload);
      setDecodedToken(decoded);
      setUser(decoded);
      setPermissions(decoded.permisos);

      console.log('Login successful:', decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const refresh = async (): Promise<void> => {
    try {
      const decoded = await refreshToken();
      setDecodedToken(decoded);
      setUser(decoded);
      setPermissions(decoded.permisos);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      setDecodedToken(null);
      setUser(null);
      setPermissions([]);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally handle logout failure
    }
  };

  useEffect(() => {
    setupAxiosInterceptors(refresh);
    const token = getToken();
    if (token) {
      try {
        const decoded = decodeToken(token);
        setDecodedToken(decoded);
        setUser(decoded);
        setPermissions(decoded.permisos);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        // Optionally logout or clear
      }
    }
  }, []);

  const value: PermissionContextType = {
    decodedToken,
    user,
    permissions,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    refresh,
    setUser,
    setPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};