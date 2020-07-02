import Layout from '../components/Layout';
import Producto from '../components/Producto';
import Link from 'next/link';
import {useQuery, gql} from '@apollo/client';
import Router from 'next/router';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
      obtenerProductos {
        id
        nombre
        precio
        existencia
      }
    }
`;


const Productos = () => {

  //consular producos
  const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);

  if(loading) return null;
 // console.log(data);
  return (
      <div>
        <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

        <Link href="/nuevoproducto">
        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Producto</a>
        
        </Link>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
              <thead className="bg-gray-800">
                <tr className="text-white">
                  <th className="w-1/2 py-2">Nombre</th>
                  <th className="w-1/8 py-2">Existencia</th>
                  <th className="w-1/8 py-2">Precio</th>
                  <th className="w-1/8 py-2">Elimiar</th>
                  <th className="w-1/8 py-2">Editar</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.obtenerProductos.map(producto => (
                  <Producto
                  key={producto.id}
                  producto={producto}
                  / >
                ))}
            </tbody>
          </table>

        </Layout>
      </div>
  )
}

export default Productos
