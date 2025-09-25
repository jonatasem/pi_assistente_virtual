import { useEffect } from "react";
import ThemeToggle from "./components/Themes";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Auth from "./components/Auth/Auth";
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext"; // Importa o contexto de tarefas

function App() {
  const { isAuthenticated } = useAuth(); // Obtém o estado de autenticação
  const { fetchTodos } = useTodo(); // Obtém a função para buscar tarefas

  useEffect(() => {
    // Solicita permissão para notificações
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);
  
  useEffect(() => {
    // Busca tarefas somente se o usuário estiver autenticado
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, fetchTodos]); // Dependências para o efeito

  return (
    <div className="app-container">
      <ThemeToggle /> 
      <h1>Minha Lista de Tarefas</h1>
      {!isAuthenticated ? <Auth /> : ( 
        <>
          <TodoForm /> 
          <TodoList /> 
        </>
      )}
    </div>
  );
}

export default App;
