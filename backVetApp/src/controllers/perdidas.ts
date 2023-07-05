import { Request, Response } from "express"
import { getPerdidasDB, insertPerdidaInDB, marcarEncontradoInDB } from "../services/perdidas.service";
import { Perdida } from "../interfaces/Perdidas.interface";


export const insertPerdida = async (req:Request, res:Response) => {
    const perdidaInput:Perdida = req.body;

    perdidaInput.autorEmail= res.locals.jwtData.user.email;

    const dbResult = await insertPerdidaInDB(perdidaInput);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(201).send('Perro perdido publicado correctamente');
}


export const getPerdidas = async (req:Request, res:Response) => {
    const perdidas = await getPerdidasDB();
    
    if (perdidas==='error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }
    return res.status(200).send({publicaciones:perdidas});
}

export const marcarComoEncontrado = async (req:Request, res:Response) => { 
    const idPublicacion:number = req.body.id;

    const dbResult = await marcarEncontradoInDB(idPublicacion);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send('Se marco correctamente a la publicacion como encontrado');
}