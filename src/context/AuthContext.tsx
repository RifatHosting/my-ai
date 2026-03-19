import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('rifat_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
        });
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, accept any email/password
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('rifat_user', JSON.stringify(newUser));
    return true;
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('rifat_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rifat_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('rifat_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }}>
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
