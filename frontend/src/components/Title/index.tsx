import React from 'react';
import { TitleProps } from "../../types/User";
import { Titles } from "./styles";

const Title: React.FC<TitleProps> = ({ children, }) => {
  return (
    <Titles>
      {children}
    </Titles>
  );
};

export default Title;