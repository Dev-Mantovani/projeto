import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  FiltersContainer,
  FilterGroup,
  Tabs,
  TabButton,
  TableContainer,
  Table,
  StatusBadge,
  FormContainer,
  FormGroup,
  Input,
  Button,
  Card,
  ProductCard,
  DepartmentCard,
  MetricsGrid,
  MetricCard,
  IconButton,
  SearchBar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  EmptyState,
  LoadingSpinner,
  FloatingActionButton,
  ResponsiveTable,
  ProductSelectionModal,
  ProductSelectionCard,
  ProductSelectionContent,
  ProductGrid,
  ProductIcon,
  ProductInfo,
  SelectionIndicator,
  ProductSelectionFooter,
  ProductItem,
  ProductsActions,
  ProductsBadge,
  ProductsHeader,
  ProductsInfo,
  ProductsList,
  ProductsSection,
  ProductsTitle,
  LinkedProductItem,
  LinkedProductsContainer,
  LinkedProductsTitle,
  EmptyBadge,
  EmptyProductsMessage,
  ExpandIcon,
  ExpandableContainer,
  AddProductButton,
  ToggleButton
} from "./styles";

import { dashboardApi } from "../../services/api";
import { getStatusDepartamento } from "../../utils/statusUtils"; // Importa a função centralizada
import * as XLSX from 'xlsx';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tabela");
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [showAdicionarProdutoModal, setShowAdicionarProdutoModal] = useState(false);
  const [departamentoParaAdicionar, setDepartamentoParaAdicionar] = useState<number | null>(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
  const [produtosPorDepartamento, setProdutosPorDepartamento] = useState<{ [key: number]: any[] }>({});
  const [departamentosExpandidos, setDepartamentosExpandidos] = useState<{ [key: number]: boolean }>({});

  // Estados dos dados
  const [tabelaData, setTabelaData] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);

  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    filial: "todas",
    departamento: "todos",
    tipo_departamento: "todos",
    competencia: "todos",
    status: "todos"
  });

  const [metricas, setMetricas] = useState({
    totalFiliais: 0,
    totalServentes: 0,
    previstoTotal: 0,
    totalServentesRealizado: 0,
    realizadoTotal: 0
  });

  // Formulários
  const [produtoForm, setProdutoForm] = useState({
    codigo: "",
    conta_financeira: "",
    descricao: "",
    descricao_ctr: "",
    produto_quantidade: 0,
    valor_unitario: 0,
    valor_total: 0
  });

  const [departamentoForm, setDepartamentoForm] = useState({
    cadastro_filial: "",
    cadastro_departamento: "",
    tipo_departamento: "",
    competencia: "",
    numero_serventes: "",
    previsto_total_ctr: "",
    realizado_total: "",
    realizado_per_capita: "",
    servente_realizado: ""
  });

  // Função para calcular métricas com base nos dados
  const calcularMetricas = (dados: any[]) => {
    const filiaisUnicas = [...new Set(dados.map(item => item.filial || item.cadastro_filial))];
    const totalServentes = dados.reduce((acc, item) => acc + (Number(item.numero_serventes) || 0), 0);
    const totalServentesRealizado = dados.reduce((acc, item) => acc + (Number(item.servente_realizado) || 0), 0);
    const previstoTotal = dados.reduce((acc, item) => acc + (Number(item.previsto_total_ctr) || 0), 0);
    const realizadoTotal = dados.reduce((acc, item) => acc + (Number(item.realizado_total) || 0), 0);

    return {
      totalFiliais: filiaisUnicas.length,
      totalServentes,
      totalServentesRealizado,
      previstoTotal,
      realizadoTotal
    };
  };

  // Buscar dados ao carregar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [dadosConsolidados, produtosList, departamentosList] = await Promise.all([
        dashboardApi.getDadosConsolidados(),
        dashboardApi.getProdutos(),
        dashboardApi.getDepartamentos()
      ]);

      // Integrar dados de departamento na tabela consolidada
      const dadosIntegrados = dadosConsolidados.map((item: any) => {
        const departamento = departamentosList.find((d: any) =>
          d.competencia === item.competencia &&
          d.cadastro_filial === item.cadastro_filial &&
          d.cadastro_departamento === item.cadastro_departamento &&
          d.tipo_departamento == item.tipo_departamento
        );

        // Calcula o status usando a função centralizada
        const statusCalculado = getStatusDepartamento({
          servente_realizado: departamento?.servente_realizado || item.servente_realizado,
          realizado_per_capita: departamento?.realizado_per_capita || item.realizado_per_capita,
          realizado_total: departamento?.realizado_total || item.realizado_total
        });

        return {
          ...item,
          numero_serventes: departamento?.numero_serventes || item.numero_serventes,
          previsto_total_ctr: departamento?.previsto_total_ctr || item.previsto_total_ctr,
          realizado_total: departamento?.realizado_total || item.realizado_total,
          servente_realizado: departamento?.servente_realizado || item.servente_realizado,
          realizado_per_capita: departamento?.realizado_per_capita || item.realizado_per_capita,
          status: statusCalculado // Usa o status calculado pela função centralizada
        };
      });

      // Se não há dados consolidados, criar entradas baseadas apenas nos departamentos
      let dadosFinais = dadosIntegrados;
      if (dadosConsolidados.length === 0 && departamentosList.length > 0) {
        dadosFinais = departamentosList.map((dept: any) => {
          const statusCalculado = getStatusDepartamento({
            servente_realizado: dept.servente_realizado,
            realizado_per_capita: dept.realizado_per_capita,
            realizado_total: dept.realizado_total
          });

          return {
            filial: dept.cadastro_filial,
            data_base: 0,
            competencia: dept.competencia,
            cadastro_filial: dept.cadastro_filial,
            cadastro_departamento: dept.cadastro_departamento,
            tipo_departamento: dept.tipo_departamento,
            numero_serventes: dept.numero_serventes,
            previsto_total_ctr: dept.previsto_total_ctr,
            previsto_per_capita: dept.numero_serventes > 0 ? (Number(dept.previsto_total_ctr) / Number(dept.numero_serventes)) : 0,
            realizado_total: dept.realizado_total,
            servente_realizado: dept.servente_realizado,
            realizado_per_capita: dept.realizado_per_capita,
            diferenca: Number(dept.previsto_total_ctr) - (Number(dept.realizado_total) || 0),
            variacao: ((Number(dept.realizado_total) || 0) / Number(dept.previsto_total_ctr) - 1) * 100,
            status: statusCalculado // Usa o status calculado pela função centralizada
          };
        });
      }

      setTabelaData(dadosFinais);
      setProdutos(produtosList);
      setDepartamentos(departamentosList);

      // Calcular métricas iniciais
      setMetricas(calcularMetricas(dadosFinais));

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  // Resto do código permanece igual...
  // [O restante do código do componente permanece exatamente o mesmo]

  // Filtrar dados com base nos filtros selecionados
  const filtrarDados = () => {
    return tabelaData.filter(item => {
      // Filtro de período (exemplo simplificado)
      let periodoMatch = true;

      // Filtros existentes
      const competenciaMatch = filtros.competencia === "todos" ||
        item.competencia === filtros.competencia

      const filialMatch = filtros.filial === "todas" ||
        item.filial === filtros.filial ||
        item.cadastro_filial === filtros.filial;

      const departamentoMatch = filtros.departamento === "todos" ||
        item.cadastro_departamento === filtros.departamento;

      const tipoMatch = filtros.tipo_departamento === "todos" ||
        item.tipo_departamento === filtros.tipo_departamento;

      const statusMatch = filtros.status === "todos" || item.status === filtros.status;

      const searchMatch = searchTerm === "" ||
        (item.competencia || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.filial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.cadastro_filial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.cadastro_departamento || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tipo_departamento || "").toLowerCase().includes(searchTerm.toLowerCase());

      return periodoMatch && filialMatch && departamentoMatch && statusMatch && tipoMatch && competenciaMatch && searchMatch;
    });
  };

  // Atualizar métricas quando filtros ou dados mudarem
  useEffect(() => {
    const dadosFiltrados = filtrarDados();
    setMetricas(calcularMetricas(dadosFiltrados));
  }, [filtros, tabelaData, searchTerm]);

  const dadosFiltrados = filtrarDados();

  // [Resto das funções permanecem iguais - salvarProduto, excluirProduto, etc.]

  if (loading && tabelaData.length === 0) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      {/* Todo o JSX permanece igual, exceto a parte da tabela onde o status é exibido */}
      <Header>
        <div>
          <h1>🏢 Central de Inteligencia Operacional</h1>
          <p>Consolidado de Pedidos por Filial</p>
        </div>
        <SearchBar>
          <input
            type="text"
            placeholder="🔍 Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </Header>

      {/* Métricas */}
      <MetricsGrid>
        <MetricCard>
          <div className="metric-icon">🏪</div>
          <div>
            <h3>{metricas.totalFiliais}</h3>
            <p>Filiais Ativas</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">👥</div>
          <div>
            <h3>{metricas.totalServentes}</h3>
            <p>Serventes em CTR</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">👥</div>
          <div>
            <h3>{metricas.totalServentesRealizado}</h3>
            <p>Serventes Ativos</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">📊</div>
          <div>
            <h3>R$ {metricas.previstoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p>Previsto em CTR</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">💰</div>
          <div>
            <h3>R$ {metricas.realizadoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p>Realizado Total</p>
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Filtros */}
      <FiltersContainer>
        <FilterGroup>
          <label>📅 Competencia</label>
          <select
            value={filtros.competencia}
            onChange={(e) => setFiltros({ ...filtros, competencia: e.target.value })}
          >
            <option value="todos">Todas as competências</option>
            {[...new Set(tabelaData.map(item => item.competencia))].map((competencia) => {
              const data = new Date(competencia);
              const mes = String(data.getMonth() + 2).padStart(2, "0");
              const ano = data.getFullYear();
              const competenciaFormatada = `${mes}/${ano}`;

              return (
                <option key={competencia} value={competencia}>
                  {competenciaFormatada}
                </option>
              );
            })}
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>🏢 Filial</label>
          <select
            value={filtros.filial}
            onChange={(e) => setFiltros({ ...filtros, filial: e.target.value })}
          >
            <option value="todas">Todas as filiais</option>
            {[...new Set(tabelaData.map(item => item.filial || item.cadastro_filial))].map(filial => (
              <option key={filial} value={filial}>{filial}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>🏛️ Departamento</label>
          <select
            value={filtros.departamento}
            onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
          >
            <option value="todos">Todos os departamentos</option>
            {[...new Set(tabelaData.map(item => item.cadastro_departamento))].map(depto => (
              <option key={depto} value={depto}>{depto}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>🏷️ Tipo</label>
          <select
            value={filtros.tipo_departamento}
            onChange={(e) => setFiltros({ ...filtros, tipo_departamento: e.target.value })}
          >
            <option value="todos">Todos os tipos</option>
            {[...new Set(tabelaData.map(item => item.tipo_departamento))].map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup>
          <label>🚦 Status</label>
          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
          >
            <option value="todos">Todos os status</option>
            <option value="Enviado">Enviado</option>
            <option value="Pendente">Pendente</option>
            <option value="Inconsistência">Inconsistência</option>
          </select>
        </FilterGroup>
      </FiltersContainer>

      {/* Abas */}
      <Tabs>
        <TabButton active={activeTab === "tabela"} onClick={() => setActiveTab("tabela")}>
          📊 Tabela Consolidada ( Pedido Mensal)
        </TabButton>
        <TabButton active={activeTab === "produtos"} onClick={() => setActiveTab("produtos")}>
          📦 Produtos ({produtos.length})
        </TabButton>
        <TabButton active={activeTab === "departamentos"} onClick={() => setActiveTab("departamentos")}>
          🏢 Departamentos ({departamentos.length})
        </TabButton>
      </Tabs>

      {/* Tabela Consolidada - A parte importante que mudou */}
      {activeTab === "tabela" && (
        <TableContainer>
          <div className="table-header">
            <h2>📊 Dados Consolidados</h2>
            <div className="table-actions">
              <span>{dadosFiltrados.length} registros encontrados</span>
              <Button
                onClick={() => {
                  // Exportar para Excel - função permanece igual
                }}
                style={{ marginLeft: '10px' }}
              >
                📤 Exportar para Excel
              </Button>
            </div>
          </div>

          {dadosFiltrados.length === 0 ? (
            <EmptyState>
              <div className="empty-icon">📊</div>
              <h3>Nenhum dado encontrado</h3>
              <p>
                {tabelaData.length === 0
                  ? "Cadastre departamentos para ver os dados na tabela consolidada"
                  : "Tente ajustar os filtros de busca"
                }
              </p>
            </EmptyState>
          ) : (
            <ResponsiveTable>
              <Table>
                <thead className="subtitulo-container">
                  <tr>
                    <th className="orçado_desc">Orçado</th>
                    <th className="realizado_desc">Realizado</th>
                    <th className="comparativo_desc">Comparativo</th>
                  </tr>
                </thead>
                <thead>
                  <tr>
                    <th>Competencia</th>
                    <th>Filial</th>
                    <th>Departamento</th>
                    <th>Tipo</th>
                    <th>Servente em CTR</th>
                    <th>Per Capita em CTR</th>
                    <th>Previsto em CTR</th>
                    <th className="th2">Servente Realizado</th>
                    <th className="th2">Realizado Per Capita</th>
                    <th className="th2">Realizado Total</th>
                    <th className="th3">Diferença</th>
                    <th className="th3">% Variação</th>
                    <th className="th3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.map((row, index) => (
                    <tr key={`${row.cadastro_filial}-${row.cadastro_departamento}-${index}`}>
                      <td data-label="Competencia">
                        <strong>
                          {(() => {
                            const data = new Date(row.competencia);
                            const mes = String(data.getMonth() + 2).padStart(2, "0");
                            const ano = data.getFullYear();
                            return `${mes}/${ano}`;
                          })()}
                        </strong>
                      </td>
                      <td data-label="Filial">
                        <strong>{row.filial || row.cadastro_filial}</strong>
                      </td>
                      <td data-label="Cad. Departamento">{row.cadastro_departamento}</td>
                      <td data-label="Tipo">
                        <strong>{row.tipo || row.tipo_departamento}</strong>
                      </td>
                      <td data-label="Nº Serventes">
                        <span className="badge-number">{row.numero_serventes}</span>
                      </td>
                      <td data-label="Previsto Per Capita">
                        R$ {Number(row.previsto_per_capita || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Previsto Total CTR">
                        R$ {Number(row.previsto_total_ctr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Servente Realizado" style={{ color: 'black' }}>
                        <span className="badge-number2">{row.servente_realizado}</span>
                      </td>
                      <td data-label="Realizado Per Capita" style={{ color: 'black' }}>
                        R$ {Number(row.realizado_per_capita || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Realizado Total" style={{ color: 'black' }}>
                        R$ {Number(row.realizado_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Diferença" style={{
                        color: Number(row.diferenca) >= 0 ? "#27ae60" : "#e74c3c",
                        fontWeight: "bold"
                      }}>
                        {Number(row.diferenca) >= 0 ? "+" : ""}R$ {Number(row.diferenca || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="% Variação" style={{
                        color: Number(row.variacao) >= 0 ? "#e74c3c" : "#27ae60",
                        fontWeight: "bold"
                      }}>
                        {Number(row.variacao) >= 0 ? "+" : ""}{Number(row.variacao || 0).toFixed(2)}%
                      </td>
                      <td data-label="Status">
                        {/* O status agora vem da função centralizada e será sincronizado */}
                        <StatusBadge status={row.status}>{row.status}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ResponsiveTable>
          )}
        </TableContainer>
      )}
      
      {/* Resto do código permanece igual... */}
    </Container>
  );
};

export default Dashboard;