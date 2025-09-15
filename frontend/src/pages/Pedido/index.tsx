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
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  ExpandIcon,
  ExpandableCell,
  ExpandableRow,
  CardContainer,
  CardHeader,
  CardContent,
  CardRow,
  CardLabel,
  CardValue,
  CardCompetencia
} from './styles';

interface Departamento {
  id: number;
  cadastro_filial: string;
  cadastro_departamento: string;
  tipo_departamento: string;
  competencia: string;
  numero_serventes: string;
  previsto_total_ctr: string;
  realizado_total: string;
  realizado_per_capita: string;
  servente_realizado: string;
}

interface GrupoDepartamento {
  departamento: string;
  filial: string;
  competencias: Departamento[];
}

const PedidoPage: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [grupos, setGrupos] = useState<GrupoDepartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ nome: string; filial: string }>({
    nome: "",
    filial: "",
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Agrupar departamentos por nome
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


  // Carregar departamentos ao montar a página
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (departamentos.length > 0) {
      const gruposAgrupados = agruparDepartamentos(departamentos);
      setGrupos(gruposAgrupados);
    }
  }, [departamentos]);

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
    setEditValues({ nome: dep.cadastro_departamento, filial: dep.cadastro_filial });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditValues({ nome: "", filial: "" });
  };

  const handleSave = async (id: number) => {
    try {
      await dashboardApi.updateDepartamento(id, editValues);
      await fetchDepartamentos();
      setEditId(null);
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error);
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

  const formatarCompetencia = (competencia: string): string => {
    if (!competencia) return "";

    try {
      const data = new Date(competencia);
      return data.toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" });
    } catch {
      return competencia; // se não for data válida, mostra como veio
    }
  };


  if (loading) return <p>Carregando departamentos...</p>;

  return (
    <Container>
      <Title>Lista de Departamentos</Title>

      {grupos.length === 0 ? (
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
            {grupos.map((grupo) => {
              const groupKey = grupo.departamento;
              const isExpanded = isGroupExpanded(groupKey);

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
                      <EditButton onClick={(e) => {
                        e.stopPropagation();
                        if (grupo.competencias.length > 0) {
                          handleEdit(grupo.competencias[0]);
                        }
                      }}>
                        Editar
                      </EditButton>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <ExpandableRow>
                      <ExpandableCell colSpan={5}>
                        <div style={{ padding: '15px' }}>
                          <h3>Competências do Departamento {grupo.departamento}:</h3>

                          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: "left", padding: "8px" }}>Competência</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Serventes</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Previsto CTR</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Realizado Total</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Per Capita</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Servente Realizado</th>
                                <th style={{ textAlign: "left", padding: "8px" }}>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {grupo.competencias.map((competencia) => (
                                <tr key={competencia.id}>
                                  <td style={{ padding: "8px" }}>
                                    {formatarCompetencia(competencia.competencia)}
                                  </td>
                                  <td style={{ padding: "8px" }}>{competencia.numero_serventes}</td>
                                  <td style={{ padding: "8px" }}>{competencia.previsto_total_ctr}</td>
                                  <td style={{ padding: "8px" }}>{competencia.realizado_total}</td>
                                  <td style={{ padding: "8px" }}>{competencia.realizado_per_capita}</td>
                                  <td style={{ padding: "8px" }}>{competencia.servente_realizado}</td>
                                  <td style={{ padding: "8px" }}>
                                    {editId === competencia.id ? (
                                      <EditContainer>
                                        <Input
                                          type="text"
                                          value={editValues.nome}
                                          onChange={(e) =>
                                            setEditValues((prev) => ({ ...prev, nome: e.target.value }))
                                          }
                                          placeholder="Nome do departamento"
                                        />
                                        <Input
                                          type="text"
                                          value={editValues.filial}
                                          onChange={(e) =>
                                            setEditValues((prev) => ({ ...prev, filial: e.target.value }))
                                          }
                                          placeholder="Filial"
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
                              ))}
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