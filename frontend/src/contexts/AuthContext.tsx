import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { User, AuthState } from '@/types';
import api from '@/services/api';

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start as loading to check existing token
  });

  // ✅ Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // ✅ Login
  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, userId, tenantId, role, email: userEmail } = response.data;

      localStorage.setItem('token', token);

      const user: User = {
        id: userId.toString(),
        email: userEmail,
        name: userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        role: role.toLowerCase() as 'user' | 'admin',
        status: 'active',
        createdAt: new Date(),
      };

      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user }; // ✅ return user here
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      let errorMessage = 'Invalid credentials';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data || 'User account inactive';
      } else if (error.response?.data) {
        errorMessage =
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || 'Login failed';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  // ✅ Register
  const register = useCallback(async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/auth/register', { email, password, name });
      const { token, userId, role } = response.data;

      localStorage.setItem('token', token);

      const newUser: User = {
        id: userId.toString(),
        email,
        name,
        role: role.toLowerCase() as 'user' | 'admin',
        status: 'active',
        createdAt: new Date(),
      };

      localStorage.setItem('user', JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true, user: newUser }; // ✅ return user
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        errorMessage =
          typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || errorMessage;
      }

      return { success: false, error: errorMessage };
    }
  }, []);

  // ✅ Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
