import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { login as loginApi } from "../../api/auth";
import { SESSION_KEY as STORAGE_KEY } from "../../api/client";

const AuthContext = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  // Funciones con los datos de la sesion
  const login = useCallback(async (email, password) => {
    const usuario = await loginApi(email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    setUser(usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  
  const value = useMemo(
    () => ({ user, isAdmin: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
