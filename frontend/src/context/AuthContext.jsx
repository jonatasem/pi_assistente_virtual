import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  }); 
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  }); 

  const login = (token, id) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("token", token); 
    localStorage.setItem("userId", id); // CRÍTICO: Armazena o userId para uso futuro
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("token"); 
    localStorage.removeItem("userId"); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};