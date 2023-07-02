import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { ItemCarrito } from "../interfaces/Carrito.interface";


export const insertCompraDB = async (productos:ItemCarrito[],email:string ) => {
    const query = `
    INSERT INTO public.compras(
        productos, email)
        VALUES ($1, $2)
        RETURNING id 
    `;
    const values = [JSON.stringify(productos),email]
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