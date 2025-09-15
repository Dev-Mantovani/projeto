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
  ExpandableRow
} from './styles';

interface Departamento {
  id: number,
  cadastro_filial: "",
  cadastro_departamento: "",
  tipo_departamento: "",
  competencia: "",
  numero_serventes: "",
  previsto_total_ctr: "",
  realizado_total: "",
  realizado_per_capita: "",
  servente_realizado: ""
};

interface Props {
  departamentos: Departamento[];
}

interface GrupoDepartamento {
  departamento: string;
  filial: string;
  competencias: Departamento[];
}

const PedidoPage: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ nome: string; filial: string }>({nome: "",filial: "",});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);



  // Agrupar departamentos por nome e filial
  const agruparDepartamentos = (deps: Departamento[]): GrupoDepartamento[] => {
    const grupos: { [key: string]: GrupoDepartamento } = {};
    
    deps.forEach(dep => {
      const key = `${dep.cadastro_departamento}-${dep.tipo_departamento}`;


      if (!grupos[key]) {
        grupos[key] = {
          departamento: dep.cadastro_departamento,
          filial: dep.tipo_departamento,
          competencias: []
        };
      }
      
      grupos[key].competencias.push(dep);
    });
    
    return Object.values(grupos);
  };
  

  // Carregar departamentos ao montar a página
  useEffect(() => {
    fetchDepartamentos();
  }, []);

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

  const toggleExpand = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  if (loading) return <p>Carregando departamentos...</p>;

return (
    <Container>
      <Title>Lista de Departamentos</Title>
       
      {departamentos.length === 0 ? (
        <EmptyMessage>Nenhum departamento encontrado.</EmptyMessage>
      ) : (
        <Table>
          <thead>
            <TableRow>
              <TableHeader style={{ width: '40px' }}></TableHeader>
              <TableHeader>Departamento</TableHeader>
              <TableHeader>Filial</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {departamentos.map((dep) => (
              <>
                <TableRow key={dep.id} onClick={() => toggleExpand(dep.id)}>
                  <TableCell>
                    <ExpandIcon expanded={expandedRow === dep.id}>
                      {expandedRow === dep.id ? '▼' : '►'}
                    </ExpandIcon>
                  </TableCell>
                  <TableCell>
                    <DepName>{dep.cadastro_departamento}</DepName>
                  </TableCell>
                  <TableCell>
                    <DepFilial>{dep.tipo_departamento}</DepFilial>
                  </TableCell>
                  <TableCell>
                    {editId === dep.id ? (
                      <EditContainer>
                        <Input
                          type="text"
                          value={editValues.nome}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, nome: e.target.value }))
                          }
                        />
                        <Input
                          type="text"
                          value={editValues.filial}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, filial: e.target.value }))
                          }
                        />
                        <SaveButton onClick={() => handleSave(dep.id)}>
                          Salvar
                        </SaveButton>
                        <CancelButton onClick={handleCancel}>
                          Cancelar
                        </CancelButton>
                      </EditContainer>
                    ) : (
                      <EditButton onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(dep);
                      }}>
                        Editar
                      </EditButton>
                    )}
                  </TableCell>
                </TableRow>
                
                {expandedRow === dep.id && (
                  <ExpandableRow>
                    <ExpandableCell colSpan={4}>
                      <InfoGrid>
                        <InfoItem>
                          <InfoLabel>Competência:</InfoLabel>
                          <InfoValue>{dep.competencia}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Filial:</InfoLabel>
                          <InfoValue>{dep.cadastro_filial}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Departamento:</InfoLabel>
                          <InfoValue>{dep.cadastro_departamento}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Serventes:</InfoLabel>
                          <InfoValue>{dep.servente_realizado}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Realizado per capita:</InfoLabel>
                          <InfoValue>{dep.realizado_per_capita}</InfoValue>
                        </InfoItem>
                        <InfoItem>
                          <InfoLabel>Realizado total:</InfoLabel>
                          <InfoValue>{dep.realizado_total}</InfoValue>
                        </InfoItem>
                      </InfoGrid>
                    </ExpandableCell>
                  </ExpandableRow>
                )}
              </>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}



 

export default PedidoPage;