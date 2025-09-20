import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
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
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiClient.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

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