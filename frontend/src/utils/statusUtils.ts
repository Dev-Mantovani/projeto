export interface DepartamentoData {
  servente_realizado?: number;
  realizado_per_capita?: number;
  realizado_total?: number;
}

/**
 * Função centralizada para determinar o status de um departamento
 * Esta função deve ser usada tanto na página Administration quanto na página Pedido
 */
export const getStatusDepartamento = (dep: DepartamentoData): string => {
  const { servente_realizado, realizado_per_capita, realizado_total } = dep;
  
  // Verifica se todos os campos são zero, nulos ou indefinidos
  const todosZeros = [servente_realizado, realizado_per_capita, realizado_total].every(
    valor => valor === 0 || valor === null || valor === undefined
  );
  
  if (todosZeros) {
    return "Pendente";
  }
  
  // Verifica se algum campo obrigatório é zero, nulo ou indefinido
  const algumZero = [servente_realizado, realizado_per_capita, realizado_total].some(
    valor => valor === 0 || valor === null || valor === undefined
  );
  
  if (algumZero) {
    return "Inconsistência";
  }
  
  return "Enviado";
};

/**
 * Função para obter a cor do status (para uso em CSS)
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "enviado":
      return "#27ae60"; // Verde
    case "inconsistência":
    case "inconsistencia":
      return "#f39c12"; // Laranja
    case "pendente":
    default:
      return "#e74c3c"; // Vermelho
  }
};