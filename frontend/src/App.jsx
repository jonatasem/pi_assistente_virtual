//dependencies
import { useEffect } from "react";

//context
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext";

//pages
import Dashboard from "./pages/Dashboard";

//components
import Auth from "./pages/Auth";
import HeaderComponent from "./components/Header";
import Loading from "./components/Loading";

function App() {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const { fetchTodos } = useTodo();

  useEffect(() => {
    // 1. Pedido de Permissão de Notificação
    if (
      "Notification" in window &&
      Notification.permission !== "granted" &&
      isAuthenticated
    ) {
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
