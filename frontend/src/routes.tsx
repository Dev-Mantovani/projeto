import {createBrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import ListUsers from './pages/ListUsers'
import Funcionarios from './pages/Funcionarios'
import Login from './pages/Acess'
import Dashboard from './pages/Administration'
import Pedido_Faturado from './pages/Faturado'
import RelatorioPage from './pages/Faturado'


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

      {
        path: '/administration',
        element: <Dashboard/>


    },

       {
        path: '/faturado',
        element: <RelatorioPage/>


    },




    


]
)

export default router


