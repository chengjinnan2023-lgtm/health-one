// Health One — Auth context (JWT token + staff state).

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api, type LoginResponse, type StaffInfo } from "../api/client";

interface AuthState {
  staff: StaffInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffInfo | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("access_token"),
  );

  const login = useCallback(async (username: string, password: string) => {
    const data = await api.post<LoginResponse>("/api/auth/login", {
      username,
      password,
    });
    localStorage.setItem("access_token", data.access_token);
    setToken(data.access_token);
    setStaff(data.staff);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken(null);
    setStaff(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ staff, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
