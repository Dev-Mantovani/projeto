import api from "../../services/api"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import TopBackground from "../../components/TopBackground"
import Trash from "../../assets/trash.svg"


import { AvatarUser, CardUsers, Container, ContainerUsers, TrashIcon } from "./styles"
import Title from "../../components/Title"
import styled from "styled-components"


function ListUsers() {
    const [users, setUsers] = useState([])
    const navigate =  useNavigate()

    useEffect(() => {
        async function getUsers() {
            const { data } = await api.get('http://localhost:3000/usuarios')
            setUsers(data)


        }

        getUsers()
    }, [])



    async function deleteUsers(id) {
        
    await api.delete (`http://localhost:3000/usuarios/${id}`)

    setUsers(users.filter(user => user.id !== id));
   // const updateUsers = user.filter (user => user.id !== id)//
    
    
    }


    return (
        <Container>
         <TopBackground/>

         <Title >Lista de Usuarios</Title>
            <ContainerUsers>
                
            {users.map((user) => (
                <CardUsers key={user.id}>
                    <AvatarUser src={` https://avatar.iran.liara.run/public?username= ${user.id}`} />
                <div >
                    <h3>{user.name}</h3>
                    <p><strong>Email: </strong>{user.email}</p>
                    <p><strong>Idade: </strong>{user.age}</p>
                </div>
                <TrashIcon src={Trash} alt="icone-lixo" onClick={() => deleteUsers(user.id)}/>
                </CardUsers>
                ))}
            </ContainerUsers>
                <Button type='button' onClick={() =>navigate('/')} > Voltar</Button>



            

        </Container>


    )
}

export default ListUsers