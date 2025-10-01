import  { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext"; 

const TodoContext = createContext(); 

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]); 
  const { isAuthenticated } = useAuth(); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.");
      }
      const data = await response.json();
      setTodos(data); 
    } catch (error) {
      console.error("Erro na requisição de tarefas:", error.message);
    }
  }, [isAuthenticated]);

  const addTodo = async (newTodo) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newTodo) 
      });
      if (response.ok) {
        const todo = await response.json();
        setTodos((prev) => [...prev, todo]); 
      } else {
        throw new Error("Erro ao adicionar tarefa.");
      }
    } catch (error) {
      console.error("Erro na requisição de adição:", error.message);
    }
  };

  const deleteTodo = (id) => {
      console.log(`Tarefa ${id} excluída (Ação de frontend)`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
  };
  
  const toggleTodo = (id) => {
      console.log(`Tarefa ${id} alterada (Ação de frontend)`);
      setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === id ? { ...todo, status: todo.status === "pendente" ? "concluído" : "pendente" } : todo))
      );
  };

  const value = {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    fetchTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>; 
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo deve ser usado dentro de um TodoProvider");
  }
  return context;
};
