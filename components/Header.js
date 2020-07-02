import React from 'react';
import { gql, useQuery} from '@apollo/client';
import {useRouter} from 'next/router';


const   OBTENER_USUARIO = gql`
    query  obtenerVendedor{
        obtenerVendedor{
        id
        nombre
        apellido
        }
    }
`;

const Header = () => {

    const router = useRouter();

    //query de apollo
    const {data, loading, error} = useQuery(OBTENER_USUARIO);

    // proteger que no acceda a data ates de tener resultados
    if(loading) return null;

    //si no hay informacion
    if(!data) {
        return router.push('/login');
    }

    const {nombre, apellido} = data.obtenerVendedor;

    const cerrarSesion = () => {
            localStorage.removeItem('token');
            router.push('/login');
    }

    return ( 
       <div className="sm:flex sm:justify-between mb-6">
           <p className="mr-2 mb-4 lg:mb-0">Hola : {nombre} {apellido}</p>

           <button type="button"
           onClick={() => cerrarSesion()}
            className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md  hover:bg-gray-800"
           >
               Cerrar Sesión
           </button>
       </div>
     );
}
 
export default Header;