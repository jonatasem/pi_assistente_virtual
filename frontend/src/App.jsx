import { useEffect } from "react";
import Auth from "./components/Auth/Auth";
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext";
import LogoutButton from "./components/LogoutButton";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader"; // 💡 IMPORTAR Loader

function App() {
  const { isAuthenticated, isLoadingUser } = useAuth(); // 💡 USAR isLoadingUser
  const { fetchTodos } = useTodo();

  useEffect(() => {
    // 1. Pedido de Permissão de Notificação
    if ("Notification" in window && Notification.permission !== "granted" && isAuthenticated) {
      Notification.requestPermission();
    }

    // 2. Busca de Tarefas
    // Só busca tarefas se autenticado e não estiver carregando os dados do usuário
    if (isAuthenticated && !isLoadingUser) {
      fetchTodos();
    }
  }, [isAuthenticated, fetchTodos, isLoadingUser]);

  if (isLoadingUser) {
    // Mostra um loader em tela cheia enquanto carrega os dados do usuário
    return (
      <div className="container-app-full-center">
        <Loader />
        <p>Carregando sessão...</p>
      </div>
    );
  }

  return (
    <div className="container-app">
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <>
          <LogoutButton />
          <Dashboard />
        </>
      )}
    </div>
  );
}

export default App;
