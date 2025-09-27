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
    
    const todoDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (!text.trim() || !date || !time) {
      setError("Nome, Data e Hora são obrigatórios.");
      return;
    }

    if (todoDateTime < now) {
      setError("A data e o horário devem ser futuros para o lembrete.");
      return;
    }

    setError("");
    addTodo({ text, date, time, location, importance });
    
    // Limpa o formulário
    setText("");
    setDate("");
    setTime("");
    setLocation("");
    setImportance("baixa");
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      {error && <div className="error-message">{error}</div>}
      <label>
        <input
          type="text"
          placeholder="Nome da Tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </label>
      <div className="date-time-inputs">
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
      </div>
      <label>
        Local:
        <input
          type="text"
          placeholder="Local (Opcional)"
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
      <button type="submit" className="btn-add-todo">Adicionar Lembrete</button>
    </form>
  );
};

export default TodoForm;