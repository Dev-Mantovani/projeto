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

// Start server
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})
