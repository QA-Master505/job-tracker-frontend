import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axiosConfig";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    setUser({ email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (username, email, password) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
