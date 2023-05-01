import { Request, Response } from "express"

const getTurnos = (req:Request, res:Response) => {
    res.send({data:"aca van las turnos del cliente"})
}

const getTurno = ({params}:Request, res:Response) => {
    const { id } = params; // sería el id del turno
    res.send({data:"aca va el turno: "+ (id)})
} 

export {getTurnos,getTurno}