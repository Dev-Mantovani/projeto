// src/services/api.ts
import axios from "axios";
import { User, CreateUserData } from "../types/User";

// Criamos o cliente axios
const api = axios.create({
  baseURL: 'http://localhost:3000'
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
  }
};

// Exportamos também o api original para compatibilidade
export default api;