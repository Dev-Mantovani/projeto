import React, { useState, useEffect } from 'react';
import { dashboardApi } from "../../services/api";
import * as S from './styles';

interface Departamento {
    id: number;
    cadastro_filial: string;
    cadastro_departamento: string;
    tipo_departamento: string;
    competencia: string;
    numero_serventes: number;
    previsto_total_ctr: number;
}

interface ProdutoDepartamento {
  id: number;
  produto_id: number;
  departamento_id: number;
  produto_quantidade: number;
  valor_unitario: number;
  valor_total: number;
  produto?: {  // Tornando produto opcional
    codigo?: string;
    descricao?: string;
    descricao_ctr?: string;
  };
}

interface ProdutoVinculado {
  id: number;
  departamento_id: number;
  produto_id: number;
  created_at: string;
  produto?: {  // Dados do produto que vamos carregar
    id: number;
    codigo: string;
    descricao: string;
    descricao_ctr?: string;
    produto_quantidade?: number;
    valor_unitario?: number;
    valor_total?: number;
  };
}

const RelatorioPage: React.FC = () => {
    const [filiais, setFiliais] = useState<string[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [produtosPorDepartamento, setProdutosPorDepartamento] = useState<{ [key: number]: ProdutoDepartamento[] }>({});
    const [loading, setLoading] = useState(true);

    // Filtros selecionados
    const [filtros, setFiltros] = useState({
        filial: '',
        tipo: '',
        competencia: ''
    });

    // Dados para preenchimento
    const [dadosPreenchimento, setDadosPreenchimento] = useState({
        serventesRealizado: '',
        realizadoPerCapita: '',
        realizadoTotal: '',
        ordemCompra: ''
    });

    // Carrega dados iniciais
  useEffect(() => {
  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carrega departamentos
      const departamentosData = await dashboardApi.getDepartamentos();
      setDepartamentos(departamentosData);

      // Extrai filiais únicas
      const filiaisUnicas = [...new Set(
        departamentosData.map(d => d.cadastro_filial).filter(Boolean)
      )];
      setFiliais(filiaisUnicas);

      // Carrega produtos apenas para os departamentos filtrados inicialmente
      const initialDepts = departamentosData.slice(0, 3); // Carrega apenas os 3 primeiros para não sobrecarregar
      await Promise.all(
        initialDepts.map(dept => carregarProdutosDepartamento(dept.id))
      );

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  carregarDados();
}, []);

// Carregar Produto X Departamento // 


    const carregarProdutosDepartamento = async (departamentoId: number) => {
  try {
    // 1. Primeiro pega os vínculos
    const vinculos = await dashboardApi.getProdutosPorDepartamento(departamentoId);
    
    // 2. Depois pega os detalhes de cada produto
    const produtosCompletos = await Promise.all(
      vinculos.map(async (vinculo) => {
        const produto = await dashboardApi.getProdutos(vinculo.produto_id);
        return {
          ...vinculo,
          produto: produto || null
        };
      })
    );
    
    setProdutosPorDepartamento(prev => ({
      ...prev,
      [departamentoId]: produtosCompletos
    }));
    
  } catch (error) {
    console.error(`Erro ao carregar produtos do departamento ${departamentoId}:`, error);
  }
};

    // Filtra departamentos com base nas seleções
    const departamentosFiltrados = departamentos.filter(dept => {
        return (
            (filtros.filial === '' || dept.cadastro_filial === filtros.filial) &&
            (filtros.tipo === '' || dept.tipo_departamento === filtros.tipo) &&
            (filtros.competencia === '' || dept.competencia === filtros.competencia)
        );
    });

    // Competências disponíveis para o tipo selecionado
    const competenciasDisponiveis = [...new Set(
        departamentos
            .filter(d => d.tipo_departamento === filtros.tipo)
            .map(d => d.competencia)
    )];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDadosPreenchimento(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Implemente a lógica de salvamento conforme sua necessidade
            // Exemplo: await dashboardApi.updateDepartamento(...)
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro ao salvar dados');
        } finally {
            setLoading(false);
        }
    };

    
    

    if (loading) {
        return <S.LoadingSpinner>Carregando...</S.LoadingSpinner>;
    }

    return (
        <S.Container>
            <S.Header>
                <h1>Relatório de Departamentos</h1>
                <p>Preencha os filtros para visualizar os dados</p>
            </S.Header>

            <S.FiltersContainer>
                <S.FilterGroup>
                    <label>Filial</label>
                    <select
                        value={filtros.filial}
                        onChange={(e) => setFiltros({ ...filtros, filial: e.target.value })}
                    >
                        <option value="">Selecione uma filial</option>
                        {filiais.map(filial => (
                            <option key={filial} value={filial}>{filial}</option>
                        ))}
                    </select>
                </S.FilterGroup>

                <S.FilterGroup>
                    <label>Tipo de Departamento</label>
                    <select
                        value={filtros.tipo}
                        onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value, competencia: '' })}
                    >
                        <option value="">Selecione um tipo</option>
                        <option value="Faturado">Faturado</option>
                        <option value="Pedido Mensal">Pedido Mensal</option>
                    </select>
                </S.FilterGroup>

                {filtros.tipo && (
                    <S.FilterGroup>
                        <label>Competência</label>
                        <select
                            value={filtros.competencia}
                            onChange={(e) => setFiltros({ ...filtros, competencia: e.target.value })}
                        >
                            <option value="">Selecione uma competência</option>
                            {competenciasDisponiveis.map(comp => (
                                <option key={comp} value={comp}>{comp}</option>
                            ))}
                        </select>
                    </S.FilterGroup>
                )}
            </S.FiltersContainer>

            {departamentosFiltrados.length > 0 && (
                <>
                    <S.TableContainer>
                        <S.Table>
                            <thead>
                                <tr>
                                    <th>Filial</th>
                                    <th>Departamento</th>
                                    <th>Tipo</th>
                                    <th>Competência</th>
                                    <th>Nº Serventes</th>
                                    <th>Valor Estimado</th>
                                    <th>Nº Serventes Realizado</th>
                                    <th>Realizado per capita</th>
                                    <th>Realizado Total</th>
                                    <th>Ordem de Compra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departamentosFiltrados.map((dept) => (
                                    <tr key={dept.id}>
                                        <td>{dept.cadastro_filial}</td>
                                        <td>{dept.cadastro_departamento}</td>
                                        <td>{dept.tipo_departamento}</td>
                                        <td>{dept.competencia}</td>
                                        <td>{dept.numero_serventes}</td>
                                        <td>R$ {dept.previsto_total_ctr.toFixed(2)}</td>
                                        <td>
                                            <S.Input
                                                type="number"
                                                name="serventesRealizado"
                                                value={dadosPreenchimento.serventesRealizado}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <S.Input
                                                type="number"
                                                step="0.01"
                                                name="realizadoPerCapita"
                                                value={dadosPreenchimento.realizadoPerCapita}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <S.Input
                                                type="number"
                                                step="0.01"
                                                name="realizadoTotal"
                                                value={dadosPreenchimento.realizadoTotal}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <S.Input
                                                type="text"
                                                name="ordemCompra"
                                                value={dadosPreenchimento.ordemCompra}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </S.Table>
                    </S.TableContainer>

                   
                    {/* Lista de produtos vinculados */}
{departamentosFiltrados.map(dept => {
  const produtosDoDept = produtosPorDepartamento[dept.id] || [];
  
  return (
    <S.ProductsSection key={`produtos-${dept.id}`}>
      <h3>Produtos vinculados ao departamento: {dept.cadastro_departamento}</h3>
      
      {produtosDoDept.length > 0 ? (
        <S.ProductsGrid>
          {produtosDoDept.map(prod => {
            if (!prod.produto) return null; // Pula se não tiver produto
            
            return (
              <S.ProductCard key={prod.id}>
                <div className="product-code">{prod.produto.codigo || 'N/A'}</div>
                <div className="product-name">{prod.produto.descricao}</div>
                <div className="product-description">
                  {prod.produto.descricao_ctr || 'Sem descrição adicional'}
                </div>
                <div className="product-values">
                  <div>Qtd: {prod.produto.produto_quantidade || 0}</div>
                  <div>Unit: R$ {prod.produto.valor_unitario?.toFixed(2) || '0.00'}</div>
                  <div>Total: R$ {prod.produto.valor_total?.toFixed(2) || '0.00'}</div>
                </div>
              </S.ProductCard>
            );
          })}
        </S.ProductsGrid>
      ) : (
        <S.EmptyState>
          {produtosPorDepartamento[dept.id] === undefined 
            ? 'Carregando produtos...' 
            : 'Nenhum produto vinculado'}
        </S.EmptyState>
      )}
    </S.ProductsSection>
  );
})}

                    <S.FormActions>
                        <S.Button type="button" secondary>Cancelar</S.Button>
                        <S.Button type="submit" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </S.Button>
                    </S.FormActions>
                </>
            )}

            {filtros.competencia && departamentosFiltrados.length === 0 && (
                <S.EmptyState>
                    Nenhum departamento encontrado para os filtros selecionados
                </S.EmptyState>
            )}
        </S.Container>
    );
};

export default RelatorioPage;