import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(); // Cria o contexto de autenticação

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [userId, setUserId] = useState(null); // Estado do ID do usuário

  // Função para fazer login
  const login = (token, id) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("token", token); // Armazena o token no localStorage
  };

  // Função para fazer logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("token"); // Remove o token do localStorage
  };

  // Provedor do contexto de autenticação
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
