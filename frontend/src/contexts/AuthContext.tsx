import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "@/api/api";

type User = {
  userId: number;
  email: string;
  role: string;
  tenantId: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);

    if (!res.token) {
    throw new Error("Invalid login response");
    }

    setToken(res.token);
    setUser({
      userId: res.userId,
      email: res.email,
      role: res.role,
      tenantId: res.tenantId,
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: res.userId,
        email: res.email,
        role: res.role,
        tenantId: res.tenantId,
      })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "ROLE_ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
