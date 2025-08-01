import styled from "styled-components";

export const Container = styled.div `
background-color: #181f36;
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 20px;
`
export const ContainerUsers = styled.div `
    display: grid;
    grid-template-columns: 1fr 1fr ;
    gap: 20px;
    margin: 40px 0 ;

    @media (max-width: 750px) {
           grid-template-columns: 1fr;
    }

`
export const CardUsers = styled.div `
background-color: #252d48;
padding: 16px;
border-radius: 32px;
display: flex;
justify-content: space-between;
align-items: center;
gap: 20px;
max-width: 400px;

h3 {
    color: #fff;
    font-size: 24px;
    margin-bottom: 3px;
    text-transform: capitalize;


}

p {
    color: #fff;
    font-size: 12px;
    font-weight: 200;
}


`
export const TrashIcon = styled.img `
padding-left: 30px;
cursor: pointer;

    &:hover{
        opacity: 0.5;

    }

    &:active {
        opacity: 0.2;

    }

`


export const AvatarUser = styled.img `
height: 80px;

`