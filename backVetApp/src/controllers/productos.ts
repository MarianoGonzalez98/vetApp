import { Request, Response } from "express"
import { getProductosDB, insertProductoDB } from "../services/productos.service";
import { Producto } from "../interfaces/Producto.interface";

export const insertProductoController = async (req:Request, res:Response) => {
    const productoInput:Producto = req.body;
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