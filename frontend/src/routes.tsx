import {createBrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import ListUsers from './pages/ListUsers'
import Funcionarios from './pages/Funcionarios'
import Login from './pages/Acess'



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

     {
        path: '/login',
        element: <Login/>


    },

    


]
)

export default router


