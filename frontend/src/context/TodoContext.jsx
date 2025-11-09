import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

import imgNotification from '../assets/images/notification.svg';

const TodoContext = createContext();
const notificationTimers = new Map();

const scheduleNotification = (todo) => {
  if (notificationTimers.has(todo._id)) {
    clearTimeout(notificationTimers.get(todo._id));
    notificationTimers.delete(todo._id);
  }

  if (todo.status === "concluído" || !todo.date || !todo.time) return;

  const [year, month, day] = todo.date.split('-').map(Number);
  const [hour, minute] = todo.time.split(':').map(Number);
  const todoDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  const now = new Date();
  const delay = todoDate.getTime() - now.getTime();

  if (delay < 0) return;

  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          createNotification(todo, delay);
        } else {
          console.log(`Permissão de notificação não concedida. Considere habilitar nas configurações do navegador.`);
        }
      });
    } else if (Notification.permission === "granted") {
      createNotification(todo, delay);
    } else {
      console.log(`Permissão de notificação não concedida.`);
    }
  } else {
    console.log(`Este navegador não suporta notificações.`);
  }
};

const createNotification = (todo, delay) => {
  if (delay >= 1000) {
    const timerId = setTimeout(() => {
      new Notification('Lembrete de Tarefa', {
        body: `Sua tarefa: "${todo.text}" está agendada para agora.`,
        icon: imgNotification,
      });
      notificationTimers.delete(todo._id);
    }, delay);
    
    notificationTimers.set(todo._id, timerId);
    console.log(`Notificação agendada para tarefa ${todo._id} em ${new Date(Date.now() + delay).toLocaleString()}.`);
  } else {
    console.log(`Tarefa ${todo._id} é muito iminente (${delay}ms) ou permissão pendente.`);
  }
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
    return headers;
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
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao buscar tarefas.");
      }
      const data = await response.json();
      setTodos(data);
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

      if (notificationTimers.has(id)) {
        clearTimeout(notificationTimers.get(id));
        notificationTimers.delete(id);
      }
    } catch (deleteError) {
      console.error("Erro ao excluir tarefa:", deleteError.message);
      setError(`Erro ao excluir: ${deleteError.message}`);
    }
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedFields),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Erro ao atualizar tarefa.");
      }

      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo)),
      );

      scheduleNotification(updatedTodo);
    } catch (updateError) {
      console.error("Erro na requisição de atualização:", updateError.message);
      setError(`Erro ao atualizar: ${updateError.message}`);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        fetchTodos,
        addTodo,
        deleteTodo,
        updateTodo, 
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo deve ser usado dentro de um TodoProvider");
  }
  return context;
};
