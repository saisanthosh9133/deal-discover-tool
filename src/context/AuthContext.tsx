import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "authToken";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyToken = async (tokenToVerify?: string) => {
    try {
      const currentToken = tokenToVerify || token;
      if (!currentToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setToken(currentToken);
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        const newToken = response.data.token;
        localStorage.setItem(STORAGE_KEY, newToken);
        setToken(newToken);
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        const newToken = response.data.token;
        localStorage.setItem(STORAGE_KEY, newToken);
        setToken(newToken);
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default api;
