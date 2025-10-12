import { useState } from "react";
import { useTodo } from "../../context/TodoContext";

const TodoItem = ({ todo }) => {
  const { deleteTodo, toggleTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      updateTodo(todo._id, { text: editedText });
      setIsEditing(false);
    }
  };

  const importanceClass = `priority-${todo.importance}`;

  return (
    <tr className={`todo-item ${todo.status === "concluído" ? "completed" : ""}`}>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            autoFocus
            className="search-input-task"
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
      </td>
      <td className={`${importanceClass}`}>{todo.importance}</td>
      <td>{todo.status}</td>
      <td>{todo.date}</td>
      <td>{todo.location || "N/A"}</td>
      <td className="todo-actions">
        {todo.status !== "concluído" && (
          <button className="btn-conclusion" onClick={() => toggleTodo(todo._id)}>
            Concluir
          </button>
        )}
        {todo.status !== "pendente" && (
          <button className="btn-conclusion" onClick={() => toggleTodo(todo._id)}>
            Desfazer
          </button>
        )}
        {isEditing ? (
          <button onClick={handleSaveEdit} className="btn-save">
            Salvar
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Editar
          </button>
        )}
        <button onClick={() => deleteTodo(todo._id)} className="btn-delete">
          Excluir
        </button>
      </td>
    </tr>
  );
};

export default TodoItem;
