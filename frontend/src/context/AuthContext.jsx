import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || null,
  );
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const fetchUserDetails = async (currentToken) => {
    if (!currentToken) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Tentativa de ler a mensagem de erro do backend, se houver.
        const errorData = await response.json();
        console.error(
          "Erro ao buscar detalhes do usuário:",
          errorData.msg || response.statusText,
        );
      }
    } catch (err) {
      console.error("Erro de rede ao buscar detalhes do usuário:", err);
    }
  };

  // Efeito para buscar detalhes do usuário ao iniciar a aplicação (hidratação)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId && !user && !isLoadingUser) {
      setIsLoadingUser(true);
      fetchUserDetails(storedToken).finally(() => {
        setIsLoadingUser(false);
      });
    }
  }, [userId]);

  const login = (token, id) => {
    setIsAuthenticated(true);
    setUserId(id);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    // A chamada a fetchUserDetails é feita no useEffect
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userId, user, isLoadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
