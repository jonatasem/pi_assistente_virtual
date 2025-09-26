import { useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Auth from "./components/Auth/Auth";
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext"; 
import ThemeToggle from "./components/Themes/index";
import LogoutButton from "./components/LogoutButton"; // Importa o botão de logout

function App() {
  const { isAuthenticated } = useAuth(); // Obtém o estado de autenticação
  const { fetchTodos } = useTodo(); // Obtém a função para buscar tarefas

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, fetchTodos]); 

  return (
    <div className="app-container">
      <ThemeToggle /> {/* Botão de tema sempre visível */}
      {!isAuthenticated ? (
        <Auth /> 
      ) : ( 
        <>
          <LogoutButton /> {/* Botão de logout quando logado */}
          <h1 className="app-title">Seus Lembretes</h1>
          <TodoForm /> 
          <TodoList /> 
        </>
      )}
    </div>
  );
}

export default App;
