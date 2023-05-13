import { Request, Response } from "express"
import { AdopcionInput } from "../interfaces/Adopciones.interface";
import { insertAdopcionInDB } from "../services/adopciones.service";


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

