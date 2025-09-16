// src/pages/Departamentos/index.tsx
import { useEffect, useState } from "react";
import { dashboardApi } from "../../services/api";
import {
  Container,
  Title,
  EditContainer,
  Input,
  SaveButton,
  CancelButton,
  DepName,
  DepFilial,
  EditButton,
  EmptyMessage,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  ExpandIcon,
  ExpandableCell,
  ExpandableRow,
  FilterContainer,
  FilterInput,
  FilterSelect,
  FilterLabel,
  StatusPendente,
  StatusInconsistencia,
  StatusEnviado,
} from './styles';

interface Departamento {
  id: number;
  cadastro_filial: string;
  cadastro_departamento: string;
  tipo_departamento: string;
  competencia: string;
  numero_serventes: number;
  previsto_total_ctr: number;
  realizado_total: number;
  realizado_per_capita: number;
  servente_realizado: number;
}

interface GrupoDepartamento {
  departamento: string;
  filial: string;
  competencias: Departamento[];
}

const PedidoPage: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [grupos, setGrupos] = useState<GrupoDepartamento[]>([]);
  const [filteredGrupos, setFilteredGrupos] = useState<GrupoDepartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ servrealizado: number; percapitarealizado: number; totalrealizado: number }>({
    servrealizado: 0,
    percapitarealizado: 0,
    totalrealizado: 0 ,
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  // Filtros
  const [departamentoFilter, setDepartamentoFilter] = useState("");
  const [competenciaFilter, setCompetenciaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Agrupar departamentos por nome (independente de filial, espaços e maiúsculas)
  const agruparDepartamentos = (deps: Departamento[]): GrupoDepartamento[] => {
    const grupos: { [key: string]: GrupoDepartamento } = {};

    deps.forEach(dep => {
      // normaliza: remove espaços extras e deixa tudo em minúsculo
      const key = dep.cadastro_departamento.trim().toLowerCase();

      if (!grupos[key]) {
        grupos[key] = {
          departamento: dep.cadastro_departamento.trim(), // mantém o nome original
          filial: "",
          competencias: []
        };
      }

      grupos[key].competencias.push(dep);
    });

    return Object.values(grupos).map(grupo => ({
      ...grupo,
      filial: [...new Set(grupo.competencias.map(c => c.cadastro_filial))].join(", ")
    }));
  };

  // Função para formatar a competência (mês seguinte)
   const formatarCompetencia = (competencia: string) => {
    const data = new Date(competencia); // transforma string em Date
    const mes = String(data.getMonth() + 2).padStart(2, "0"); // mês sempre com 2 dígitos
    const ano = data.getFullYear();
    const competenciaFormatada = `${mes}/${ano}`;
    return competenciaFormatada;
  };

  // Função para obter o valor formatado da competência para filtro
  const getCompetenciaFormatada = (competencia: string): string => {
    if (!competencia) return "";

    try {
   const data = new Date(competencia); // transforma string em Date
    const mes = String(data.getMonth() + 2).padStart(2, "0"); // mês sempre com 2 dígitos
    const ano = data.getFullYear();
      return `${mes}/${ano}`;
    } catch {
      return competencia;
    }
  };

  // Função para determinar o status do departamento
  const getStatusDepartamento = (dep: Departamento): string => {
    const { servente_realizado, realizado_per_capita, realizado_total } = dep;
    
    // Verifica se todos os campos são zero ou nulos
    const todosZeros = [servente_realizado, realizado_per_capita, realizado_total].every(
      valor => valor === 0 || valor === null || valor === undefined
    );
    
    if (todosZeros) {
      return "pendente";
    }
    
    // Verifica se algum campo obrigatório é zero
    const algumZero = [servente_realizado, realizado_per_capita, realizado_total].some(
      valor => valor === 0 || valor === null || valor === undefined
    );
    
    if (algumZero) {
      return "inconsistencia";
    }
    
    return "enviado";
  };

  // Função para obter o status do grupo (baseado nas competências)
  const getStatusGrupo = (grupo: GrupoDepartamento): string => {
    const statusCompetencias = grupo.competencias.map(comp => getStatusDepartamento(comp));
    
    if (statusCompetencias.every(status => status === "enviado")) {
      return "enviado";
    }
    
    if (statusCompetencias.some(status => status === "inconsistencia")) {
      return "inconsistencia";
    }
    
    return "pendente";
  };

  // Componente para exibir o status com estilo
  const renderStatus = (status: string) => {
    switch (status) {
      case "pendente":
        return <StatusPendente>Pendente</StatusPendente>;
      case "inconsistencia":
        return <StatusInconsistencia>Inconsistência</StatusInconsistencia>;
      case "enviado":
        return <StatusEnviado>Enviado</StatusEnviado>;
      default:
        return <StatusPendente>Pendente</StatusPendente>;
    }
  };

  // Filtrar grupos baseado nos filtros
  const aplicarFiltros = () => {
    let gruposFiltrados = [...grupos];

    // Filtro por departamento
    if (departamentoFilter) {
      gruposFiltrados = gruposFiltrados.filter(grupo =>
        grupo.departamento.toLowerCase().includes(departamentoFilter.toLowerCase())
      );
    }

    // Filtro por competência
    if (competenciaFilter) {
      gruposFiltrados = gruposFiltrados.filter(grupo =>
        grupo.competencias.some(comp => 
          getCompetenciaFormatada(comp.competencia) === competenciaFilter
        )
      );
    }

    // Filtro por status
    if (statusFilter) {
      gruposFiltrados = gruposFiltrados.filter(grupo =>
        getStatusGrupo(grupo) === statusFilter
      );
    }

    setFilteredGrupos(gruposFiltrados);
  };

  // Carregar departamentos ao montar a página
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (departamentos.length > 0) {
      const gruposAgrupados = agruparDepartamentos(departamentos);
      setGrupos(gruposAgrupados);
      setFilteredGrupos(gruposAgrupados);
    }
  }, [departamentos]);

  // Aplicar filtros quando os valores mudarem
  useEffect(() => {
    aplicarFiltros();
  }, [departamentoFilter, competenciaFilter, statusFilter, grupos]);

  const fetchDepartamentos = async () => {
    try {
      const data = await dashboardApi.getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dep: Departamento) => {
    setEditId(dep.id);
    setEditValues({
      servrealizado: Number(dep.servente_realizado) || 0,
      percapitarealizado: Number(dep.realizado_per_capita) || 0,
      totalrealizado: Number(dep.realizado_total) || 0
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditValues({ servrealizado: 0, percapitarealizado: 0, totalrealizado: 0 });
  };

  const handleSave = async (id: number) => {
    const camposObrigatorios = [
      editValues.servrealizado,
      editValues.percapitarealizado,
      editValues.totalrealizado,
    ];

    if (camposObrigatorios.some(campo => campo === null || campo === undefined || campo === 0)) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const payload = {
        servente_realizado: Number(editValues.servrealizado),
        realizado_per_capita: Number(editValues.percapitarealizado),
        realizado_total: Number(editValues.totalrealizado),
      };

      await dashboardApi.updateDepartamento(id, payload);
      alert("Departamento atualizado com sucesso!");

      await fetchDepartamentos(); // recarrega lista
      setEditId(null);
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error);
      alert("Erro ao salvar departamento");
    }
  };

  const toggleExpand = (key: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(key)) {
      newExpandedGroups.delete(key);
    } else {
      newExpandedGroups.add(key);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const isGroupExpanded = (key: string): boolean => {
    return expandedGroups.has(key);
  };

  // Obter competências únicas para o dropdown (já formatadas com +1 mês)
  const competenciasUnicas = Array.from(
    new Set(departamentos.map(dep => getCompetenciaFormatada(dep.competencia)))
  ).filter(Boolean).sort();

  if (loading) return <p>Carregando departamentos...</p>;

  return (
    <Container>
      <Title>Lista de Departamentos</Title>

      {/* Filtros */}
      <FilterContainer>
        <div>
          <FilterLabel>Departamento:</FilterLabel>
          <FilterInput
            type="text"
            placeholder="Filtrar por departamento..."
            value={departamentoFilter}
            onChange={(e) => setDepartamentoFilter(e.target.value)}
          />
        </div>
        <div>
          <FilterLabel>Competência:</FilterLabel>
          <FilterSelect
            value={competenciaFilter}
            onChange={(e) => setCompetenciaFilter(e.target.value)}
          >
            <option value="">Todas as competências</option>
            {competenciasUnicas.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </FilterSelect>
        </div>
        <div>
          <FilterLabel>Status:</FilterLabel>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="inconsistencia">Inconsistência</option>
            <option value="enviado">Enviado</option>
          </FilterSelect>
        </div>
      </FilterContainer>

      {filteredGrupos.length === 0 ? (
        <EmptyMessage>Nenhum departamento encontrado.</EmptyMessage>
      ) : (
        <Table>
          <thead>
            <TableRow>
              <TableHeader style={{ width: '40px' }}></TableHeader>
              <TableHeader>Departamento</TableHeader>
              <TableHeader>Filial</TableHeader>
              <TableHeader>Quantidade de Competências</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {filteredGrupos.map((grupo) => {
              const groupKey = grupo.departamento;
              const isExpanded = isGroupExpanded(groupKey);
              const statusGrupo = getStatusGrupo(grupo);

              return (
                <>
                  <TableRow key={groupKey} onClick={() => toggleExpand(groupKey)}>
                    <TableCell>
                      <ExpandIcon expanded={isExpanded}>
                        {isExpanded ? '▼' : '►'}
                      </ExpandIcon>
                    </TableCell>
                    <TableCell>
                      <DepName>{grupo.departamento}</DepName>
                    </TableCell>
                    <TableCell>
                      <DepFilial>{grupo.filial}</DepFilial>
                    </TableCell>
                    <TableCell>
                      {grupo.competencias.length} competência(s)
                    </TableCell>
                    <TableCell>
                      {renderStatus(statusGrupo)}
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <ExpandableRow>
                      <ExpandableCell colSpan={6}>
                        <div style={{ padding: '15px' }}>
                          <h3>Competências do {grupo.departamento}</h3>

                          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: "left", padding: "8px" }}>Competência</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Serventes em CTR</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Per Capita em CTR</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Previsto em CTR</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Servente Realizado</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Per Capita</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Realizado Total</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {grupo.competencias.map((competencia) => {
                                const statusCompetencia = getStatusDepartamento(competencia);
                                return (
                                  <tr key={competencia.id}>
                                    <td style={{ padding: "8px" }}>
                                      {formatarCompetencia(competencia.competencia)}
                                    </td>
                                    <td style={{ padding: "8px" }}>{competencia.numero_serventes}</td>
                                    <td style={{ padding: "8px" }}>
                                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                        competencia.previsto_total_ctr /competencia.numero_serventes ? Number(competencia.previsto_total_ctr /competencia.numero_serventes) : 0
                                      )}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                        competencia.previsto_total_ctr ? Number(competencia.previsto_total_ctr) : 0
                                      )}
                                    </td>
                                    <td style={{ padding: "8px" }}>{competencia.servente_realizado}</td>
                                    <td style={{ padding: "8px" }}>
                                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                        competencia.realizado_per_capita ? Number(competencia.realizado_per_capita) : 0
                                      )}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                        competencia.realizado_total ? Number(competencia.realizado_total) : 0
                                      )}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {renderStatus(statusCompetencia)}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {editId === competencia.id ? (
                                        <EditContainer>
                                          <Input
                                            type="number"
                                            value={editValues.servrealizado}
                                            onChange={(e) =>
                                              setEditValues((prev) => ({ ...prev, servrealizado: Number(e.target.value) }))
                                            }
                                            placeholder="Serventes Realizado"
                                          />
                                          <Input
                                            type="number"
                                            value={editValues.percapitarealizado}
                                            onChange={(e) =>
                                              setEditValues((prev) => ({ ...prev, percapitarealizado: Number(e.target.value) }))
                                            }
                                            placeholder="Per Capita Realizado"
                                          />
                                          <Input
                                            type="number"
                                            value={editValues.totalrealizado}
                                            onChange={(e) =>
                                              setEditValues((prev) => ({ ...prev, totalrealizado: Number(e.target.value) }))
                                            }
                                            placeholder="Total Realizado"
                                          />
                                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <SaveButton onClick={() => handleSave(competencia.id)}>
                                              Salvar
                                            </SaveButton>
                                            <CancelButton onClick={handleCancel}>
                                              Cancelar
                                            </CancelButton>
                                          </div>
                                        </EditContainer>
                                      ) : (
                                        <EditButton onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(competencia);
                                        }}>
                                          Editar
                                        </EditButton>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </ExpandableCell>
                    </ExpandableRow>
                  )}
                </>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default PedidoPage;