import { Titles } from "./styles";


function Title ({children,margintop }) {

    return(

        <Titles margintop={margintop} > {children} </Titles>


    )

}



export default Title