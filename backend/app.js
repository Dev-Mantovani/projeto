import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// GET - Buscar usuários
app.get("/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// POST - Criar usuário com senha criptografada
app.post("/usuarios", async (req, res) => {
  const { login, senha, name, email, age } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ error: "Login e senha são obrigatórios" });
  }

  // Criptografar senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ login, senha: hashedPassword, name, email, age }])
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT - Atualizar usuário
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { login, senha, name, email, age } = req.body;

  let updatedData = { login, name, email, age };

  if (senha) {
    updatedData.senha = await bcrypt.hash(senha, 10);
  }

  const { data, error } = await supabase
    .from("users")
    .update(updatedData)
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// DELETE - Remover usuário
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Usuário deletado com sucesso" });
});



// LOGIN


// Altere todas as referências no seu backend
app.post("/login", async (req, res) => {
  const { login, senha } = req.body;

  try {
    // 1. Busca o usuário na tabela "acess"
    const { data: usuario, error } = await supabase
      .from("acess")
      .select("*")
      .eq("login", login)
      .single();

    if (error || !usuario) {
      console.log('Usuário não encontrado:', login);
      return res.status(401).json({ 
        sucesso: false,
        erro: "Credenciais inválidas" 
      });
    }

    // 2. Verifica a senha (comparação direta pois não estamos usando hash neste exemplo)
    // Em produção, você deve usar bcrypt como no seu exemplo original
    const senhaValida = senha === usuario.senha;
    // Para usar bcrypt: const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      console.log('Senha inválida para usuário:', login);
      return res.status(401).json({
        sucesso: false,
        erro: "Credenciais inválidas"
      });
    }

    // 3. Remove a senha do objeto de retorno
    const { senha: _, ...dadosUsuario } = usuario;
    
    console.log('Login bem-sucedido para:', login);
    res.json({
      sucesso: true,
      usuario: dadosUsuario
    });

  } catch (erro) {
    console.error('Erro no processo de login:', erro);
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor"
    });
  }
});



// Start server
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
