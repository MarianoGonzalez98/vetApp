import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Producto } from "../interfaces/Producto.interface";
import { Id } from "../interfaces/Id.interface";
import { ItemCarrito } from "../interfaces/Carrito.interface";




export const getProductosPorCarritoDB = async (carrito:ItemCarrito[]) => {
    const query = `
    SELECT id,nombre, stock, precio, descripcion, marca, foto
	FROM public.productos
    WHERE id = ANY ($1)
    `
    const values= [carrito.map( item => item.idProducto)];
    try {
        const response: QueryResult = await pool.query(query,values)
        const result: (Producto)[] = await response.rows;
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getProductosDB------");
        console.log(err);
        return "error";
    }
}

    //si hay suficiente stock, le resta la cantidad comprada al stock de cada producto y genera el botón de compra

export const restarCantidadCompradaProductosDB = async (productos:ItemCarrito[]) => { //no estoy controlando que stock sea mayor que la cant comprada de cada producto

    for (let i = 0; i < productos.length; i++) {
        const prod = productos[i];
        const query = `
        UPDATE public.productos
        SET stock = stock - $1
        WHERE id = $2
        `
        const values= [prod.cant, prod.idProducto];
        try {
            const response: QueryResult = await pool.query(query, values)
        }
        catch (err) {
            console.error("----Error en acceso a BD:restarCantidadCompradaDB------");
            console.log(err);
            return "error";
        }
    }
    return 'ok';
}
    
export const sumarCantidadCompradaProductosDB = async (productos:ItemCarrito[]) => {

    for (let i = 0; i < productos.length; i++) {
        const prod = productos[i];
        const query = `
        UPDATE public.productos
        SET stock = stock + $1
        WHERE id = $2
        `
        const values= [prod.cant, prod.idProducto];
        try {
            await pool.query(query, values)
        }
        catch (err) {
            console.error("----Error en acceso a BD:restarCantidadCompradaDB------");
            console.log(err);
            return "error";
        }
    }
    return 'ok';
}

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
    SELECT id,nombre, stock, precio, descripcion, marca, foto
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

export const getProductoPorIdDB = async (id:number) => {
    const query = `
    SELECT id,nombre, stock, precio, descripcion, marca, foto
	FROM public.productos
    WHERE id=$1
    `
    const values = [id];
    try {
        const response: QueryResult = await pool.query(query,values)
        const result:Producto = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getProductoPorIdDB------");
        console.log(err);
        return "error";
    }
}

export const getProductoPorNombreMarcaDB = async (nombre:string,marca:string) => {
    const query = `
    SELECT id,nombre, stock, precio, descripcion, marca, foto
	FROM public.productos
    WHERE nombre=$1 AND marca=$2
    `
    const values = [nombre,marca];
    try {
        const response: QueryResult = await pool.query(query,values)
        const result:Producto = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getProductoPorNombreMarcaDB------");
        console.log(err);
        return "error";
    }
}
export const getPrecioTotalCompraDB = async (productos:ItemCarrito[]) => {
    let suma = 0;
    for (let i = 0; i < productos.length; i++) {
        const item = productos[i];
        const producto = await getProductoPorIdDB(item.idProducto);
        if (producto==='error'){
            return 'error';
        }
        if (producto.stock<item.cant){
            return 'menor_stock';
        }
        suma += (producto.precio * item.cant);
    }
    return suma;

}