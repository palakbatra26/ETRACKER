import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { setAccessToken } from '../api/axios.js';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      const me = await api.get('/auth/me');
      setUser(me.data.user);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };
  const logout = async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
