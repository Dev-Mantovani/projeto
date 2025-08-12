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
  Button
} from "./styles";

import { dashboardApi } from "../../services/api";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tabela");

  // Estados dos dados
  const [tabelaData, setTabelaData] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);

  // Formulários
  const [produtoForm, setProdutoForm] = useState({ codigo: "", conta_financeira: "", descricao: "" });
  const [departamentoForm, setDepartamentoForm] = useState({ cadastro_filial:"", cadastro_departamento:"", numero_serventes: "", previsto_total_ctr: "" });

  // Buscar dados ao carregar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dadosConsolidados = await dashboardApi.getDadosConsolidados();
    const produtosList = await dashboardApi.getProdutos();
    const departamentosList = await dashboardApi.getDepartamentos();
    setTabelaData(dadosConsolidados);
    setProdutos(produtosList);
    setDepartamentos(departamentosList);
  };

  // Cadastrar Produto
  const salvarProduto = async () => {
    if (!produtoForm.codigo || !produtoForm.conta_financeira || !produtoForm.descricao) {
      alert("Preencha todos os campos");
      return;
    }
    await dashboardApi.createProduto(produtoForm);
    setProdutoForm({ codigo: "", conta_financeira: "", descricao: "" });
    carregarDados();
  };

  // Cadastrar Departamento
  const salvarDepartamento = async () => {
    if (!departamentoForm.numero_serventes || !departamentoForm.previsto_total_ctr || !departamentoForm.cadastro_filial || !departamentoForm.cadastro_departamento) {
      alert("Preencha todos os campos");
      return;
    }
    await dashboardApi.createDepartamento(departamentoForm);
    setDepartamentoForm({ cadastro_filial:"", cadastro_departamento:"", numero_serventes: "", previsto_total_ctr: "" });
    carregarDados();
  };

  return (
    <Container>
      <Header>
        <h1>Painel Administrativo</h1>
        <p>Consolidado de Pedidos por Filial</p>
      </Header>

      {/* Filtros */}
      <FiltersContainer>
        <FilterGroup>
          <label>Período</label>
          <select>
            <option>Todos os períodos</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>Filial</label>
          <select>
            <option>Todas as filiais</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>Produto</label>
          <select>
            <option>Todos os produtos</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <label>Status</label>
          <select>
            <option>Todos os status</option>
          </select>
        </FilterGroup>
      </FiltersContainer>

      {/* Abas */}
      <Tabs>
        <TabButton active={activeTab === "tabela"} onClick={() => setActiveTab("tabela")}>
          Tabela Consolidada
        </TabButton>
        <TabButton active={activeTab === "produtos"} onClick={() => setActiveTab("produtos")}>
          Cadastro de Produtos
        </TabButton>
        <TabButton active={activeTab === "departamentos"} onClick={() => setActiveTab("departamentos")}>
          Cadastro de Departamentos
        </TabButton>
      </Tabs>

      {/* Tabela Consolidada */}
      {activeTab === "tabela" && (
        <TableContainer>
          <h2>Dados Consolidados</h2>
          <Table>
            <thead>
              <tr>
                <th>Filial</th>
                <th>Previsto Per Capita</th>
                <th>Cadastro Filial</th>
                <th>Cadastro Departamento</th>
                <th>Nº Serventes</th>
                <th>Previsto Total CTR</th>
                <th>Realizado Per Capita</th>
                <th>Acumulado Total</th>
                <th>Diferença</th>
                <th>% Variação</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tabelaData.map((row, index) => (
                <tr key={index}>
                  <td>{row.filial}</td>
                  <td>R$ {Number(row.previsto_per_capita).toFixed(2)}</td>
                  <td>{row.cadastro_filial}</td>
                  <td>{row.cadastro_departamento}</td>
                  <td>{row.numero_serventes}</td>
                  <td>R$ {Number(row.previsto_total_ctr).toFixed(2)}</td>
                  <td>R$ {Number(row.realizado_per_capita).toFixed(2)}</td>
                  <td>R$ {Number(row.acumulado_total).toFixed(2)}</td>
                  <td style={{ color: row.diferenca >= 0 ? "red" : "green" }}>
                    R$ {Number(row.diferenca).toFixed(2)}
                  </td>
                  <td style={{ color: row.variacao >= 0 ? "red" : "green" }}>
                    {Number(row.variacao).toFixed(2)}%
                  </td>
                  <td>
                    <StatusBadge status={row.status}>{row.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Cadastro de Produtos */}
      {activeTab === "produtos" && (
        <FormContainer>
          <h2>Cadastro de Produtos</h2>
          <FormGroup>
            <label>Código</label>
            <Input
              value={produtoForm.codigo}
              onChange={(e) => setProdutoForm({ ...produtoForm, codigo: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <label>Conta Financeira</label>
            <Input
              value={produtoForm.conta_financeira}
              onChange={(e) => setProdutoForm({ ...produtoForm, conta_financeira: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <label>Descrição</label>
            <Input
              value={produtoForm.descricao}
              onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
            />
          </FormGroup>
          <Button onClick={salvarProduto}>Salvar</Button>

          {/* Lista de produtos cadastrados */}
          <h3 style={{ marginTop: "20px" }}>Produtos Cadastrados</h3>
          <ul>
            {produtos.map((p) => (
              <li key={p.id}>
                {p.conta_financeira} - {p.codigo} - {p.descricao}
              </li>
            ))}
          </ul>
        </FormContainer>
      )}

      {/* Cadastro de Departamentos */}
      {activeTab === "departamentos" && (
        <FormContainer>
          <h2>Cadastro de Departamentos</h2>
          <br />
           <FormGroup>
            <label>Filial</label>
            <Input
              type="string"
              value={departamentoForm.cadastro_filial}
              onChange={(e) => setDepartamentoForm({ ...departamentoForm, cadastro_filial: e.target.value })}
            />
          </FormGroup>
             <FormGroup>
            <label>Departamento</label>
            <Input
              type="string"
              value={departamentoForm.cadastro_departamento}
              onChange={(e) => setDepartamentoForm({ ...departamentoForm, cadastro_departamento: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <label>Nº Serventes</label>
            <Input
              type="number"
              value={departamentoForm.numero_serventes}
              onChange={(e) => setDepartamentoForm({ ...departamentoForm, numero_serventes: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <label>Previsto Total CTR</label>
            <Input
              type="number"
              value={departamentoForm.previsto_total_ctr}
              onChange={(e) => setDepartamentoForm({ ...departamentoForm, previsto_total_ctr: e.target.value })}
            />
          </FormGroup>
          
          <Button onClick={salvarDepartamento}>Salvar</Button>

          {/* Lista de departamentos cadastrados */}
          <h3 style={{ marginTop: "20px" }}>Departamentos Cadastrados</h3>
          <ul>
            {departamentos.map((d) => (
              <li key={d.id}>
                Filial: {d.cadastro_filial} | Departamento: {d.cadastro_departamento}
                Serventes: {d.numero_serventes} | Previsto CTR: R$ {Number(d.previsto_total_ctr).toFixed(2)}
              </li>
            ))}
          </ul>
        </FormContainer>
      )}
    </Container>
  );
};

export default Dashboard;
