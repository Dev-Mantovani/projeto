import { Background } from "./styles"
import UserImage from "../../assets/users.png"


function TopBackground() {



    return (

        <Background>
            <img src={UserImage} alt="imagem-usuario" />
        </Background>
    )


}

export default TopBackground