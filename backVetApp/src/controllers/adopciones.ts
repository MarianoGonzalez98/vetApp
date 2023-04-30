import { Request, Response } from "express"

const getAdopciones = (req:Request, res:Response) => {
    res.send({data:"aca van las adopciones"})
}

const getAdopcion = ({params}:Request, res:Response) => {
    const { id } = params;
    res.send({data:"aca va la adopcion:"+ (id)})
} 

export {getAdopciones, getAdopcion}