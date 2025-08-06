// src/pages/Home/index.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";
import { CreateUserData } from "../../types/User";

import {
  Container,
  Form,
  Containerinput,
  InputLabel,
  Input
} from "./styles";

import Button from "../../components/Button";
import TopBackground from "../../components/TopBackground";
import Title from "../../components/Title";
import Sidebar from "../../components/Sidebar";

const Home: React.FC = () => {
  // HTMLInputElement diz que é uma referência para um input HTML
  const inputName = useRef<HTMLInputElement>(null);
  const inputAge = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const registerNewUser = async (): Promise<void> => {
    // Verificamos se os inputs existem antes de usar
    if (!inputName.current || !inputAge.current || !inputEmail.current) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const userData: CreateUserData = {
      name: inputName.current.value,
      age: parseInt(inputAge.current.value),
      email: inputEmail.current.value
    };

    try {
      const newUser = await userApi.createUser(userData);
      console.log('Usuário criado:', newUser);
      
      // Limpar os campos após criar
      inputName.current.value = '';
      inputAge.current.value = '';
      inputEmail.current.value = '';
      
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <Container>
      <Sidebar />
      <Form>
        <TopBackground />
        <Title>Cadastrar Usuário</Title>
        
        <Containerinput>
          <div>
            <InputLabel>Nome <span>*</span></InputLabel>
            <Input 
              type='text' 
              placeholder='Nome de usuário' 
              ref={inputName} 
            />
          </div>

          <div>
            <InputLabel>Idade <span>*</span></InputLabel>
            <Input 
              type='number' 
              placeholder='Idade do usuário' 
              ref={inputAge} 
            />
          </div>
        </Containerinput>

        <div style={{ width: '100%' }}>
          <InputLabel>Email <span>*</span></InputLabel>
          <Input 
            type='email' 
            placeholder='E-mail do usuário' 
            ref={inputEmail} 
          />
        </div>

        <Button 
          variant='primary' 
          type="button" 
          onClick={registerNewUser}
        >
          Cadastrar Usuário
        </Button>
        
        <Button 
          type="button" 
          onClick={() => navigate('/lista-de-usuarios')}
        >
          Lista de Usuários
        </Button>
      </Form>
    </Container>
  );
};

export default Home;