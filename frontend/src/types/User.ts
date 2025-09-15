
// Interface = um "molde" que define como um objeto deve ser
export interface User {
  id: number;        // Sempre um número
  name: string;      // Sempre um texto
  email: string;     // Sempre um texto
  age: number;       // Sempre um número
  created_at?: string; // ? significa "opcional"
  updated_at?: string;
}

// Tipo para criar um novo usuário (sem ID, pois é gerado pelo banco)
export interface CreateUserData {
  name: string;
  email: string;
  age: number;
}

// Tipo para as props dos componentes Button
export interface ButtonProps {
  children: React.ReactNode;  // Qualquer conteúdo React (texto, elementos, etc.)
  variant?: 'primary' | 'secondary'; // Só pode ser 'primary' ou 'secondary'
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;       // Função que não retorna nada
}

interface StyledButtonProps {
  theme: 'primary' | 'secondary';
}


// Tipo para as props do Title
export interface TitleProps {
  children: React.ReactNode;
  margintop?: string;
}





