import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService, User } from '../services/db';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('virtualClosetUser');
        
        if (savedUser) {
          const { id } = JSON.parse(savedUser);
          const user = await userService.getUser(id);
          
          if (user) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem('virtualClosetUser');
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if email already exists
      // Note: In a real app, we would check this server-side
      // Since we're using IndexedDB, we're simplifying this check
      
      // Create user with default preferences
      const userId = await userService.createUser({
        name,
        email,
        preferences: {
          darkMode: false
        }
      });
      
      // Store credentials in localStorage (in a real app, never store passwords in plain text)
      localStorage.setItem('virtualClosetUser', JSON.stringify({ 
        id: userId, 
        email, 
        // We'd normally never store the password, but since this is a demo with no backend:
        password: btoa(password) // Base64 encoding for minimal obfuscation
      }));
      
      // Get the user we just created
      const user = await userService.getUser(userId);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be a server request
      // For this demo, we'll check localStorage
      const users = localStorage.getItem('virtualClosetUser');
      
      if (!users) {
        setError('Invalid email or password');
        return false;
      }
      
      const userData = JSON.parse(users);
      if (userData.email === email && atob(userData.password) === password) {
        const user = await userService.getUser(userData.id);
        if (user) {
          setCurrentUser(user);
          return true;
        }
      }
      
      setError('Invalid email or password');
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('virtualClosetUser');
    setCurrentUser(null);
  };

  const updateUserProfile = async (updatedUser: Partial<User>): Promise<void> => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const updatedUserData = { ...currentUser, ...updatedUser };
      await userService.updateUser(updatedUserData);
      setCurrentUser(updatedUserData);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      isLoading,
      error,
      login,
      signup,
      logout,
      updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};