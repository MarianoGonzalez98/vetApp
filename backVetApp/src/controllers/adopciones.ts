import { Request, Response } from "express"
import { AdopcionInput } from "../interfaces/Adopciones.interface";
import { getAdopcionesDB, insertAdopcionInDB, marcarAdoptadoInDB } from "../services/adopciones.service";


export const insertAdopcion = async (req:Request, res:Response) => {
    const adopcionInput:AdopcionInput = req.body;

    adopcionInput.autorEmail= res.locals.jwtData.user.email;

    const dbResult = await insertAdopcionInDB(adopcionInput);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(201).send('Adopcion publicada correctamente');
}


export const getAdopciones = async (req:Request, res:Response) => {
    const adopciones = await getAdopcionesDB();
    
    if (adopciones==='error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }
    return res.status(200).send({publicaciones:adopciones});
}

export const marcarComoAdoptado = async (req:Request, res:Response) => { 
    const idPublicacion:number = req.body.id;

    const dbResult = await marcarAdoptadoInDB(idPublicacion);
    
    if (dbResult==='error'){
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send('Se marco correctamente a la publicacion como adoptado');
}