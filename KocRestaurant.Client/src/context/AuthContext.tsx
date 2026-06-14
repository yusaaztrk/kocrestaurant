import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios Defaults
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5188/api';
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true; // Send cookies (HttpOnly refresh token)

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, username: string, role: string) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (jwtToken: string, user: string, userRole: string) => {
    localStorage.setItem('accessToken', jwtToken);
    localStorage.setItem('username', user);
    localStorage.setItem('role', userRole);
    setToken(jwtToken);
    setUsername(user);
    setRole(userRole);
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      clearAuth();
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await axios.post('/auth/refresh');
      const { token: newAccessToken, username: user, role: userRole } = response.data;
      login(newAccessToken, user, userRole);
      return true;
    } catch (err) {
      console.warn('Session refresh failed. Admin session is inactive.');
      clearAuth();
      return false;
    }
  };

  // Setup Axios interceptors to attach token and refresh on 401
  useEffect(() => {
    // Request Interceptor: Attach access token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken && config.headers) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Refresh token on 401
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If 401 error, and we haven't retried yet, and we have a path that is not login or refresh
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
          originalRequest._retry = true;
          
          try {
            // Attempt silent refresh using HttpOnly cookie
            const response = await axios.post('/auth/refresh');
            const { token: newAccessToken, username: user, role: userRole } = response.data;
            
            // Save new tokens
            login(newAccessToken, user, userRole);
            
            // Retry the original request with new Authorization header
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            clearAuth();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Initial check: Try to refresh session on load to restore login
    const checkSession = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        // Double check if session is active or needs refresh
        try {
          await refreshSession();
        } catch {
          // If refresh failed, state is cleared inside refreshSession
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    token,
    username,
    role,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
