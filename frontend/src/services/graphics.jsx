export const calculateChartData = (todos) => {
  const openCount = todos.filter((todo) => todo.status === "pendente").length;
  
  // Correção: Comparar a data e hora do lembrete com o próximo dia
  const now = Date.now();
  const oneDayFuture = now + 24 * 60 * 60 * 1000; // 24 horas no futuro

  const dueSoonCount = todos.filter(
    (todo) =>
      todo.status === "pendente" &&
      // Cria um objeto Date completo (Data + Hora) para comparação precisa
      new Date(`${todo.date}T${todo.time}`).getTime() > now &&
      new Date(`${todo.date}T${todo.time}`).getTime() <= oneDayFuture,
  ).length;

  const completedCount = todos.filter(
    (todo) => todo.status === "concluído",
  ).length;

  const highPriorityCount = todos.filter(
    (todo) => todo.importance === "alta",
  ).length;
  const mediumPriorityCount = todos.filter(
    (todo) => todo.importance === "media",
  ).length;
  const lowPriorityCount = todos.filter(
    (todo) => todo.importance === "baixa",
  ).length;

  return {
    statusData: [
      // Todos (pendentes + concluídos)
      openCount + completedCount, 
      dueSoonCount,
      openCount,
      completedCount,
    ],
    priorityData: [highPriorityCount, mediumPriorityCount, lowPriorityCount],
    efficiencyData: [completedCount, openCount], // Tarefas concluídas e pendentes
  };
};