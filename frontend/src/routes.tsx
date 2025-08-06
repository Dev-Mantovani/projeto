import {createBrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import ListUsers from './pages/ListUsers'
import Funcionarios from './pages/Funcionarios'



const router = createBrowserRouter([

    {
        path: '/',
        element: <Home/>

    },

    {
        path: '/lista-de-usuarios',
        element: <ListUsers/>

    },
    
    {
        path: '/funcionarios',
        element: <Funcionarios/>


    },


]
)

export default router


