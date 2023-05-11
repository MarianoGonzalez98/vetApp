import { Request, Response } from "express"
import { PaseadorCuidador, RangoDate } from "../../../frontVetApp/src/lib/interfaces/PaseadoresYCuidadores.interface"

export const getPaseadoresCuidadores = (req: Request, res: Response) => {
    let rango: RangoDate = {
        inicio: new Date(),
        fin: new Date()
    }
    let paseador1: PaseadorCuidador = {
        nombre: "nombre1",
        apellido: "apellido1",
        horario: rango,
        fechas: rango,
        telefono: "111 111-1111",
        mail: "mail1",
        oficio: "Paseador"
    }
    let paseador2: PaseadorCuidador = {
        nombre: "nombre1",
        apellido: "apellido1",
        horario: rango,
        fechas: rango,
        telefono: "111 111-1111",
        mail: "mail1",
        oficio: "Paseador"
    }
    res.send({ data: [paseador1, paseador2] })
}