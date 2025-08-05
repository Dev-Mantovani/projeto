import React from 'react';
import { ButtonProps } from "../../types/User";
import { Button } from "./styles";

// React.FC = React Function Component
// <ButtonProps> diz que tipo de props esperamos
const DefaultButton: React.FC<ButtonProps> = ({ children, variant = 'secondary', ...props }) => {
  return (
    <Button {...props} $variant={variant}>
      {children}
    </Button>
  );
};




export default DefaultButton;