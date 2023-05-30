import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Campaign } from "../interfaces/Donaciones.interface";

export const getCampaign = async (nombre: String) => {
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
        console.error("----Error en acceso a BD:getPerro------");
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
        console.error("----Error en acceso a BD:getPaseadoresCuidadores------");
        console.log(err);
        return "error";
    }
}

export const finalizarCampaign = async (nombre: String) => {
    const query = `
    UPDATE public.campaigns
    SET finalizada = true
    WHERE nombre = $1;
    `
    const values = [nombre]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:finalizarCampaign------");
        console.log(err);
        return "error";
    }
}