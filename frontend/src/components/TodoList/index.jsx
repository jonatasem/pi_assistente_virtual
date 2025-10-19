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
      )}
    </div>
  );
};

export default TodoList;
