import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #12b886, #20c997);
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 350px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

export const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  padding: 8px;
  margin: 0 auto 8px auto;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ErrorMessage = styled.p`
  color: #ff3333;
  font-size: 0.875rem;
  margin: 0;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: white;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #e0f2f1;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-align: left;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

export const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;
