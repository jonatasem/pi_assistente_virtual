import { useState } from "react";
import { useTodo } from "../../context/TodoContext";

const TodoItem = ({ todo }) => {
  const { deleteTodo, toggleTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  
  const handleSaveEdit = () => {
    if (editedText.trim()) {
      setIsEditing(false);
    }
  };

  const importanceClass = `priority-${todo.importance}`;

  return (
    <li className={`todo-item ${todo.status === "concluído" ? "completed" : ""} ${importanceClass}`}>
      <div className="item-content">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            autoFocus
          />
        ) : (
          <div className="todo-details">
            <span className="todo-text">{todo.text}</span>
            <p className="todo-meta">Data: **{todo.date}** | Horário: **{todo.time}**</p>
            {todo.location && <p className="todo-meta">Local: {todo.location}</p>}
            <p className={`todo-importance ${importanceClass}`}>Importância: {todo.importance}</p>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {todo.status !== "concluído" && (
          <button className="btn-conclusion" onClick={() => toggleTodo(todo._id)}>Concluir</button>
        )}
        {isEditing ? (
          <button onClick={handleSaveEdit} className="btn-save">Salvar</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-edit">Editar</button>
        )}
        <button onClick={() => deleteTodo(todo._id)} className="btn-delete">Excluir</button>
      </div>
    </li>
  );
};

export default TodoItem;