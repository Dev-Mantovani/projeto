// src/pages/ListUsers/index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";
import { User } from "../../types/User";
import Button from "../../components/Button";
import TopBackground from "../../components/TopBackground";
import Title from "../../components/Title";
import Trash from "../../assets/trash.svg";


import { 
  AvatarUser, 
  CardUsers, 
  Container, 
  ContainerUsers, 
  TrashIcon 
} from "./styles";

const ListUsers: React.FC = () => {
  // useState<User[]> diz que é um array de User
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        const usersData = await userApi.getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const deleteUsers = async (id: number): Promise<void> => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await userApi.deleteUser(id);
      // Atualiza a lista removendo o usuário deletado
      setUsers(users.filter(user => user.id !== id));
      alert('Usuário deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário');
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Carregando...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <TopBackground />
      <Title>Lista de Usuários</Title>
      
      <ContainerUsers>
        {users.map((user: User) => (
          <CardUsers key={user.id}>
            <AvatarUser 
              src={`https://avatar.iran.liara.run/public?username=${user.id}`} 
              alt={`Avatar de ${user.name}`}
            />
            <div>
              <h3>{user.name}</h3>
              <p><strong>Email: </strong>{user.email}</p>
              <p><strong>Idade: </strong>{user.age}</p>
            </div>
            <TrashIcon 
              src={Trash} 
              alt="Deletar usuário" 
              onClick={() => deleteUsers(user.id)}
            />
          </CardUsers>
        ))}
      </ContainerUsers>
      
      {users.length === 0 && !loading && (
        <p style={{ color: 'white', textAlign: 'center' }}>
          Nenhum usuário encontrado
        </p>
      )}
      
      <Button type='button' onClick={() => navigate('/')}>
        Voltar
      </Button>
    </Container>
  );
};

export default ListUsers;