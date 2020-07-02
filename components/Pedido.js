import React ,{useEffect,useState} from 'react';  
import {useMutation, gql} from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO = gql`
    mutation  actualizarPedido($id: ID!, $input: PedidoInput) {
        actualizarPedido(id: $id, input: $input ) {
        estado
   }
 }
`;
const ELIMIAR_PEDIDO = gql`
    mutation  elimiarPedido($id: ID!) {
        elimiarPedido(id :$id) 
 }
`;


const OBTENER_PEDIDOS = gql`

  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id

    }
  }
  `;



const Pedido = ({pedido}) => {

    const {id, total, cliente: {nombre, apellido, telefono, email}, cliente, estado} = pedido;

    //mutation para actualizar pedido
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);

    //mutation para eliminar pedido
    const [elimiarPedido] = useMutation(ELIMIAR_PEDIDO, {
            update(cache) {
                const {obtenerPedidosVendedor} = cache.readQuery({
                    query: OBTENER_PEDIDOS
                });
                cache.writeQuery({
                    query: OBTENER_PEDIDOS,
                    data: {
                        obtenerPedidosVendedor: obtenerPedidosVendedor.filter( pedido => pedido.id !== id)
                    }
                })
            }
    });

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');


    useEffect(() => {
        if(estadoPedido) {
            setEstadoPedido(estadoPedido);
           
        }
        clasePedido();
    }, [estadoPedido])

    //Funcion que modifica el color del pedido de acuerdo a su estado
    const clasePedido = () => {
        if(estadoPedido === 'PENDIENTE') {
            setClase('border-yellow-500')
        } else if (estadoPedido === 'COMPLETADO') {
            setClase('border-green-500')
        } else {
            setClase('border-red-800')

        }
    }
    const cambiarEstadoPedido = async nuevoEstado => {
            try {
                const {data} = await actualizarPedido({
                    variables: {
                        id,
                        input: {
                            estado: nuevoEstado,
                            cliente: cliente.id
                        }
                    }
                });
                setEstadoPedido(data.actualizarPedido.estado);
            } catch (error) {
                console.log(error)
            }
    }
    const confirmarElimiarPedido = async () => {
        Swal.fire({
            title: 'Deseas eliminar este pedido?',
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
                   const data = await elimiarPedido({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Elimando',
                        data.elimiarPedido,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }         
             
            }
          })
    }

    return ( 
        <div className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                  <p className="font-bold text-gray-800">Cliente: {nombre} {apellido}</p>

                  {email && (
                     <p className="flex items-center my-2">
                         <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                         {email}
                     </p>
                 )}
                 {telefono && (
                     <p className="flex items-center my-2">
                         <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                         {telefono}
                     </p>
                 )}

                 <h2 className="font-bold text-gray-800 mt-10">Estado Pedido:</h2>

                

                <select 
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus: outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
                    value={estadoPedido}
                    onChange={e => cambiarEstadoPedido(e.target.value)}
                >
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CANCELADO">CANCELADO</option>

                </select>
            </div>
            <div>
            <h2 className="font-bold text-gray-800 mt-2">Resumen del Pedido</h2>
                {pedido.pedido.map (articulo => (
                    <div key={articulo.id} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>

                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold"> Total a pagar:
                    <span className="font-light"> $ {total}</span>
                </p>
                <button 
                    className="uppercase text-xs font-bold flex items-center mt-4 bg-red-700 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={() => confirmarElimiarPedido()}
               >
                    ELiminar Pedido
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 ml-2" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    
                </button>
            </div>
        </div>

     );
}
 
export default Pedido;