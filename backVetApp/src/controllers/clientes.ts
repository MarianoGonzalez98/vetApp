import { Request, Response } from "express";
import { getClienteJuli, getClientes, getClientesCompletos } from "../services/clientes.service";
import { NombreApellidoMailPersona } from "../interfaces/User.interface";

export const getClientesController = async (req: Request, res: Response) => {
    const result = await getClientes();
    if (result === 'error') {
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.send({ clientes: result });
}

export const getClientesCompletosController = async (req: Request, res: Response) => {
    const result = await getClientesCompletos();
    if (result === 'error') {
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.send({ clientes: result });
}

export const getClienteJuliController = async (req: Request, res: Response) => {
    const email: string= req.query.email as string;

    const result = await getClienteJuli(email);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({ data: result, statusCode: 200 })
}