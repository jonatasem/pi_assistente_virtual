import React from "react";
import { useTodo } from "../../context/TodoContext";
import TodoItem from "../TodoItem";

const TodoList = () => {
  const { todos } = useTodo();

  return (
    <div className="todo-list-container">
      <h3 className="list-title">Minhas Tarefas</h3>
      <ul className="todo-items">
        {todos.length === 0 ? (
            <p className="no-todos-msg">Nenhum lembrete agendado. Adicione um!</p>
        ) : (
             todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} />
            ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;
