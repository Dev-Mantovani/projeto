import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";
import { User } from "../../types/User";
import { User_funcionario } from "./styles";

const Funcionarios: React.FC = () => {
  return (
    <User_funcionario>
    </User_funcionario>
  );
};

export default Funcionarios;