import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  FiltersContainer,
  FilterGroup,
  TableContainer,
  Table,
  Button,
  MetricsGrid,
  MetricCard,
  SearchBar,
  EmptyState,
  LoadingSpinner,
  ResponsiveTable,
  Input
} from "./styles";
import { dashboardApi } from "../../services/api";
import * as XLSX from 'xlsx';

interface Departamento {
  id: number;
  cadastro_filial: string;
  cadastro_departamento: string;
  tipo_departamento: string;
  competencia: string;
  numero_serventes: number;
  previsto_total_ctr: number;
  acumulado_total: number;
}

interface Produto {
  id: number;
  codigo: string;
  descricao: string;
  descricao_ctr: string;
  produto_quantidade: number;
  valor_unitario: number;
  valor_total: number;
  departamento_id?: number;
}

const RelatorioPage: React.FC = () => {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [departamentosExpandidos, setDepartamentosExpandidos] = useState<number[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState<number | null>(null);
  const [filtroFilial, setFiltroFilial] = useState("todas");
  const [filtroDepartamento, setFiltroDepartamento] = useState("todos");
  const [editandoProduto, setEditandoProduto] = useState<number | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [departamentosData, produtosData] = await Promise.all([
        dashboardApi.getDepartamentos(),
        dashboardApi.getProdutos()
      ]);

      setDepartamentos(departamentosData || []);
      setProdutos(produtosData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar departamentos
  const departamentosFiltrados = departamentos.filter(depto => {
    const filialMatch = filtroFilial === "todas" || depto.cadastro_filial === filtroFilial;
    const departamentoMatch = filtroDepartamento === "todos" || depto.cadastro_departamento === filtroDepartamento;
    const searchMatch = searchTerm === "" || 
      depto.cadastro_filial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depto.cadastro_departamento.toLowerCase().includes(searchTerm.toLowerCase());

    return filialMatch && departamentoMatch && searchMatch;
  });

  // Calcular acumulado total (soma de todos os produtos)
  const acumuladoTotal = produtos.reduce((total, produto) => total + (produto.valor_total || 0), 0);

  // Calcular métricas
  const metricas = {
    totalFiliais: new Set(departamentosFiltrados.map(d => d.cadastro_filial)).size,
    totalServentes: departamentosFiltrados.reduce((acc, d) => acc + (d.numero_serventes || 0), 0),
    previstoTotal: departamentosFiltrados.reduce((acc, d) => acc + (d.previsto_total_ctr || 0), 0),
    realizadoTotal: acumuladoTotal
  };

  // Expandir/recolher departamento
  const toggleDepartamento = async (departamentoId: number) => {
    if (departamentosExpandidos.includes(departamentoId)) {
      setDepartamentosExpandidos(departamentosExpandidos.filter(id => id !== departamentoId));
      return;
    }

    setCarregandoProdutos(departamentoId);
    
    try {
      const produtosDepartamento = await dashboardApi.getProdutosPorDepartamento(departamentoId);
      
      const produtosAtualizados = produtos.map(produto => {
        const produtoDoDepto = produtosDepartamento.find((p: any) => p.id === produto.id);
        return produtoDoDepto ? { ...produto, departamento_id: departamentoId } : produto;
      });
      
      setProdutos(produtosAtualizados);
      setDepartamentosExpandidos([...departamentosExpandidos, departamentoId]);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
    
    setCarregandoProdutos(null);
  };

  // Obter produtos de um departamento
  const getProdutosDepartamento = (departamentoId: number) => {
    return produtos.filter(produto => produto.departamento_id === departamentoId);
  };

  // Calcular total de produtos de um departamento
  const calcularTotalDepartamento = (departamentoId: number) => {
    const produtosDepto = getProdutosDepartamento(departamentoId);
    return produtosDepto.reduce((total, produto) => total + (produto.valor_total || 0), 0);
  };

  // Atualizar produto em tempo real
  const atualizarProdutoLocal = (produtoId: number, campo: string, valor: number) => {
    const novosProdutos = produtos.map(produto => {
      if (produto.id === produtoId) {
        const produtoAtualizado = { ...produto, [campo]: valor };
        
        // Calcular valor_total automaticamente
        if (campo === 'produto_quantidade' || campo === 'valor_unitario') {
          produtoAtualizado.valor_total = produtoAtualizado.produto_quantidade * produtoAtualizado.valor_unitario;
        }
        
        return produtoAtualizado;
      }
      return produto;
    });
    
    setProdutos(novosProdutos);
  };

  // Salvar produto no banco
  const salvarProduto = async (produto: Produto) => {
    try {
      await dashboardApi.updateProduto(produto.id, produto);
      setEditandoProduto(null);
      // Recarregar dados para atualizar o acumulado_total no departamento
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // Adicionar novo produto
  const adicionarProduto = async (departamentoId: number) => {
    try {
      const novoProduto = {
        codigo: "NOVO",
        descricao: "Novo Produto",
        descricao_ctr: "Novo Produto CTR",
        produto_quantidade: 1,
        valor_unitario: 0,
        valor_total: 0,
        departamento_id: departamentoId
      };

      const produtoCriado = await dashboardApi.createProduto(novoProduto);
      setProdutos([...produtos, produtoCriado]);
      await carregarDados(); // Recarregar para atualizar acumulado_total
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  // Exportar para Excel
  const exportarExcel = () => {
    const dadosParaExportar = departamentosFiltrados.map(depto => ({
      Filial: depto.cadastro_filial,
      Departamento: depto.cadastro_departamento,
      Tipo: depto.tipo_departamento,
      Competencia: depto.competencia,
      'Nº Serventes': depto.numero_serventes,
      'Previsto Total CTR': depto.previsto_total_ctr || 0,
      'Realizado Total': depto.acumulado_total || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departamentos");
    XLSX.writeFile(workbook, `departamentos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Formatar moeda - VERSÃO CORRIGIDA
  const formatarMoeda = (valor: number | undefined | null): string => {
    if (valor === undefined || valor === null || isNaN(valor)) {
      return "R$ 0,00";
    }
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
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
          <h1>🏢 Central de Inteligência Operacional</h1>
          <p>Gestão de Departamentos e Produtos</p>
        </div>
        <SearchBar>
          <input
            type="text"
            placeholder="🔍 Pesquisar por filial ou departamento..."
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
            <p>Filiais</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">👥</div>
          <div>
            <h3>{metricas.totalServentes}</h3>
            <p>Serventes</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">📊</div>
          <div>
            <h3>{formatarMoeda(metricas.previstoTotal)}</h3>
            <p>Previsto Total</p>
          </div>
        </MetricCard>
        <MetricCard>
          <div className="metric-icon">💰</div>
          <div>
            <h3>{formatarMoeda(metricas.realizadoTotal)}</h3>
            <p>Realizado Total</p>
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* Filtros */}
      <FiltersContainer>
        <FilterGroup>
          <label>🏢 Filial</label>
          <select value={filtroFilial} onChange={(e) => setFiltroFilial(e.target.value)}>
            <option value="todas">Todas as filiais</option>
            {Array.from(new Set(departamentos.map(d => d.cadastro_filial)))
              .filter(Boolean)
              .map(filial => (
                <option key={filial} value={filial}>{filial}</option>
              ))}
          </select>
        </FilterGroup>

        <FilterGroup>
          <label>🏛️ Departamento</label>
          <select value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)}>
            <option value="todos">Todos os departamentos</option>
            {Array.from(new Set(departamentos.map(d => d.cadastro_departamento)))
              .filter(Boolean)
              .map(depto => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
          </select>
        </FilterGroup>
      </FiltersContainer>

      {/* Tabela */}
      <TableContainer>
        <div className="table-header">
          <h2>📊 Departamentos - Acumulado Total: {formatarMoeda(acumuladoTotal)}</h2>
          <div className="table-actions">
            <span>{departamentosFiltrados.length} departamentos encontrados</span>
            <Button onClick={exportarExcel}>📤 Exportar Excel</Button>
          </div>
        </div>

        {departamentosFiltrados.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📊</div>
            <h3>Nenhum departamento encontrado</h3>
            <p>Tente ajustar os filtros de busca</p>
          </EmptyState>
        ) : (
          <ResponsiveTable>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Competência</th>
                  <th>Filial</th>
                  <th>Departamento</th>
                  <th>Serventes</th>
                  <th>Previsto CTR</th>
                  <th>Realizado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {departamentosFiltrados.map((depto) => {
                  const totalCalculado = calcularTotalDepartamento(depto.id);
                  return (
                    <React.Fragment key={depto.id}>
                      {/* Linha do Departamento */}
                      <tr 
                        onClick={() => toggleDepartamento(depto.id)}
                        style={{ 
                          cursor: 'pointer', 
                          backgroundColor: departamentosExpandidos.includes(depto.id) ? '#f5f5f5' : 'transparent' 
                        }}
                      >
                        <td>
                          {carregandoProdutos === depto.id ? (
                            <LoadingSpinner />
                          ) : (
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                              {departamentosExpandidos.includes(depto.id) ? '▼' : '►'}
                            </span>
                          )}
                        </td>
                        <td>{depto.competencia}</td>
                        <td><strong>{depto.cadastro_filial}</strong></td>
                        <td><strong>{depto.cadastro_departamento}</strong></td>
                        <td>{depto.numero_serventes || 0}</td>
                        <td>{formatarMoeda(depto.previsto_total_ctr || 0)}</td>
                        <td style={{ 
                          color: (depto.acumulado_total || 0) > (depto.previsto_total_ctr || 0) ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {formatarMoeda(depto.acumulado_total || 0)}
                        </td>
                     
                      </tr>

                      {/* Produtos do Departamento (se expandido) */}
                      {departamentosExpandidos.includes(depto.id) && (
                        <>
                          {getProdutosDepartamento(depto.id).map((produto) => (
                            <tr key={produto.id} style={{ backgroundColor: '#f9f9f9' }}>
                              <td colSpan={2}></td>
                              <td colSpan={2}>
                                <div style={{ paddingLeft: '20px' }}>
                                  <strong>{produto.descricao || produto.descricao_ctr}</strong>
                                  <br />
                                  <small>Código: {produto.codigo}</small>
                                </div>
                              </td>
                              <td>
                                {editandoProduto === produto.id ? (
                                  <Input
                                    type="number"
                                    value={produto.produto_quantidade || 0}
                                    onChange={(e) => atualizarProdutoLocal(produto.id, 'produto_quantidade', Number(e.target.value))}
                                    style={{ width: '60px' }}
                                  />
                                ) : (
                                  `Qtd: ${produto.produto_quantidade || 0}`
                                )}
                              </td>
                              <td>
                                {editandoProduto === produto.id ? (
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={produto.valor_unitario || 0}
                                    onChange={(e) => atualizarProdutoLocal(produto.id, 'valor_unitario', Number(e.target.value))}
                                    style={{ width: '80px' }}
                                  />
                                ) : (
                                  `Unit: ${formatarMoeda(produto.valor_unitario || 0)}`
                                )}
                              </td>
                              <td>
                                <strong>Total: {formatarMoeda(produto.valor_total || 0)}</strong>
                              </td>
                              <td>
                                {editandoProduto === produto.id ? (
                                  <Button 
                 
                                    onClick={() => salvarProduto(produto)}
                                  >
                                    Salvar
                                  </Button>
                                ) : (
                                  <Button 
                                    
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditandoProduto(produto.id);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                          
                          {/* Total do Departamento */}
                          {getProdutosDepartamento(depto.id).length > 0 && (
                            <tr style={{ backgroundColor: '#e8f4f8', fontWeight: 'bold' }}>
                              <td colSpan={5} style={{ textAlign: 'right' }}>
                                Total Calculado: 
                              </td>
                              <td colSpan={3} style={{ color: 'green' }}>
                                {formatarMoeda(totalCalculado)}
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </ResponsiveTable>
        )}
      </TableContainer>
    </Container>
  );
};

export default RelatorioPage;