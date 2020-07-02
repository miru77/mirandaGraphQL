import React from 'react';
import Swal from 'sweetalert2';
import {useMutation, gql} from '@apollo/client';
import Router from 'next/router';

const ELIMIAR_CLIENTE = gql`
    mutation eliminarCliente($id:ID!) {
        eliminarCliente(id:$id) 
    }
    `;

    const OBTENER_CLIENTES_USUARIO = gql`
    query obtenerClientesVendedor {
      obtenerClientesVendedor {
        id
        nombre
        apellido
        empresa
        email
      }
    }
  `;

const Cliente = ({cliente}) => {

    const{ nombre, apellido, empresa, email, id} = cliente;

    //mitatio para elimiar cliente
    const[eliminarCliente] = useMutation(ELIMIAR_CLIENTE, {
        update(cache) {
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});
            //reescribir el cache
             cache.writeQuery({
                 query: OBTENER_CLIENTES_USUARIO,
                 data: {
                     obtenerClientesVendedor: obtenerClientesVendedor.filter(clienteActual => clienteActual.id !== id)
                 }
             })
        }
    });

    //Elimina 1 cliente
    const confirmarElimiarCliente = (id) => {
        Swal.fire({
            title: 'Deseas eliminar al cliente?',
            text: "No lo podras recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ELiminar!',
            cancelButtonText: 'No, Cancelar'
          }).then( async (result) => {
            if (result.value) {
                    try {
                        const {data} = await eliminarCliente({
                            variables: {
                                id
                            }
                        });
                       // console.log(data);
                        Swal.fire(
                            'Eliminado!',
                             data.eliminarCliente,
                            'success'
                          )    
                    } catch (error) {
                        console.log(error);
                    }
             
            }
          })
    }
    const editarCliente = () => {
            Router.push({
                pathname: "/editarCliente/[id]",
                query: {id}
            })
    }
    return ( 
        <tr>
        <td className="border px-4 py-2">{nombre} {apellido}</td>
        <td className="border px-4 py-2">{empresa}</td>
        <td className="border px-4 py-2">{email}</td>
        <td className="border px-4 py-2">
            <button
                type="button"
                className="flex justify-center items-center bg-red-700 py-2 px-3 w-full text-white rounded text-xs uppercase font-bold"
                onClick={()=>confirmarElimiarCliente(id)}
           >

                Eliminar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
        </td>
        <td className="border px-4 py-2">
            <button
                type="button"
                className="flex justify-center items-center bg-green-600 py-2 px-3 w-full text-white rounded text-xs uppercase font-bold"
               onClick={()=>editarCliente()}
           >

                Editar
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
        </td>

      </tr>
     );
}
 
export default Cliente;