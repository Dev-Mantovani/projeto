import express from "express"
import cors from "cors"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express()
app.use(express.json())
app.use(cors())

// GET - Buscar usuários
app.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
})

// POST - Criar usuário
app.post('/usuarios', async (req, res) => {
  const { email, name, age } = req.body

  const { data, error } = await supabase.from('users').insert([{ email, name, age }]).single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT - Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { email, name, age } = req.body

  const { data, error } = await supabase.from('users').update({ email, name, age }).eq('id', id).single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
})

// DELETE - Remover usuário
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json({ message: "Usuário deletado com sucesso" })
})




// -------------------- Dados Consolidados --------------------
// GET
app.get("/dados-consolidados", async (req, res) => {
  const { data, error } = await supabase.from("dados_consolidados").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// POST
app.post("/dados-consolidados", async (req, res) => {
  const { cadastro_filial, previsto_per_capita, numero_serventes, previsto_total_ctr, realizado_per_capita, acumulado_total, diferenca, variacao, status } = req.body;
  const { data, error } = await supabase.from("dados_consolidados").insert([{ cadastro_filial, previsto_per_capita, numero_serventes, previsto_total_ctr, realizado_per_capita, acumulado_total, diferenca, variacao, status }]).single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// -------------------- Produtos --------------------

// Rota para listar os produtos 
app.get("/produtos", async (req, res) => {
  const { data, error } = await supabase.from("produtos").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Rota para cadastrar os produtos 
app.post("/produtos", async (req, res) => {
  const { codigo, conta_financeira, descricao } = req.body;
  const { data, error } = await supabase.from("produtos").insert([{ codigo, conta_financeira, descricao }]).single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Rota para update os produtos
app.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo, conta_financeira, descricao } = req.body;
  
  const { data, error } = await supabase
    .from("produtos")
    .update({ codigo, conta_financeira, descricao })
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Rota para deletar os produtos
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});



// -------------------- Departamentos --------------------
// Rota para cadastrar departamento
app.post("/departamentos", async (req, res) => {
  const { cadastro_filial, cadastro_departamento,tipo_departamento, numero_serventes, previsto_total_ctr } = req.body;
  const { data, error } = await supabase.from("departamentos").insert([{ cadastro_filial, cadastro_departamento,tipo_departamento, numero_serventes, previsto_total_ctr }]).single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Rota para listar departamentos
app.get("/departamentos", async (req, res) => {
  const { data, error } = await supabase.from("departamentos").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});


// Rota para Update no Departamento
app.put("/departamentos/:id", async (req, res) => {
  const { id } = req.params;
  const { cadastro_filial, cadastro_departamento, numero_serventes,tipo_departamento, previsto_total_ctr } = req.body;
  
  const { data, error } = await supabase
    .from("departamentos")
    .update({ cadastro_filial, cadastro_departamento,tipo_departamento, numero_serventes, previsto_total_ctr })
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Rota para Delete no Departamento
app.delete("/departamentos/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("departamentos")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ================== PRODUTOS POR DEPARTAMENTO ==================

// Obter produtos de um departamento
app.get('/departamentos/:id/produtos', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('departamento_produtos')
    .select('produtos(*)')
    .eq('departamento_id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(item => item.produtos));
});

// Adicionar produto a um departamento
app.post('/departamentos/:id/produtos', async (req, res) => {
  const { id } = req.params;
  const { produto_id } = req.body;
  
  const { data, error } = await supabase
    .from('departamento_produtos')
    .insert([{ departamento_id: id, produto_id }]);
    
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Remover produto de um departamento
app.delete('/departamentos/:departamento_id/produtos/:produto_id', async (req, res) => {
  const { departamento_id, produto_id } = req.params;
  
  const { data, error } = await supabase
    .from('departamento_produtos')
    .delete()
    .eq('departamento_id', departamento_id)
    .eq('produto_id', produto_id);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});



// Start server
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})
