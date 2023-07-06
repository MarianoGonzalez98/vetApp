import { Request, Response } from "express"
import { getProductoPorIdDB, getProductoPorNombreMarcaDB, getProductosDB, insertProductoDB, updateProductoPorIdDB } from "../services/productos.service";
import { Producto } from "../interfaces/Producto.interface";
import { decodeToHTML_JPEG, encodeRezizeImgToJPEG } from "../utils/img.handle";

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

export const getProductoPorIdController = async (req:Request,res:Response) => {
    const idProducto = Number(req.params.id);
    const producto = await getProductoPorIdDB(idProducto);
    
    if (producto==='error'){
        res.status(500).send("posible error en base de datos:getProductoPorIdDB")
        return
    }
    if (producto){
        producto.foto = decodeToHTML_JPEG(producto.foto);
    }
    return res.status(200).send({producto:producto});
}

export const getProductosController = async (req:Request, res:Response) => {
    const productosDB = await getProductosDB();
    if (productosDB==='error'){
        res.status(500).send("posible error en base de datos:getProductos")
        return
    }
    let productos = productosDB.map( p => ({
        ...p,
        foto: decodeToHTML_JPEG(p.foto),
    }))
    return res.status(200).send({productos:productos});
}

export const updateProductoPorIdController =  async (req:Request, res:Response) => {
    const prod:Producto = req.body.producto;
    try {
        if (prod.foto){
            prod.foto= await encodeRezizeImgToJPEG(prod.foto) || "";
        }
        await updateProductoPorIdDB(prod);
        return res.status(200).send('Se actualizó el producto correctamente.');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar el producto")
    }
}