import { useTodo } from "../../context/TodoContext";
import TodoItem from "../TodoItem";
import { useState, useEffect } from "react";
import "./index.scss";

const TodoList = () => {
  const { todos } = useTodo();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="todo-list-container">
      {todos.length === 0 ? (
        <p className="no-todos-msg">Nenhum lembrete agendado. Adicione um!</p>
      ) : (
        <>
          {!isMobile ? (
            <table className="main-todo-list">
              <thead>
                <tr>
                  <th>Minhas tarefas</th>
                  <th>Prioridades</th>
                  <th>Status</th>
                  <th>Prazo</th>
                  <th>Lista</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <TodoItem key={todo._id} todo={todo} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="todo-mobile-wrapper">
              {todos.map((todo) => (
                <div key={todo._id} className="todo-card">
                  <div className="card-title">{todo.title}</div>

                  <div className="card-row">
                    <span>Prioridade:</span> <strong>{todo.priority}</strong>
                  </div>

                  <div className="card-row">
                    <span>Status:</span> <strong>{todo.status}</strong>
                  </div>

                  <div className="card-row">
                    <span>Prazo:</span> <strong>{todo.deadline}</strong>
                  </div>

                  <div className="card-row">
                    <span>Lista:</span> <strong>{todo.listName}</strong>
                  </div>

                  {/* Usa as ações do TodoItem, mas em versão mobile */}
                  <TodoItem todo={todo} isMobile />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TodoList;
