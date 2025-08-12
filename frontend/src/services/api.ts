// src/services/api.ts
import axios from "axios";
import { User, CreateUserData } from "../types/User";

// Criamos o cliente axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
 timeout: 5000, // Adicione um timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Agora criamos funções específicas para cada operação
export const userApi = {
  // GET - Buscar todos os usuários
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/usuarios');
    return data;
  },

  // POST - Criar usuário
  createUser: async (userData: CreateUserData): Promise<User> => {
    const { data } = await api.post('/usuarios', userData);
    return data;
  },

  // DELETE - Deletar usuário
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  // PUT - Atualizar usuário (caso queira implementar depois)
  updateUser: async (id: number, userData: Partial<CreateUserData>): Promise<User> => {
    const { data } = await api.put(`/usuarios/${id}`, userData);
    return data;
  },



    /// LOGIN
  login: async (usuario: string, senha: string) => {
    const { data } = await api.post('/login', { usuario, senha });
    return data;
  },


};


export const dashboardApi = {
  // ---- Dados Consolidados ----
  getDadosConsolidados: async () => {
    const { data } = await api.get("/dados-consolidados");
    return data;
  },
  createDadoConsolidado: async (payload: any) => {
    const { data } = await api.post("/dados-consolidados", payload);
    return data;
  },

  
  // ---- Produtos ----
  getProdutos: async () => {
    const { data } = await api.get("/produtos");
    return data;
  },
  createProduto: async (payload: any) => {
    const { data } = await api.post("/produtos", payload);
    return data;
  },

  updateProduto: async (id: number, payload: any) => {
    const { data } = await api.put(`/produtos/${id}`, payload);
    return data;
  },
  deleteProduto: async (id: number) => {
    const { data } = await api.delete(`/produtos/${id}`);
    return data;
  },

  // ---- Departamentos ----
  getDepartamentos: async () => {
    const { data } = await api.get("/departamentos");
    return data;
  },
  createDepartamento: async (payload: any) => {
    const { data } = await api.post("/departamentos", payload);
    return data;
  },

  updateDepartamento: async (id: number, payload: any) => {
    const { data } = await api.put(`/departamentos/${id}`, payload);
    return data;
  },
  deleteDepartamento: async (id: number) => {
    const { data } = await api.delete(`/departamentos/${id}`);
    return data;
  },

};







// Exportamos também o api original para compatibilidade
export default api;