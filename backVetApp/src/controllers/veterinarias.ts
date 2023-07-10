import { Request, Response } from "express"
import { getVeterinarias } from "../services/veterinarias.service";

export const listarVeterinariasController = async (req: Request, res: Response) => {
    const result = await getVeterinarias();

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    console.log(result);
    res.status(200).send({ data: result, statusCode: 200 })
}