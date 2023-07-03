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
    const query = `
    SELECT productos, "seAcredito", cancelada, "fechaHoraReserva",EXTRACT(EPOCH FROM ($1 - "fechaHoraReserva")) AS "secondsDifference"
	FROM public.compras
    WHERE EXTRACT(EPOCH FROM ($1 - "fechaHoraReserva")) > 30
    `;
    const values = [new Date().toISOString()];
    try {
        const response: QueryResult = await pool.query(query,values) //hace la query
        const result = response.rows;
        if (result.length>0){
            console.log('Se cancela una o mas reservas')
            //seguir con esto...
            console.log()
        }
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertProducto------");
        console.log(err);
        return "error";
    }

}