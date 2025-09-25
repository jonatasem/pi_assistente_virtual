import React from "react";
import { useTodo } from "../../context/TodoContext";
import TodoItem from "../TodoItem";

const TodoList = () => {
  const { todos } = useTodo();

  return (
    <div className="todo-list-container">
      <ul className="todo-items">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
