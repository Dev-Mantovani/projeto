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
  ProductSelectionFooter
} from "./styles";

import { dashboardApi } from "../../services/api";
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
    previsto_total_ctr: ""

  });
  // Função para calcular métricas com base nos dados
  const calcularMetricas = (dados: any[]) => {
    const filiaisUnicas = [...new Set(dados.map(item => item.filial || item.cadastro_filial))];
    const totalServentes = dados.reduce((acc, item) => acc + (Number(item.numero_serventes) || 0), 0);
    const previstoTotal = dados.reduce((acc, item) => acc + (Number(item.previsto_total_ctr) || 0), 0);
    const realizadoTotal = dados.reduce((acc, item) => acc + (Number(item.acumulado_total) || 0), 0);

    return {
      totalFiliais: filiaisUnicas.length,
      totalServentes,
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

      // ------------------ DADOS CONSOLIDADOS -------------- Integrar dados de departamento na tabela consolidada
      const dadosIntegrados = dadosConsolidados.map((item: any) => {
        const departamento = departamentosList.find((d: any) =>
          d.competencia === item.competencia &&
          d.cadastro_filial === item.cadastro_filial &&
          d.cadastro_departamento === item.cadastro_departamento &&
          d.tipo_departamento == item.tipo_departamento

        );

        return {
          ...item,
          numero_serventes: departamento?.numero_serventes || item.numero_serventes,
          previsto_total_ctr: departamento?.previsto_total_ctr || item.previsto_total_ctr
        };
      });

      // Se não há dados consolidados, criar entradas baseadas apenas nos departamentos
      let dadosFinais = dadosIntegrados;
      if (dadosConsolidados.length === 0 && departamentosList.length > 0) {
        dadosFinais = departamentosList.map((dept: any) => ({
          filial: dept.cadastro_filial,
          data_base: 0,
          servente_realizado: 0,
          competencia: dept.competencia,
          cadastro_filial: dept.cadastro_filial,
          cadastro_departamento: dept.cadastro_departamento,
          tipo_departamento: dept.tipo_departamento,
          numero_serventes: dept.numero_serventes,
          previsto_total_ctr: dept.previsto_total_ctr,
          previsto_per_capita: dept.numero_serventes > 0 ? (Number(dept.previsto_total_ctr) / Number(dept.numero_serventes)) : 0,
          realizado_per_capita: 0,
          acumulado_total: 0,
          diferenca: -Number(dept.previsto_total_ctr || 0),
          variacao: -100,
          status: "Pendente"
        }));
      }

      setTabelaData(dadosFinais);
      setProdutos(produtosList);
      setDepartamentos(departamentosList);

      //-------------------------------- //



      // Calcular métricas iniciais
      setMetricas(calcularMetricas(dadosFinais));

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

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

  // -------------------------Cadastrar Produto------------------
  const salvarProduto = async () => {
    if (!produtoForm.codigo || !produtoForm.conta_financeira || !produtoForm.descricao || !produtoForm.descricao_ctr) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      if (editandoId) {
        await dashboardApi.updateProduto(editandoId, produtoForm);
        alert("Produto atualizado com sucesso!");
      } else {
        await dashboardApi.createProduto(produtoForm);
        alert("Produto cadastrado com sucesso!");
      }

      // Atualiza ambas as listas
      await Promise.all([
        carregarDados(), // Recarrega a lista principal
        carregarProdutosDisponiveis() // Recarrega os produtos disponíveis para associação
      ]);

      setProdutoForm({ codigo: "", conta_financeira: "", descricao: "", descricao_ctr: "", produto_quantidade: 0, valor_unitario: 0, valor_total: 0 });
      setEditandoId(null);
      setShowProdutoModal(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir produto
  const excluirProduto = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    setLoading(true);
    try {
      await dashboardApi.deleteProduto(id);
      await carregarDados();
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    } finally {
      setLoading(false);
    }
  };


  // --------------Cadastrar Departamento------------------
  const salvarDepartamento = async () => {
    const camposObrigatorios = [
      departamentoForm.cadastro_filial,
      departamentoForm.cadastro_departamento,
      departamentoForm.tipo_departamento,
      departamentoForm.competencia,
      departamentoForm.numero_serventes,
      departamentoForm.previsto_total_ctr
    ];

    if (camposObrigatorios.some(campo => !campo)) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cadastro_filial: departamentoForm.cadastro_filial,
        cadastro_departamento: departamentoForm.cadastro_departamento,
        tipo_departamento: departamentoForm.tipo_departamento,
        competencia: departamentoForm.competencia,
        numero_serventes: Number(departamentoForm.numero_serventes),
        previsto_total_ctr: Number(departamentoForm.previsto_total_ctr)
      };

      if (editandoId) {
        await dashboardApi.updateDepartamento(editandoId, payload);
        alert("Departamento atualizado com sucesso!");
      } else {
        await dashboardApi.createDepartamento(payload);
        alert("Departamento cadastrado com sucesso!");
      }

      // Limpar e recarregar
      setDepartamentoForm({
        cadastro_filial: "",
        cadastro_departamento: "",
        tipo_departamento: "",
        competencia: "",
        numero_serventes: "",
        previsto_total_ctr: ""
      });
      setEditandoId(null);
      setShowDepartamentoModal(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      alert("Erro ao salvar departamento");
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir departamento
  const excluirDepartamento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este departamento?")) return;

    setLoading(true);
    try {
      await dashboardApi.deleteDepartamento(id);
      await carregarDados();
      alert("Departamento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir departamento:", error);
      alert("Erro ao excluir departamento");
    } finally {
      setLoading(false);
    }
  };



  // Filtrar produtos
  const produtosFiltrados = produtos.filter(produto =>
    (produto.descricao || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar departamentos
  const departamentosFiltrados = departamentos.filter(dept =>
    (dept.cadastro_filial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.cadastro_departamento || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.tipo_departamento || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // EXPORT VIA XSLX //

  const exportToExcel = () => {
    const dadosParaExportar = dadosFiltrados.map(item => ({
      Filial: item.filial || item.cadastro_filial,
      Departamento: item.cadastro_departamento,
      Tipo: item.tipo_departamento,
      Competencia: item.competencia,
      'Data Base': item.data_base ? `R$ ${Number(item.data_base).toFixed(2)}` : '',
      'Nº Serventes': item.numero_serventes,
      'Previsto Per Capita': item.previsto_per_capita ? `R$ ${Number(item.previsto_per_capita).toFixed(2)}` : '',
      'Previsto Total CTR': item.previsto_total_ctr ? `R$ ${Number(item.previsto_total_ctr).toFixed(2)}` : '',
      'Servente Realizado': item.servente_realizado ? `R$ ${Number(item.servente_realizado).toFixed(2)}` : '',
      'Realizado Per Capita': item.realizado_per_capita ? `R$ ${Number(item.realizado_per_capita).toFixed(2)}` : '',
      'Acumulado Total': item.acumulado_total ? `R$ ${Number(item.acumulado_total).toFixed(2)}` : '',
      Diferença: item.diferenca ? `R$ ${Number(item.diferenca).toFixed(2)}` : '',
      'Variação (%)': item.variacao ? `${Number(item.variacao).toFixed(2)}%` : '',
      Status: item.status
    }));

    // Criar uma planilha do Excel
    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DadosConsolidados");

    // Gerar o arquivo e fazer download
    XLSX.writeFile(workbook, `dados_consolidados_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };


  // Carregar produtos de um departamento
  const carregarProdutosDepartamento = async (departamentoId: number) => {
    try {
      const produtos = await dashboardApi.getProdutosPorDepartamento(departamentoId);
      setProdutosPorDepartamento(prev => ({
        ...prev,
        [departamentoId]: produtos || []
      }));
    } catch (error) {
      console.error("Erro ao carregar produtos do departamento:", error);
      setProdutosPorDepartamento(prev => ({
        ...prev,
        [departamentoId]: []
      }));
    }
  };

  const carregarProdutosDisponiveis = async () => {
    try {
      const produtos = await dashboardApi.getProdutos();
      // Adiciona a propriedade showFullDescription a cada produto
      const produtosComEstado = produtos.map(produto => ({
        ...produto,
        showFullDescription: false // Valor inicial
      }));
      setProdutosDisponiveis(produtosComEstado || []);
    } catch (error) {
      console.error("Erro ao carregar produtos disponíveis:", error);
      setProdutosDisponiveis([]);
    }
  };

  // Modifique o useEffect existente para incluir o carregamento dos produtos disponíveis
  useEffect(() => {
    const carregarTodosDados = async () => {
      await carregarDados();
      await carregarProdutosDisponiveis();
    };

    carregarTodosDados();
  }, []);

  // PRODUTO X DEPARTAMENTO//

  // Adicionar produto a um departamento

  const adicionarProdutosAoDepartamento = async () => {
    if (!departamentoParaAdicionar || produtosSelecionados.length === 0) return;

    setLoading(true);
    try {
      // Adiciona todos os produtos selecionados
      await Promise.all(
        produtosSelecionados.map(produtoId =>
          dashboardApi.adicionarProdutoAoDepartamento(departamentoParaAdicionar, produtoId)
        )
      );

      // Atualiza as listas
      await Promise.all([
        carregarProdutosDepartamento(departamentoParaAdicionar),
        carregarProdutosDisponiveis() // Recarrega os produtos disponíveis
      ]);

      setShowAdicionarProdutoModal(false);
      setProdutosSelecionados([]);
      alert("Produtos adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar produtos:", error);
      alert("Erro ao adicionar produtos");
    } finally {
      setLoading(false);
    }
  };


  // Remover produto de um departamento
  const removerProdutoDepartamento = async (departamentoId: number, produtoId: number) => {
    if (!confirm("Remover este produto do departamento?")) return;

    try {
      await dashboardApi.removerProdutoDoDepartamento(departamentoId, produtoId);
      await carregarProdutosDepartamento(departamentoId);
      alert("Produto removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      alert("Erro ao remover produto");
    }
  };

  // Atualize o useEffect para carregar produtos ao carregar departamentos
  useEffect(() => {
    if (departamentos.length > 0) {
      departamentos.forEach(dept => {
        if (dept.id) {
          carregarProdutosDepartamento(dept.id).catch(error => {
            console.error(`Erro ao carregar produtos do departamento ${dept.id}:`, error);
          });
        }
      });
    }
  }, [departamentos]);



  // Expansão de descricao_ctr ///


  const toggleDescription = (departamentoId: number, produtoId: number) => {
    setProdutosPorDepartamento(prev => {
      const newState = { ...prev };
      if (newState[departamentoId]) {
        newState[departamentoId] = newState[departamentoId].map(produto => {
          if (produto.id === produtoId) {
            return { ...produto, showFullDescription: !produto.showFullDescription };
          }
          return produto;
        });
      }
      return newState;
    });
  };



  if (loading && tabelaData.length === 0) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
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
            <p>Total Serventes</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">📊</div>
          <div>
            <h3>R$ {metricas.previstoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <p>Previsto Total</p>
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
              const data = new Date(competencia); // transforma string em Date
              const mes = String(data.getMonth() + 1).padStart(2, "0"); // mês sempre com 2 dígitos
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
          <label>🏛️ Departamento</label> {/* Alterado de Produto para Departamento */}
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

      {/* Tabela Consolidada */}
      {activeTab === "tabela" && (
        <TableContainer>
          <div className="table-header">
            <h2>📊 Dados Consolidados</h2>
            <div className="table-actions">
              <span>{dadosFiltrados.length} registros encontrados</span>
              <Button
                onClick={exportToExcel}
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
              {tabelaData.length === 0 && (
                <Button onClick={() => {
                  setActiveTab("departamentos");
                  setShowDepartamentoModal(true);
                }}>
                  ➕ Cadastrar Primeiro Departamento
                </Button>
              )}
            </EmptyState>
          ) : (
            <ResponsiveTable>
              <Table>
                <thead>
                  <tr>
                    <th>Competencia</th>
                    <th>Filial</th>
                    <th>Departamento</th>
                    <th>Tipo</th>
                    <th>Data Base</th>
                    <th>Nº Serventes</th>
                    <th>Previsto per Capita</th>
                    <th>Previsto Total CTR</th>
                    <th>Servente Realizado</th>
                    <th>Realizado Per Capita</th>
                    <th>Realizado Total</th>
                    <th>Diferença</th>
                    <th>% Variação</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.map((row, index) => (
                    <tr key={`${row.cadastro_filial}-${row.cadastro_departamento}-${index}`}>
                      <td data-label="Competencia">
                        <strong>
                          {(() => {
                            const data = new Date(row.competencia);
                            const mes = String(data.getMonth() + 1).padStart(2, "0");
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
                      <td data-label="Data Base" style={{ color: 'red' }}>
                        R$ {Number(row.data_base || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

                      <td data-label="Servente Realizado" style={{ color: 'red' }}>
                        R$ {Number(row.servente_realizado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td data-label="Realizado Per Capita" style={{ color: 'red' }}>
                        R$ {Number(row.realizado_per_capita || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Acumulado Total" style={{ color: 'red' }}>
                        R$ {Number(row.acumulado_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td data-label="Diferença" style={{
                        color: Number(row.diferenca) >= 0 ? "#e74c3c" : "#27ae60",
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

      {/* Cadastro de Produtos */}
      {activeTab === "produtos" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.id}>
              <div className="product-header">
                <div className="product-icon">📦</div>
                <div className="product-code">{produto.codigo}</div>
              </div>
              <h3>{produto.descricao}</h3>

              {/* Área da descrição expansível */}
              <div className="product-description-container">
                <div className={`product-description ${produto.showFullDescription ? 'expanded' : 'collapsed'}`}>
                  {produto.descricao_ctr}
                </div>
                {produto.descricao_ctr?.length > 100 && (
                  <button
                    className="toggle-description-btn"
                  >

                  </button>

                )}
              </div>

              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Conta Financeira</span>
                  <span className="detail-value">{produto.conta_financeira || '-'}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Quantidade</span>
                  <span className="detail-value">{produto.produto_quantidade || '0'}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Valor Unitário</span>
                  <span className="detail-value">
                    {produto.valor_unitario ? `R$ ${Number(produto.valor_unitario).toFixed(2)}` : 'R$ 0,00'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Valor Total</span>
                  <span className="detail-value">
                    {produto.valor_total ? `R$ ${Number(produto.valor_total).toFixed(2)}` : 'R$ 0,00'}
                  </span>
                </div>
              </div>
              <div className="product-actions">
                <IconButton
                  title="Editar"
                  onClick={() => {
                    setProdutoForm({
                      codigo: produto.codigo,
                      conta_financeira: produto.conta_financeira,
                      descricao: produto.descricao,
                      descricao_ctr: produto.descricao_ctr,
                      produto_quantidade: produto.produto_quantidade,
                      valor_unitario: produto.valor_unitario,
                      valor_total: produto.valor_total
                    });
                    setEditandoId(produto.id);
                    setShowProdutoModal(true);
                  }}
                >
                  ✏️
                </IconButton>
                <IconButton
                  title="Excluir"
                  className="danger"
                  onClick={() => excluirProduto(produto.id)}
                >
                  🗑️
                </IconButton>

              </div>
            </ProductCard>
          ))}
        </div>
      )}
      {/* Cadastro de Departamentos */}
      {activeTab === "departamentos" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {departamentosFiltrados.map((departamento) => (
            <DepartmentCard key={departamento.id}>
              <div className="department-header">
                <div className="department-icon">🏢</div>
                <div className="department-title">
                  <h3>{departamento.cadastro_departamento}</h3>
                  <span className="department-branch">Filial: {departamento.cadastro_filial}</span>
                </div>
              </div>
              <div className="department-stats">
                <div className="stat">
                  <div className="stat-icon">👥</div>
                  <div>
                    <div className="stat-value">{departamento.numero_serventes}</div>
                    <div className="stat-label">Serventes</div>
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-icon">💰</div>
                  <div>
                    <div className="stat-value">
                      R$ {Number(departamento.previsto_total_ctr).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="stat-label">Previsto CTR</div>
                  </div>
                </div>
              </div>
              <div className="department-actions">
                <IconButton
                  title="Editar"
                  onClick={() => {
                    setDepartamentoForm({
                      cadastro_filial: departamento.cadastro_filial,
                      cadastro_departamento: departamento.cadastro_departamento,
                      tipo_departamento: departamento.tipo_departamento,
                      competencia: departamento.competencia,
                      numero_serventes: departamento.numero_serventes,
                      previsto_total_ctr: departamento.previsto_total_ctr
                    });
                    setEditandoId(departamento.id);
                    setShowDepartamentoModal(true);
                  }}
                >
                  ✏️
                </IconButton>
                <IconButton
                  title="Excluir"
                  className="danger"
                  onClick={() => excluirDepartamento(departamento.id)}
                >
                  🗑️
                </IconButton>
              </div>
              <div className="department-products">
                <div className="products-header">
                  <h4>Produtos Associados</h4>
                  <Button
                    onClick={() => {
                      setDepartamentoParaAdicionar(departamento.id);
                      setProdutosSelecionados([]);
                      setShowAdicionarProdutoModal(true);
                    }}
                  >
                    ➕ Adicionar Produtos
                  </Button>
                </div>

                {produtosPorDepartamento[departamento.id]?.length > 0 ? (
                  <div className="linked-products-container">
                    <div className="linked-products-header">
                      <h4>📦 Produtos Vinculados</h4>
                      <span className="count-badge">{produtosPorDepartamento[departamento.id].length} itens</span>
                    </div>
                    <ul className="linked-products-list">
                      {produtosPorDepartamento[departamento.id].map(produto => (
                        <li key={produto.id} className="linked-product-item">
                          <div className="product-top-info">
                            <span className="product-code">{produto.codigo}</span>
                            <span className="product-name">{produto.descricao}</span>
                            <div className="product-description-container">
                              <div className={`product-description ${produto.showFullDescription ? 'expanded' : 'collapsed'}`}>
                                {produto.descricao_ctr}
                              </div>
                              {produto.descricao_ctr?.length > 100 && (
                                <button
                                  className="toggle-description-btn"
                                  onClick={() => toggleDescription(departamento.id, produto.id)}
                                >
                                  {produto.showFullDescription ? 'Mostrar menos' : 'Mostrar mais'}
                                  <span className={`chevron ${produto.showFullDescription ? 'up' : 'down'}`}>▼</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="product-bottom-section">
                            <div className="product-values">
                              <div className="value-item">
                                <span className="value-label">Quantidade:</span>
                                <span className="value-amount">{produto.produto_quantidade} </span>
                              </div>
                              <div className="value-item">
                                <span className="value-label">Unitário:</span>
                                <span className="value-amount">{produto.valor_unitario ? `R$ ${Number(produto.valor_unitario).toFixed(2)}` : 'R$ 0,00'}</span>
                              </div>
                              <div className="value-item">
                                <span className="value-label">Total:</span>
                                <span className="value-amount">{produto.valor_total ? `R$ ${Number(produto.valor_total).toFixed(2)}` : 'R$ 0,00'}</span>
                              </div>
                            </div>
                            <IconButton
                              className="danger remove-button"
                              onClick={() => removerProdutoDepartamento(departamento.id, produto.id)}
                              title="Remover produto"
                            >
                              🗑️
                            </IconButton>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="no-products-message">
                    <span>Nenhum produto vinculado</span>
                  </div>
                )}
              </div>

            </DepartmentCard>
          ))}
        </div>
      )}

      {/* Modal Cadastro Produto */}
      {showProdutoModal && (
        <Modal onClick={() => {
          setShowProdutoModal(false);
          setEditandoId(null);
          setProdutoForm({ codigo: "", conta_financeira: "", descricao: "", descricao_ctr: "", produto_quantidade: 0, valor_unitario: 0, valor_total: 0 });
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editandoId ? "✏️ Editar Produto" : "📦 Cadastrar Novo Produto"}</h2>
              <CloseButton onClick={() => setShowProdutoModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <label>Código *</label>
                <Input
                  value={produtoForm.codigo}
                  onChange={(e) => setProdutoForm({ ...produtoForm, codigo: e.target.value })}
                  placeholder="Digite o código do produto"
                />
              </FormGroup>
              <FormGroup>
                <label>Conta Financeira *</label>
                <Input
                  value={produtoForm.conta_financeira}
                  onChange={(e) => setProdutoForm({ ...produtoForm, conta_financeira: e.target.value })}
                  placeholder="Digite a conta financeira"
                />
              </FormGroup>
              <FormGroup>
                <label>Descrição *</label>
                <Input
                  value={produtoForm.descricao}
                  onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                  placeholder="Digite a descrição do produto"
                />
              </FormGroup>
              <FormGroup>
                <label>Descrição (<span>Contrato</span>)</label>
                <Input
                  value={produtoForm.descricao_ctr}
                  onChange={(e) => setProdutoForm({ ...produtoForm, descricao_ctr: e.target.value })}
                  placeholder="Digite a descrição do produto (Contrato)"
                />
              </FormGroup>
              <FormGroup>
                <label>Quantidade</label>
                <Input
                  type="number"
                  step="0.01"
                  value={produtoForm.produto_quantidade}
                  onChange={(e) => setProdutoForm({
                    ...produtoForm,
                    produto_quantidade: parseFloat(e.target.value) || 0
                  })}
                  placeholder="Digite a quantidade"
                />
              </FormGroup>
              <FormGroup>
                <label>Valor Unitário</label>
                <Input
                  type="number"
                  step="0.01"
                  value={produtoForm.valor_unitario}
                  onChange={(e) => setProdutoForm({
                    ...produtoForm,
                    valor_unitario: parseFloat(e.target.value) || 0
                  })}
                  placeholder="Digite o valor unitário"
                />
              </FormGroup>
              <FormGroup>
                <label>Valor Total</label>
                <Input
                  type="number"
                  step="0.01"
                  value={produtoForm.valor_total}
                  onChange={(e) => setProdutoForm({
                    ...produtoForm,
                    valor_total: parseFloat(e.target.value) || 0
                  })}
                  placeholder="Digite o valor total"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                className="secondary"
                onClick={() => setShowProdutoModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button onClick={salvarProduto} disabled={loading}>
                {loading ? "Salvando..." : (editandoId ? "Atualizar Produto" : "Salvar Produto")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* Modal Cadastro Departamento */}
      {showDepartamentoModal && (
        <Modal onClick={() => {
          setShowDepartamentoModal(false);
          setEditandoId(null);
          setDepartamentoForm({
            cadastro_filial: "",
            cadastro_departamento: "",
            tipo_departamento: "",
            competencia: "",
            numero_serventes: "",
            previsto_total_ctr: ""

          });
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editandoId ? "✏️ Editar Departamento" : "🏢 Cadastrar Novo Departamento"}</h2>
              <CloseButton onClick={() => setShowDepartamentoModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <label>Filial *</label>
                <Input
                  value={departamentoForm.cadastro_filial}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, cadastro_filial: e.target.value })}
                  placeholder="Digite o nome da filial"
                />
              </FormGroup>
              <FormGroup>
                <label>Departamento *</label>
                <Input
                  value={departamentoForm.cadastro_departamento}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, cadastro_departamento: e.target.value })}
                  placeholder="Digite o nome do departamento"
                />
              </FormGroup>
              <FormGroup>
                <label>Tipo *</label>
                <Input
                  value={departamentoForm.tipo_departamento}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, tipo_departamento: e.target.value })}
                  placeholder="Digite o tipo do departamento"
                />
              </FormGroup>
              <FormGroup>
                <label>Competencia *</label>
                <Input
                  value={departamentoForm.competencia}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, competencia: e.target.value })}
                  placeholder="Competencia"
                  type="date"
                />
              </FormGroup>

              <FormGroup>
                <label>Número de Serventes *</label>
                <Input
                  type="number"
                  value={departamentoForm.numero_serventes}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, numero_serventes: e.target.value })}
                  placeholder="Digite o número de serventes"
                />
              </FormGroup>
              <FormGroup>
                <label>Previsto Total CTR *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={departamentoForm.previsto_total_ctr}
                  onChange={(e) => setDepartamentoForm({ ...departamentoForm, previsto_total_ctr: e.target.value })}
                  placeholder="Digite o valor previsto"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                className="secondary"
                onClick={() => setShowDepartamentoModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button onClick={salvarDepartamento} disabled={loading}>
                {loading ? "Salvando..." : (editandoId ? "Atualizar Departamento" : "Salvar Departamento")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Modal Adicionar Produtos */}
      {showAdicionarProdutoModal && (
        <ProductSelectionModal onClick={() => setShowAdicionarProdutoModal(false)}>
          <ProductSelectionContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>📦 Adicionar Produtos</h2>
              <CloseButton onClick={() => setShowAdicionarProdutoModal(false)}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              <ProductGrid>
                {produtosDisponiveis.map(produto => {
                  const isSelected = produtosSelecionados.includes(produto.id);
                  return (
                    <ProductSelectionCard
                      key={produto.id}
                      selected={isSelected}
                      onClick={() => {
                        setProdutosSelecionados(prev =>
                          prev.includes(produto.id)
                            ? prev.filter(id => id !== produto.id)
                            : [...prev, produto.id]
                        );
                      }}
                    >

                      <ProductIcon selected={isSelected}>
                        📦
                      </ProductIcon>

                      <ProductInfo>
                        <h3>{produto.descricao}</h3>
                        <h3>{produto.descricao_ctr}</h3>
                        <p> Descrição: {produto.codigo}</p>
                        <p> Conta: {produto.conta_financeira}</p>
                        <p> Quantidade: {produto.produto_quantidade}</p>
                        <p> Valor Unit: {produto.valor_unitario}</p>
                        <p> Valor Total: {produto.valor_total}</p>
                      </ProductInfo>

                      <SelectionIndicator selected={isSelected} />
                    </ProductSelectionCard>
                  );
                })}
              </ProductGrid>
            </ModalBody>

            <ProductSelectionFooter>
              <div className="selected-count">
                Selecionados: <span>{produtosSelecionados.length}</span>
              </div>
              <Button
                onClick={adicionarProdutosAoDepartamento}
                disabled={produtosSelecionados.length === 0 || loading}
              >
                {loading ? "Adicionando..." : `Adicionar (${produtosSelecionados.length})`}
              </Button>
            </ProductSelectionFooter>
          </ProductSelectionContent>
        </ProductSelectionModal>
      )}
      {/* Floating Action Button para mobile */}
      <FloatingActionButton
        onClick={() => {
          if (activeTab === "produtos") {
            setProdutoForm({ codigo: "", conta_financeira: "", descricao: "", descricao_ctr: "", produto_quantidade: 0, valor_unitario: 0, valor_total: 0 });
            setEditandoId(null);
            setShowProdutoModal(true);
          }
          if (activeTab === "departamentos") {
            setDepartamentoForm({
              cadastro_filial: "",
              cadastro_departamento: "",
              tipo_departamento: "",
              competencia: "",
              numero_serventes: "",
              previsto_total_ctr: ""
            });
            setEditandoId(null);
            setShowDepartamentoModal(true);
          }
        }}
        style={{ display: activeTab === "tabela" ? "none" : "flex" }}
      >
        ➕
      </FloatingActionButton>
    </Container>
  );
};

export default Dashboard;