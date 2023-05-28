import { Request, Response } from "express";
import { Campaign } from "../interfaces/Donaciones.interface";
import { getCampaign, getCampaigns, insertCampaign } from "../services/donaciones.service";

export const crearCampaignController = async (req: Request, res: Response) => {
    const campaign: Campaign = req.body;

    const result = await getCampaign(campaign.nombre);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (result) { //si devuelve un elemento es que existe el perro
        //409 conflict
        res.status(409).send({ data: "El nombre de la campaña ya se encuentra registrado", statusCode: 409 })
        return
    }

    const dbResult = await insertCampaign(campaign);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se creó correctamente la campaña');
}

export const listarCampaignsController = async (req: Request, res: Response) => {
    const result = await getCampaigns();

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({ data: result, statusCode: 200 })
}