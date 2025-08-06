import styled from 'styled-components';
import { Users, Briefcase, UserX, BarChart3 } from "lucide-react"

interface SidebarProps {
  $isClicked: boolean;
}

export const Sidebar_container = styled.div<SidebarProps>`
  width: 250px;
  transition: background-color 0.3s ease;
  background-color: ${({ $isClicked }) => ($isClicked ? 'red' : 'white')};
  border-radius: 0 20px;

`

export const Div_button = styled.div `
display: flex;
flex-direction: column;
 position: relative;
 height: 100vh;
 margin-top: 50px;

  
`

export const Div_menu = styled.button`
  background: none;
  border: none;
 color: #4b5563;
  display: flex;
  align-items: center;      
  justify-content: center;  
  margin: 10px auto;
  padding: 10px 16px;
  border-radius: 10px;
  transition: 0.3s;
  gap: 20px; 
  cursor: pointer;

  &:hover {
    background-color: #d2d6db; 
    color: #111827;            
  }
`


export const Icon_menu = styled(Users)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;

   &:hover {
    color: #111827;            
  }

`

export const Text_button = styled.p`
  font-size: 15px;
  color: #4b5563;
  font-weight: bold;
  margin: 0;

   &:hover {
    color: #111827;            
  }
`

export const Title_sidebar = styled.h1`
  display: flex;
  align-items: center;      
  justify-content: center;
  margin-bottom : 50px;

`