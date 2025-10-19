import "./index.scss";

//dependencies
import { useState, useEffect } from "react";

//components
import TodoList from "../../components/TodoList";
import BarChart from "../../components/BarChart";
import StatusChart from "../../components/StatusChart";
import DonutChart from "../../components/DonutChart";
import TodoForm from "../../components/TodoForm";

//context
import { useAuth } from "../../context/AuthContext";
import { useTodo } from "../../context/TodoContext";

//data
import { calculateChartData } from "../../services/graphics";

//images
import imgUserDefault from "../../assets/images/user-default.webp";
import imgFileCheck from "../../assets/images/file-check.svg";

//icons
import { FiFilter } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";

export default function Dashboard() {
  const { user } = useAuth();
  const { todos } = useTodo();

  // Estado para controlar a visibilidade do TodoForm
  const [isTodoFormVisible, setIsTodoFormVisible] = useState(false);

  // Definindo o estado para as opções e os dados do gráfico de prioridades
  const [barChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: ["Alta", "Média", "Baixa"], // Categorias de prioridade
    },
  });

  const [barChartSeries, setBarChartSeries] = useState([
    {
      name: "Prioridades",
      data: [],
    },
  ]);

  // Configurações para o gráfico de status
  const [statusChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: ["Todos", "Vence em um dia", "Em andamento", "Concluído"], // Categorias de status
    },
  });

  const [statusChartSeries, setStatusChartSeries] = useState([
    {
      name: "Status",
      data: [],
    },
  ]);

  // Configurações do gráfico de donut
  const [donutChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Concluídos", "Pendentes"],
  });

  const [donutChartSeries, setDonutChartSeries] = useState([]);

  // Função para calcular e atualizar os dados dos gráficos
  useEffect(() => {
    const { statusData, priorityData, efficiencyData } =
      calculateChartData(todos);

    // Atualiza as séries dos gráficos com os dados calculados
    setStatusChartSeries([{ name: "Status", data: statusData }]);
    setBarChartSeries([{ name: "Prioridades", data: priorityData }]);
    setDonutChartSeries(efficiencyData); // Passando os dados de eficiência
  }, [todos]); // Recalcula sempre que a lista de tarefas muda

  // Função para alternar a visibilidade do TodoForm
  const toggleTodoForm = () => {
    setIsTodoFormVisible((prevState) => !prevState);
  };

  return (
    <section className="container-dashboard">
      <header className="header-dashboard">
        <article className="header-dash-head">
          <img
            src={imgFileCheck}
            alt="imagem arquivo"
            className="img-file-check"
          />
          <div className="title-file-check">
            <h2>Meus indicadores</h2>
            <p>Acompanhe o desempenho geral em suas tarefas</p>
          </div>
        </article>

        <article className="header-dash-main">
          <img src={user?.image || imgUserDefault} alt="imagem do usuario" />
          <p>Olá, {user?.name || "Visitante"}</p>
        </article>
      </header>

      <main className="main-dashboard">
        <section className="indicators">
          <article className="priorities-indicators">
            <h4>Prioridades</h4>
            <BarChart options={barChartOptions} series={barChartSeries} />
          </article>

          <article className="status-indicators">
            <h4>Status</h4>
            <StatusChart
              options={statusChartOptions}
              series={statusChartSeries}
            />
          </article>

          <article className="efficiency-indicators">
            <h4>Eficiência</h4>
            <DonutChart options={donutChartOptions} series={donutChartSeries} />
          </article>
        </section>

        <section className="task-filter">
          <article className="filter-title">
            <FiFilter className="icon-filter" />
            <h2>FILTROS</h2>
            <select name="input-item" id="input-item-id">
              <option value="">Selecione uma opção</option>
              <option value="qa-design">QA Design</option>
              <option value="ui-ux-design">UI/UX Design</option>
              <option value="homologstage">Homologstage</option>
              <option value="develop">Develop</option>
              <option value="benner">Benner</option>
            </select>
          </article>

          <article className="filter-buttons">
            <button className="btn-task" onClick={toggleTodoForm}>
              + Adicionar Tarefa
            </button>
            <div className="search-task">
              <input
                type="text"
                name="activity"
                id="activity"
                placeholder="Procurar atividade"
              />
              <CiSearch className="icon-search-task" />
            </div>
          </article>
        </section>
      </main>
      <TodoList />
      {isTodoFormVisible && (
        <section className="container-task-create">
          <TodoForm closeCreateTask={toggleTodoForm} />
        </section>
      )}
    </section>
  );
}
