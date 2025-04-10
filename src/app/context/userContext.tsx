"use client"
import { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';

// Define the shape of the user data
interface UserData {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'super-admin';
  university: string;
  rso: string[];
}

// Define the shape of the context
interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoggedIn: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props for the UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserData) => {
    // Save to state and localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // Clear from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    setUser,
    isLoggedIn: !!user,
    login,
    logout
  };

  // Optionally show a loading state while checking for stored user
  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for consuming the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};