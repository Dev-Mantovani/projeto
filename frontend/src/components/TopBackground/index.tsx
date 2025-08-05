import React from 'react';
import { Background } from "./styles";
import UserImage from "../../assets/users.png";

const TopBackground: React.FC = () => {
  return (
    <Background>
      <img src={UserImage} alt="imagem-usuario" />
    </Background>
  );
};

export default TopBackground;