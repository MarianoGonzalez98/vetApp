import { Request, Response } from "express"
import { getProductoPorNombreMarcaDB, getProductosDB, insertProductoDB } from "../services/productos.service";
import { Producto } from "../interfaces/Producto.interface";

export const insertProductoController = async (req:Request, res:Response) => {
    const productoInput:Producto = req.body.producto;
    const existeProducto = await getProductoPorNombreMarcaDB(productoInput.nombre,productoInput.marca);
    if (existeProducto==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos:getProductoPorNombreDB", statusCode: 500 })
        return
    }
    if (existeProducto){
        res.status(409).send('Error: ya existe el producto');
        return;
    }
    const dbResult = await insertProductoDB(productoInput);
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos:insertProducto", statusCode: 500 })
        return
    }
    res.status(201).send('Producto cargado correctamente');
}

export const getProductosController = async (req:Request, res:Response) => {
    const productos = await getProductosDB();
    
    if (productos==='error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos:getProductos")
        return
    }
    return res.status(200).send({productos:productos});
}