import { useEffect } from "react";

// context
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext";
import { useTheme } from "./context/ThemeContext"; // Adicionando importação

// pages
import Dashboard from "./pages/Dashboard";

// components
import Auth from "./pages/Auth";
import HeaderComponent from "./components/Header";
import Loading from "./components/Loading";

function App() {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const { fetchTodos } = useTodo();
  const { theme } = useTheme(); // Adicionando uso do hook

  useEffect(() => {
    // Aplica o tema na tag <body>
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    // Pedido de Permissão de Notificação
    // Melhoramos a condição para que peça SOMENTE se a permissão não foi concedida/negada
    if (
      "Notification" in window &&
      Notification.permission === "default" &&
      isAuthenticated
    ) {
      Notification.requestPermission();
    }

    // Busca de Tarefas
    // Só busca tarefas se autenticado e não estiver carregando os dados do usuário
    if (isAuthenticated && !isLoadingUser) {
      fetchTodos();
    }
    
  }, [isAuthenticated, fetchTodos, isLoadingUser]); 

  if (isLoadingUser) {
    // Mostra um loader em tela cheia enquanto carrega os dados do usuário
    return (
      <div className="container-app-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container-app">
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <>
          <section className="app-main">
            <HeaderComponent />
            <Dashboard />
          </section>
        </>
      )}
    </div>
  );
}

export default App;
