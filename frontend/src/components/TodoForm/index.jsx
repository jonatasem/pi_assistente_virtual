import { useState } from "react";
import { useTodo } from "../../context/TodoContext";

const TodoForm = () => {
  const { addTodo } = useTodo();
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [importance, setImportance] = useState("baixa");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const todoDate = new Date(`${date}T${time}`);

    // Validações
    if (!text.trim()) {
      setError("O nome da tarefa não pode estar vazio.");
      return;
    }

    if (!date) {
      setError("A data é obrigatória.");
      return;
    }

    if (!time) {
      setError("A hora é obrigatória.");
      return;
    }

    if (todoDate < now) {
      setError("A data e o horário devem ser futuros.");
      return;
    }

    // Limpa o erro se todas as validações passarem
    setError("");
    addTodo({ text, date, time, location, importance });
    setText("");
    setDate("");
    setTime("");
    setLocation("");
    setImportance("baixa");
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      {error && <div className="error">{error}</div>}
      <label>
        <input
          type="text"
          placeholder="Nome da Tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </label>
      <label>
        Data:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label>
        Hora:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>
      <label>
        Local:
        <input
          type="text"
          placeholder="Local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label>
        Importância:
        <select
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </label>
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default TodoForm;
