import { createContext, useContext, useState } from "react";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token")); 
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  const [user, setUser] = useState(null); // Novo estado para armazenar os dados do usuário
  const token = localStorage.getItem("token");

  const fetchUserDetails = async (id, currentToken) => {
    if (!id || !currentToken) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}` 
        }
      });

      const userData = await response.json();

      if (response.ok) {
        setUser(userData); // Armazena os dados do usuário
      } else {
        console.error("Error fetching user details:", userData.msg);
      }
    } catch (err) {
      console.error('Network error fetching user details:', err);
    }
  };

  const login = (token, id) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("token", token); 
    localStorage.setItem("userId", id); 
    fetchUserDetails(id, token); // Busca os detalhes do usuário após o login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    localStorage.removeItem("token"); 
    localStorage.removeItem("userId"); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, user }}>
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
