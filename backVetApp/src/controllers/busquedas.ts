import { Request, Response } from "express"
import { Perdida } from "../interfaces/Perdidas.interface";
import { getBusquedasDB, insertBusquedaInDB, marcarDuenoEncontradoInDB } from "../services/busquedas.service";


export const insertBusqueda = async (req:Request, res:Response) => {
    const busquedaInput:Perdida = req.body;

    busquedaInput.autorEmail= res.locals.jwtData.user.email;

    const dbResult = await insertBusquedaInDB(busquedaInput);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(201).send('Perro encontrado publicado correctamente');
}


export const getBusquedas = async (req:Request, res:Response) => {
    const busquedas = await getBusquedasDB();
    
    if (busquedas==='error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }
    return res.status(200).send({publicaciones:busquedas});
}

export const marcarComoDuenoEncontrado = async (req:Request, res:Response) => { 
    const idPublicacion:number = req.body.id;

    const dbResult = await marcarDuenoEncontradoInDB(idPublicacion);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send('Se marco correctamente a la publicacion como dueño encontrado');
}