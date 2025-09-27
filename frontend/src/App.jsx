import { useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Auth from "./components/Auth/Auth";
import { useAuth } from "./context/AuthContext";
import { useTodo } from "./context/TodoContext"; 
import LogoutButton from "./components/LogoutButton";
import Dashboard from "./pages/Dashboard";
import ThemeToggle from "./components/Themes";

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
    <div className="container-app">

      <ThemeToggle />
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
