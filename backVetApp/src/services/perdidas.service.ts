import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Perdida } from "../interfaces/Perdidas.interface";

export const insertPerdidaInDB = async (perdida:Perdida) => {
    const query = `
        INSERT INTO public.perdidas(
        "emailContacto", "nombreContacto", "apellidoContacto", "telefonoContacto", "autorEmail", "nombrePerro", "razaPerro", "fechaNacPerro","fechaPublicacion","sexoPerro","descripcionPerro",foto,"fechaPerdido", "plazaPerdido")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `
        const values = [perdida.emailContacto,perdida.nombreContacto,perdida.apellidoContacto,
            perdida.telefonoContacto,perdida.autorEmail, perdida.nombrePerro, perdida.razaPerro,
            perdida.fechaNacPerro, new Date().toJSON().slice(0, 10),perdida.sexoPerro,perdida.descripcionPerro,perdida.foto,
            perdida.fechaPerdido, perdida.plazaPerdido
        ];

        try {
            const response: QueryResult = await pool.query(query, values) 
            return 'ok';
        }
        catch (error) {
            console.error("----Error en acceso a BD:insertPerdidaInDB------");
            console.log(error);
            return "error";
        }
}

export const getPerdidasDB = async () => {
    const query = `
        SELECT id, "emailContacto", "nombreContacto", "apellidoContacto", "telefonoContacto", "autorEmail", "nombrePerro", "razaPerro", "fechaNacPerro","fechaPublicacion","sexoPerro","descripcionPerro",foto,"fechaPerdido", "plazaPerdido",encontrado
        FROM public.perdidas;
    `;
    try {
        const response: QueryResult = await pool.query(query) 
        const listaAdopciones:(Perdida)[] = response.rows;
        return listaAdopciones;
    }
    catch (error) {
        console.error("----Error en acceso a BD:getPerdidasDB------");
        console.log(error);
        return "error";
    }   
}


export const marcarEncontradoInDB = async (id:number) => {
    const query = `
        UPDATE public.perdidas
        SET encontrado=true
        WHERE id=$1;
    `
        const value = [id];

        try {
            const response: QueryResult = await pool.query(query, value) 
            return 'ok';
        }
        catch (error) {
            console.error("----Error en acceso a BD:marcarEncontradoInDB------");
            console.log(error);
            return "error";
        }
}