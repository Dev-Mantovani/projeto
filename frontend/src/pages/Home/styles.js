import styled from 'styled-components'



export const Container = styled.div`
background-color: #181f36;
display: flex;
align-items: center;
justify-content: space-evenly;
flex-direction: column;
padding: 20px;
height: 100vh;

`


export const Form = styled.form`
display: flex;
flex-direction: column;
gap: 20px;
align-items: center;
justify-content: center;
max-width: 45vw;

`

export const Containerinput = styled.div`
display: flex;
gap: 10px;


`
export const Input = styled.input`

border-radius: 10px;
border: 1px solid white;
width: 100%;
padding: 12px 12px;
gap: 20px;
outline: none;

`
export const InputLabel = styled.label`
color: white;
font-size: 12px;

 span {
    color: rgb(36, 61, 172);
    font-weight: bold;
}

`








