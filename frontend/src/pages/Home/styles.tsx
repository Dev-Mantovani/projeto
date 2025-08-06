import styled from 'styled-components'



export const Container = styled.div`
  background-color: #181f36;
  min-height: 100vh;
  display: grid;
  gap: 20px;

  /* Desktop: Sidebar | Conteúdo */
  @media (min-width: 768px) {
    grid-template-columns: 300px 1fr ;
   
  }

  /* Mobile: Empilhado */
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "sidebar"
      "content";
  }
`;



export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;

  /* No mobile, ocupa mais espaço */
  @media (max-width: 767px) {
    max-width: 100%;
    padding: 0 10px;
  }
`;

// Container de inputs mais flexível
export const Containerinput = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;

  /* No mobile, empilha os inputs */
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 10px;
  }

  /* Cada input ocupa espaço igual */
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

// Input melhorado
export const Input = styled.input`
  border-radius: 10px;
  border: 1px solid white;
  width: 100%;
  padding: 12px 15px;
  outline: none;
  background-color: transparent;
  color: white;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: #FE7E5D;
    box-shadow: 0 0 0 2px rgba(254, 126, 93, 0.2);
  }

  /* No mobile, inputs ficam maiores */
  @media (max-width: 767px) {
    padding: 15px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

// Label melhorada
export const InputLabel = styled.label`
  color: white;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;

  span {
    color: #FE7E5D;
    font-weight: bold;
  }

  /* No mobile, labels maiores */
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;








