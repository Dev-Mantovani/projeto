import React, { useState } from 'react';
import { Sidebar_container, Div_button, Icon_menu,Text_button, Div_menu,Title_sidebar } from './styles';
import { Users, Briefcase, UserX, BarChart3 } from "lucide-react"

const Sidebar: React.FC = () => {
  const [clicked, setClicked] = useState(false);

  const cliquei = () => {
    setClicked(true);
    console.log('deu boa');
  };

    const menuItems = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Postos de Trabalho",  icon: Briefcase },
    { label: "Funcionários", icon: Users },
    { label: "Gestão de Faltas", icon: UserX },
  ]


  return (
    <Sidebar_container $isClicked={clicked}>      
<Div_button>
  <Title_sidebar>Gestão RH</Title_sidebar>
    {menuItems.map(({ label, icon: Icon }, index) => (
      <Div_menu key={index}>
            <Icon_menu as={Icon} />
            <Text_button>{label}</Text_button>
      </Div_menu>
        ))}
  </Div_button>
    </Sidebar_container>
  );
};

export default Sidebar;



//
