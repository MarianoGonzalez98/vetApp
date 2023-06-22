import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Producto } from "../interfaces/Producto.interface";
import { Id } from "../interfaces/Id.interface";

export const insertProductoDB = async (producto:Producto ) => {
    const query = `
    INSERT INTO public.productos(
        nombre, stock, precio, descripcion, marca, foto)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const values = [producto.nombre, producto.stock,producto.precio, producto.descripcion,producto.marca,producto.foto]
    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertProducto------");
        console.log(err);
        return "error";
    }
}

export const getProductosDB = async () => {
    const query = `
    SELECT nombre, stock, precio, descripcion, marca, foto
	FROM public.productos;
    `
    try {
        const response: QueryResult = await pool.query(query)
        const result: (Producto)[] = await response.rows;
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getProductosDB------");
        console.log(err);
        return "error";
    }
}

export const getProductoPorNombreDB = async (nombre:string) => {
    const query = `
    SELECT nombre, stock, precio, descripcion, marca, foto
	FROM public.productos
    WHERE nombre=$1
    `
    const values = [nombre];
    try {
        const response: QueryResult = await pool.query(query,values)
        const result:Producto = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getProductoPorNombreDB------");
        console.log(err);
        return "error";
    }
}