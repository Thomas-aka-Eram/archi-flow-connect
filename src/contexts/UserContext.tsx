import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '@/lib/api';

interface User {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // The interceptor handles the token now
          const response = await apiClient.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          logout(); // Clear state if token is invalid
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Apply theme from user preferences
  useEffect(() => {
    if (user?.theme) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'system'); // Remove existing themes
      root.classList.add(user.theme); // Add the new theme
    } else {
      // Default to system theme if no user theme is set
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add('system');
    }
  }, [user?.theme]);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await apiClient.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile after login', error);
      // Handle error appropriately, maybe logout user
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};