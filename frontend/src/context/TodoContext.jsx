import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 💡 NOVO: Estado de carregamento
  const [error, setError] = useState(null); // 💡 NOVO: Estado de erro
  const { isAuthenticated } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated) return;

    setError(null);
    setIsLoading(true); // Inicia carregamento

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.");
      }
      const data = await response.json();
      setTodos(data);
    } catch (fetchError) {
      console.error("Erro na requisição de tarefas:", fetchError.message);
      setError("Não foi possível carregar suas tarefas. Tente recarregar a página.");
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }, [isAuthenticated]);

  const addTodo = async (newTodo) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTodo),
      });
      if (response.ok) {
        const todo = await response.json();
        setTodos((prev) => [...prev, todo]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao adicionar tarefa.");
      }
    } catch (addError) {
      console.error("Erro na requisição de adição:", addError.message);
      setError(`Erro ao adicionar: ${addError.message}`);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao excluir tarefa.");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (deleteError) {
      console.error("Erro na exclusão da tarefa:", deleteError.message);
      setError(`Erro ao excluir: ${deleteError.message}`);
    }
  };

  const toggleTodo = async (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    if (!todoToUpdate) return;

    const updatedStatus = todoToUpdate.status === "pendente" ? "concluído" : "pendente";

    // Otimização: Atualização otimista (UI atualiza antes da resposta)
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, status: updatedStatus } : todo
      )
    );

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao atualizar tarefa.");
      }

    } catch (toggleError) {
      console.error("Erro na atualização da tarefa:", toggleError.message);
      setError(`Erro ao atualizar: ${toggleError.message}`);

      // Reverter o estado em caso de falha na API
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: todoToUpdate.status } : todo
        )
      );
    }
  };

  const value = {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    fetchTodos,
    isLoading, // 💡 EXPOR
    error, // 💡 EXPOR
    setError, // 💡 Para limpar erros de fora
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