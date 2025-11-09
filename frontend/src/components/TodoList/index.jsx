import { useTodo } from "../../context/TodoContext";
import TodoItem from "../TodoItem";
import './index.scss';

const TodoList = () => {
  const { todos } = useTodo();

  return (
    <div className="todo-list-container">
      {todos.length === 0 ? (
        <p className="no-todos-msg">Nenhum lembrete agendado. Adicione um!</p>
      ) : (
        <table className="main-todo-list">
          <thead className="title-todo-list">
            <tr>
              <th>Minhas tarefas</th>
              <th className="item-list-priority">Prioridades</th>
              <th className="item-list-status">Status</th>
              <th className="item-list-data">Data</th>
              <th className="item-list-location">Local</th>
              <th className="item-list-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodoList;