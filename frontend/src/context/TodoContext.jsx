import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext"; // Importa o contexto de autenticação

const TodoContext = createContext(); // Cria o contexto de tarefas

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]); // Estado das tarefas
  const { isAuthenticated } = useAuth(); // Obtém o estado de autenticação

  // Função para buscar tarefas
  const fetchTodos = async () => {
    const token = localStorage.getItem("token"); // Recupera o token
    if (!token || !isAuthenticated) { // Verifica se o token existe e se o usuário está autenticado
      console.error("Token não encontrado ou usuário não autenticado.");
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        headers: {
          'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
        }
      });
      if (!response.ok) {
        console.error("Erro ao buscar tarefas:", response.statusText);
        return;
      }
      const data = await response.json();
      setTodos(data); // Atualiza o estado com as tarefas recebidas
    } catch (error) {
      console.error("Erro na requisição de tarefas:", error);
    }
  };

  // Função para adicionar uma nova tarefa
  const addTodo = async (newTodo) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo) // Envia a nova tarefa como JSON
      });
      if (response.ok) {
        const todo = await response.json();
        setTodos((prev) => [...prev, todo]); // Adiciona a nova tarefa ao estado
      } else {
        console.error("Erro ao adicionar tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição de adição:", error);
    }
  };

  // Função para excluir uma tarefa
  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id)); // Remove a tarefa do estado
  };

  // Função para alternar o status de uma tarefa
  const toggleTodo = async (id) => {
    const todo = todos.find(todo => todo._id === id);
    const updatedTodo = { ...todo, status: todo.status === "pendente" ? "concluído" : "pendente" };
    const token = localStorage.getItem("token");

    await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo) // Envia a tarefa atualizada como JSON
    });
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo)) // Atualiza o estado com a tarefa modificada
    );
  };

  // Exposição das funções e estado através do contexto
  const value = {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    fetchTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>; // Provedor do contexto
};

// Hook para usar o contexto de tarefas
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo deve ser usado dentro de um TodoProvider");
  }
  return context;
};
