import { Request, Response } from "express";
import { getClientes } from "../services/clientes.service";
import { NombreApellidoMailPersona } from "../interfaces/User.interface";

export const getClientesController = async (req: Request, res: Response) => {
    const result = await getClientes();
    if (result==='error'){
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.send({clientes:result});
}