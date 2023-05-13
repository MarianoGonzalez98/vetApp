import { Request, Response } from "express";
import { getPerro, getPerros, insertPerro } from "../services/perros.service"
import { Perro } from "../interfaces/Perro.interface"

export const cargarPerroController = async (req: Request, res: Response) => {
    const perro: Perro = req.body;

    const result = await getPerro(perro.owner, perro.nombre);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (result) { //si devuelve un elemento es que existe el perro
        //409 conflict
        res.status(409).send({ data: "El nombre del perro ya se encuentra registrado para ese cliente", statusCode: 409 })
        return
    }

    const dbResult = await insertPerro(perro);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se cargó correctamente al perro');
}

export const listarPerrosController = async (req: Request, res: Response) => {
    const owner: string = req.query.cliente as string;

    const result = await getPerros(owner);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    console.log(result);
    res.status(200).send({ data: result, statusCode: 200 })
}