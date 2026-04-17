import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!localStorage.getItem("token")) { setLoading(false); return; }
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const loginUser  = (token, userData) => { localStorage.setItem("token", token); setUser(userData); };
  const logoutUser = () => { localStorage.removeItem("token"); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
