import { useState } from "react";
import { useTodo } from "../../context/TodoContext";

const TodoItem = ({ todo }) => {
  const { deleteTodo, toggleTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  // NOVO: Estado para expandir/recolher detalhes no mobile
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleSaveEdit = () => {
    if (editedText.trim()) {
      updateTodo(todo._id, { text: editedText });
      setIsEditing(false);
    }
  };

  const importanceClass = `priority-${todo.importance}`;

  // Função auxiliar para renderizar os botões de ação (reutilização)
  const renderActions = (isMobile = false) => (
    <div className={`todo-actions ${isMobile ? 'mobile-actions' : ''}`}>
      {todo.status !== "concluído" && (
        <button
          className="btn-conclusion"
          onClick={(e) => { e.stopPropagation(); toggleTodo(todo._id); }} // Previne a expansão ao clicar no botão
        >
          Concluir
        </button>
      )}
      {/* O botão Desfazer só aparece se o status for "concluído" */}
      {todo.status === "concluído" && ( 
        <button
          className="btn-conclusion btn-undo"
          onClick={(e) => { e.stopPropagation(); toggleTodo(todo._id); }}
        >
          Desfazer
        </button>
      )}
      
      {isEditing ? (
        <button onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }} className="btn-save">
          Salvar
        </button>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="btn-edit">
          Editar
        </button>
      )}
      <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }} className="btn-delete">
        Excluir
      </button>
    </div>
  );

  // Função auxiliar para renderizar o conteúdo da tarefa (texto ou input)
  const renderTaskContent = () => (
    isEditing ? (
      <input
        type="text"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={handleSaveEdit}
        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
        onClick={(e) => e.stopPropagation()} // Previne a expansão ao editar/clicar no input
        autoFocus
        className="search-input-task"
      />
    ) : (
      <span className="todo-text">{todo.text}</span>
    )
  );

  return (
    <>
      {/* Versão Desktop (tabela completa) */}
      <tr
        className={`todo-item todo-item-desktop ${todo.status === "concluído" ? "completed" : ""}`}
      >
        <td className="title-task">{renderTaskContent()}</td>
        <td className={`${importanceClass}`}>{todo.importance}</td>
        <td>{todo.status}</td>
        <td>{todo.date}</td>
        <td>{todo.location || "N/A"}</td>
        <td>{renderActions(false)}</td>
      </tr>

      {/* Versão Mobile (Linha principal - Cartão Básico) */}
      <tr
        className={`todo-item todo-item-mobile ${todo.status === "concluído" ? "completed" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Coluna 1: Tarefa (Título) + Status no Mobile */}
        <td className="mobile-task-content">
            <div className="mobile-task-header">
                {renderTaskContent()}
                <span className={`mobile-status ${todo.status === "concluído" ? "completed-badge" : "pending-badge"}`}></span>
            </div>
        </td>
        {/* Coluna 2: Data */}
        {/* Coluna 3: Ícone de Expansão */}
        <td className="mobile-expand-icon">
            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>{isExpanded ? '▲' : '▼'}</span>
        </td>
      </tr>

      {/* Linha de Detalhes e Ações (Mobile) - Condicional */}
      {isExpanded && (
        <tr className="todo-item todo-item-mobile-details">
            {/* O colSpan cobre todas as colunas da linha mobile (3) */}
            <td colSpan="3"> 
                <div className="mobile-details-content">
                  <p>Status: {todo.status}</p>
                    <p><strong>Prioridade:</strong> <span className={importanceClass}>{todo.importance}</span></p>
                    <p><strong>Local:</strong> {todo.location || "N/A"}</p>
                    {renderActions(true)} {/* Usa a versão mobile dos botões */}
                </div>
            </td>
        </tr>
      )}
    </>
  );
};

export default TodoItem;