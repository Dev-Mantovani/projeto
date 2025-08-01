import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"


import {
 Container,
  Form, Containerinput,
  InputLabel, Input,
} from "./styles"



import Button from "../../components/Button"
import TopBackground from "../../components/TopBackground"
import Title from "../../components/Title"


function Home() {

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  const navigate =  useNavigate()

  async function registerNewUser() {
    const data = await api.post('http://localhost:3000/usuarios', {
      name: inputName.current.value,
      age: parseInt(inputAge.current.value),
      email: inputEmail.current.value

    })
    console.log(data)

  }



  return (
    <Container>
      <TopBackground />

      <Form>

        <Title>Cadastrar Usuário</Title>
        <Containerinput>

          <div>
            <InputLabel> Nome <span>*</span></InputLabel>
            <Input type='text' placeholder='Nome de usuário' ref={inputName} />
          </div>

          <div>
            <InputLabel> Idade <span>*</span></InputLabel>
            <Input type='number' placeholder='Idade do usuário' ref={inputAge} />
          </div>

        </Containerinput>

        <div style={{ width: '100%' }}>
          <InputLabel> Email <span>*</span></InputLabel>
          <Input type='email' placeholder='E-mail do usuário' ref={inputEmail} />
        </div>



        <Button theme='primary' type="button" onClick={registerNewUser} > Cadastrar Usuário</Button>
        <Button type="button" onClick={() =>navigate('/lista-de-usuarios')}> Lista de Usuários</Button>
      </Form>
    </Container>


  )
}


export default Home
//  <h1 style={{color: 'red'}}>Olá</h1> // estilizar dentro do APP
