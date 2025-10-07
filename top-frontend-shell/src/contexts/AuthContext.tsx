import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database - for demonstration purposes
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    name: 'Regular User',
    email: 'user@example.com',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.username === credentials.username && u.password === credentials.password
        );

        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          const authenticatedUser: User = userWithoutPassword;

          setUser(authenticatedUser);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          localStorage.setItem('authToken', `mock-token-${authenticatedUser.id}`);
          resolve();
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
