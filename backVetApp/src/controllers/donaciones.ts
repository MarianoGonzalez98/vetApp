import { Request, Response } from "express";
import { Campaign } from "../interfaces/Donaciones.interface";
import { getCampaign, getCampaigns, getDonacion, getDonaciones, insertCampaign } from "../services/donaciones.service";
import { generateComprobanteDonacion, generatePDF } from "../utils/pdf.handle";

export const listarMisDonacionesController = async (req:Request, res:Response) => {
    const emailJWT:string = res.locals.jwtData.user.email

    const misDonaciones = await getDonaciones(emailJWT);
    if (misDonaciones === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({misDonaciones:misDonaciones})

}

export const descargarComprobanteDonacionController = async (req:Request, res:Response) => {
    let paymentId = req.body.paymentId
    const donacion = await getDonacion(paymentId);

    if (donacion==="error"){
        res.status(500).send("error en la generacion del comprobante");
        return;
    }

    const pdf = await generateComprobanteDonacion(donacion);
    let filename = `comprobanteDonacion${paymentId}.pdf`;
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    res.send(pdf);
}

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