import { createContext, useContext, useState, useEffect } from 'react';
import {
  apiLogin, apiRegister, apiGetMe,
  setToken, getToken, removeToken,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Re-hydrate user from stored token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setHydrated(true); return; }
    apiGetMe()
      .then(u => setUser(u))
      .catch(() => removeToken())
      .finally(() => setHydrated(true));
  }, []);

  const login = async (email, password) => {
    setLoading(true); setError('');
    try {
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
      setLoading(false);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true); setError('');
    try {
      const data = await apiRegister(name, email, password);
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, setError, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
