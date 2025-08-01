import styled from 'styled-components'


export const Button = styled.button`
border: ${props => props.theme === 'primary' ? 'none': 'solid 1px white'};
border-radius: 20px;
align-items: center;
justify-content: center;
width: fit-content;
padding: 16px 32px;
color: white;
background: ${props => props.theme === 'primary' ? 'linear-gradient(180deg, #FE7E5D 0%, #FF6378 100%)': 'linear-gradient(180deg, rgba(0, 51, 102, 1) 0%, rgba(102, 153, 255, 0.7) 100%)'};
cursor: pointer;

&:hover{
    opacity: ${props => props.theme === 'primary' ? '0.8': '0.5'};
}

&:active{
    opacity: ${props => props.theme === 'primary' ? '0.5': '0.2'};
    

}

`
