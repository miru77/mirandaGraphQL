import React, {useEffect, useState, useContext} from 'react';
import Select from 'react-select';
import {useQuery, gql} from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarCliente = () => {

    const [cliente, setCliente] = useState([]);

    //context de pedido
    const pedidoContext = useContext(PedidoContext);
    const {agregarCliente} = pedidoContext;

     ///Consulta de apollo
  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente])

    const seleccionarCliente = cliente => {
        setCliente(cliente);
    }

    //resultado de la consulta
    if(loading) return null;

    const {obtenerClientesVendedor} = data;

    return ( 
            <>
                <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">1.- Asignar un Cliente al pedido</p>
                <Select 
                className="mt-3"
               options={obtenerClientesVendedor}
               // isMulti={true}
                onChange={ opcion => seleccionarCliente(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones =>`${opciones.nombre} - ${opciones.empresa} `}
                placeholder=" Busque y Seleccione el Cliente"
                noOptionsMessage={() => "No hay resultados"}
                />
            </>
     );
}
 
export default AsignarCliente;