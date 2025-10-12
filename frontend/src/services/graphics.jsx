export const calculateChartData = (todos) => {
  const openCount = todos.filter(todo => todo.status === 'pendente').length;
  const dueSoonCount = todos.filter(todo => todo.status === 'pendente' && new Date(todo.date) <= new Date(Date.now() + 24 * 60 * 60 * 1000)).length;
  const completedCount = todos.filter(todo => todo.status === 'concluído').length;

  const highPriorityCount = todos.filter(todo => todo.importance === 'alta').length;
  const mediumPriorityCount = todos.filter(todo => todo.importance === 'media').length;
  const lowPriorityCount = todos.filter(todo => todo.importance === 'baixa').length;

  return {
    statusData: [openCount + dueSoonCount + completedCount, dueSoonCount, openCount, completedCount],
    priorityData: [highPriorityCount, mediumPriorityCount, lowPriorityCount],
    efficiencyData: [completedCount, openCount] // Tarefas concluídas e pendentes
  };
};
