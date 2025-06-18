import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login, logout, register } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register a new user
  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const response = await register(userData);
      setUser(response);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (userData) => {
    try {
      setLoading(true);
      const response = await login(userData);
      setUser(response);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    logout();
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
