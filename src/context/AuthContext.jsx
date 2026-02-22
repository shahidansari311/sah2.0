import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 1400));
    if (email && password.length >= 6) {
      setUser({ name: email.split('@')[0].replace(/[^a-z]/gi, ' ').replace(/\b\w/g, c => c.toUpperCase()), email, avatar: email[0].toUpperCase(), plan: 'Pro', joined: 'Feb 2026' });
      setLoading(false); return true;
    }
    setError('Invalid credentials. Try any email + 6+ char password.');
    setLoading(false); return false;
  };

  const signup = async (name, email, password) => {
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 1600));
    if (name && email && password.length >= 6) {
      setUser({ name, email, avatar: name[0].toUpperCase(), plan: 'Free', joined: 'Feb 2026' });
      setLoading(false); return true;
    }
    setError('Please fill all fields. Password must be 6+ characters.');
    setLoading(false); return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
