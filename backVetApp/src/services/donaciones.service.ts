import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Campaign, Donacion, PaymentID } from "../interfaces/Donaciones.interface";

export const insertDonacion = async (donacion:(Donacion&PaymentID)) => {
    await new Promise(r => setTimeout(r, 2000));
    const query = `
    INSERT INTO public.donaciones( "fechaHora", monto, "emailDonante", "nombreCampaign", "paymentId")
        VALUES ($1, $2, $3, $4, $5)
        on conflict ("paymentId") do nothing 
        returning "paymentId"
    `
    const values = [donacion.fechaHora,donacion.monto,donacion.emailDonante,donacion.nombreCampaign,donacion.paymentId];
    try {
        const response: QueryResult = await pool.query(query, values)
        const result = await response.rows[0]; // si trae un resultado es porque hubo CONFLICTO(donacion repetida)
        if (result){
            return 'repetido';
        }
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertDonacion------");
        console.log(err);
        return "error";
    }
}

export const getCampaign = async (nombre: string) => {
    const query = `
    SELECT *
    FROM public.campaigns
    WHERE nombre = $1
    `

    const values = [nombre]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Campaign = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getCampaign------");
        console.log(err);
        return "error";
    }
}

export const insertCampaign = async (campaign: Campaign) => {
    const query = `
    INSERT INTO public.campaigns(
        nombre, "montoARecaudar", "fechaLimite", descripcion)
        VALUES ($1, $2, $3, $4);
    `
    const values = [campaign.nombre, campaign.montoARecaudar, campaign.fechaLimite, campaign.descripcion];

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertCampaign------");
        console.log(err);
        return "error";
    }
}

export const getCampaigns = async () => {
    const query = `
    SELECT *
    FROM public.campaigns
    `

    try {
        const response: QueryResult = await pool.query(query, [])
        const result: Campaign[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getCampaigns------");
        console.log(err);
        return "error";
    }
}