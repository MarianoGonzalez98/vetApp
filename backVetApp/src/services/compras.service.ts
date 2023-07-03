import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { ItemCarrito } from "../interfaces/Carrito.interface";


export const insertCompraDB = async (productos:ItemCarrito[],email:string ) => {
    const query = `
    INSERT INTO public.compras(
        productos, email, "fechaHoraReserva")
        VALUES ($1, $2, $3)
        RETURNING id 
    `;
    const values = [JSON.stringify(productos),email, new Date().toISOString()]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const resultId:number = await response.rows[0];
        return resultId;
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertProducto------");
        console.log(err);
        return "error";
    }
}

export const cancelarReservasExpiradasDB = async () => {
    //selecciona las compras que no fueron canceladas ni se acreditaron y pasaron hace 30 segundos
    const query = `
    SELECT id, productos, "seAcredito", cancelada, "fechaHoraReserva",EXTRACT(EPOCH FROM ($1 - "fechaHoraReserva")) AS "secondsDifference"
	FROM public.compras
    WHERE cancelada = false and "seAcredito" = false and EXTRACT(EPOCH FROM ($1 - "fechaHoraReserva")) > 30 
    `;
    const values = [new Date().toISOString()];
    try {
        const response: QueryResult = await pool.query(query,values) //hace la query
        const vencidos = response.rows;
        if (vencidos.length>0){
            console.log('Se cancela una o mas compras')

            for (let i = 0; i < vencidos.length; i++) {
                const compra = vencidos[i];
                const seCancelo = await marcarCanceladoDB(id)
                if (seCancelo==='error'){
                    return 'error';
                }
                const seSumoAlStock = await sumarCantidadCompradaProductosDB(JSON.parse(compra.productos));
                if (seSumoAlStock==='error'){
                    return 'error';
                }
            }
        }
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:cancelarReservasExpiradasDB------");
        console.log(err);
        return "error";
    }

}

const marcarCanceladoDB = async (id:number) => {
    const query = `
    UPDATE public.compras
    SET cancelada = true
    WHERE id = $1
    `
    const values= [id];
    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:marcarCanceladoDB------");
        console.log(err);
        return "error";
    }
}