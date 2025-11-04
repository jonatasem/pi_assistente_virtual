import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const TodoContext = createContext();

// Mapa para armazenar os timers de notificação e poder cancelá-los
const notificationTimers = new Map();

// Função auxiliar para agendar notificações no Frontend
const scheduleNotification = (todo) => {
  // Limpa qualquer timer existente para esta tarefa (útil ao atualizar)
  if (notificationTimers.has(todo._id)) {
    clearTimeout(notificationTimers.get(todo._id));
    notificationTimers.delete(todo._id);
  }

  // Não agenda se já estiver concluída
  if (todo.status === "concluído") return;

  const todoDateTimeString = `${todo.date}T${todo.time}`; 
  const todoDate = new Date(todoDateTimeString);
  const now = new Date();
  const delay = todoDate.getTime() - now.getTime(); // Tempo em milissegundos

  // Agenda apenas se for no futuro e a permissão for concedida
  if (delay > 1000 && "Notification" in window && Notification.permission === "granted") {
      const timerId = setTimeout(() => {
          new Notification('Lembrete de Tarefa', {
              body: `Sua tarefa: "${todo.text}" está agendada para agora.`,
          });
          // Remove o timer após a execução
          notificationTimers.delete(todo._id);
      }, delay);
      
      // Armazena o ID do timer
      notificationTimers.set(todo._id, timerId);
      console.log(`Notificação agendada para tarefa ${todo._id} em ${todoDate.toLocaleString()}.`);
  } else if (delay > 0) {
      console.log(`Tarefa ${todo._id} é muito iminente ou permissão pendente.`);
  }
};

// Provider
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar tarefas.");
      }
      const data = await response.json();
      setTodos(data);
      
      // Agenda notificações para todas as tarefas carregadas
      data.forEach(scheduleNotification);

    } catch (fetchError) {
      console.error("Erro na requisição de tarefas:", fetchError.message);
      setError("Não foi possível carregar suas tarefas. Tente recarregar a página.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addTodo = async (newTodo) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(newTodo),
        },
      );
      if (response.ok) {
        const todo = await response.json();
        setTodos((prev) => [...prev, todo]);
        
        // Agenda notificação para a nova tarefa
        scheduleNotification(todo);

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
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao excluir tarefa.");
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      
      // Cancela o timer de notificação ao deletar
      if (notificationTimers.has(id)) {
        clearTimeout(notificationTimers.get(id));
        notificationTimers.delete(id);
      }

    } catch (deleteError) {
      console.error("Erro na exclusão da tarefa:", deleteError.message);
      setError(`Erro ao excluir: ${deleteError.message}`);
    }
  };

  const toggleTodo = async (id) => {
    const todoToUpdate = todos.find((todo) => todo._id === id);
    if (!todoToUpdate) return;

    // Atualiza o status corretamente
    const updatedStatus = todoToUpdate.status === "pendente" ? "concluído" : "pendente";

    // Atualiza o estado local otimisticamente
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, status: updatedStatus } : todo,
      ),
    );

    // Agenda/Cancela o timer no toggle
    if (updatedStatus === "concluído") {
        if (notificationTimers.has(id)) {
            clearTimeout(notificationTimers.get(id));
            notificationTimers.delete(id);
        }
    } else {
        scheduleNotification({ ...todoToUpdate, status: updatedStatus });
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: updatedStatus }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao atualizar tarefa.");
      }
    } catch (toggleError) {
      console.error("Erro na atualização da tarefa:", toggleError.message);
      setError(`Erro ao atualizar: ${toggleError.message}`);

      // Reverte o status se houver erro
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: todoToUpdate.status } : todo,
        ),
      );
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates), // Enviando dados atualizados
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao atualizar tarefa.");
      }

      const updatedTodo = { ...todos.find((todo) => todo._id === id), ...updates };

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? updatedTodo : todo,
        ),
      );
      
      // Reagenda a notificação após atualização (data/hora, etc.)
      scheduleNotification(updatedTodo);

    } catch (updateError) {
      console.error("Erro na atualização da tarefa:", updateError.message);
      setError(`Erro ao atualizar: ${updateError.message}`);
    }
  };

  const value = {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    fetchTodos,
    isLoading,
    error,
    setError,
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
