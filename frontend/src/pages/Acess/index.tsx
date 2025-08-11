import React, { useState } from "react";
import {
  Container,
  Card,
  LogoImage,
  Title,
  Subtitle,
  Label,
  Input,
  Button, ErrorMessage,Form
} from "./styles";
import { useNavigate } from "react-router-dom";

// importa a conexão
import Logo from "./logo.png";
import { userApi } from "../../services/api";

const Login: React.FC = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      console.log('Tentando login com:', { login, senha });
      
      const response = await userApi.login(login, senha);
      console.log('Resposta do servidor:', response);

      if (response.sucesso) {
        // Armazena os dados do usuário (sem a senha)
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
        
        // Login bem-sucedido
        navigate('/dashboard'); // Redireciona após login
      } else {
        setErro(response.erro || 'Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      if (error.response?.status === 401) {
        setErro('Login ou senha incorretos');
      } else {
        setErro(error.response?.data?.erro || 
               'Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <LogoImage src={Logo} alt="Logo" />
        <Title>Sistema de Gestão</Title>
        <Subtitle>Pedidos de Materiais por Filial</Subtitle>

        <Form onSubmit={handleLogin}>
          <Label>Login</Label>
          <Input
            type="text"
            placeholder="Digite seu login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />

          <Label>Senha</Label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <ErrorMessage>{erro}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? "Validando..." : "Acessar Sistema"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
