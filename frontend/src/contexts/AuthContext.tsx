import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/api/api";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  email: string;
  role: string;
  tenantId: number | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- RESTORE SESSION ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post("/api/auth/login", { email, password });

    const userData: User = {
      id: res.data.id,
      email: res.data.email,
      role: res.data.role,
      tenantId: res.data.tenantId,
    };

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    toast({
      title: "Login successful",
      description: `Welcome ${email}`,
    });

    return userData;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    setUser(null);

    toast({ title: "Logged out" });

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
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
