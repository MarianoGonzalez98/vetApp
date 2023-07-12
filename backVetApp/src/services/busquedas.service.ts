import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Perdida } from "../interfaces/Perdidas.interface";

export const insertBusquedaInDB = async (busqueda:Perdida) => {
    const query = `
        INSERT INTO public.busquedas(
        "emailContacto", "nombreContacto", "apellidoContacto", "telefonoContacto", "autorEmail", "nombrePerro", "razaPerro", "fechaPublicacion","sexoPerro","descripcionPerro",foto,"fechaPerdido", "plazaPerdido")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `
        const values = [busqueda.emailContacto,busqueda.nombreContacto,busqueda.apellidoContacto,
            busqueda.telefonoContacto,busqueda.autorEmail, busqueda.nombrePerro, busqueda.razaPerro,
            new Date().toJSON().slice(0, 10),busqueda.sexoPerro,busqueda.descripcionPerro,busqueda.foto,
            busqueda.fechaPerdido, busqueda.plazaPerdido
        ];

        try {
            const response: QueryResult = await pool.query(query, values) 
            return 'ok';
        }
        catch (error) {
            console.error("----Error en acceso a BD:insertBusquedaInDB------");
            console.log(error);
            return "error";
        }
}

export const getBusquedasDB = async () => {
    const query = `
        SELECT id, "emailContacto", "nombreContacto", "apellidoContacto", "telefonoContacto", "autorEmail", "nombrePerro", "razaPerro","fechaPublicacion","sexoPerro","descripcionPerro",foto,"fechaPerdido", "plazaPerdido","duenoEncontrado"
        FROM public.busquedas;
    `;
    try {
        const response: QueryResult = await pool.query(query) 
        const listaBusquedas:(Perdida)[] = response.rows;
        return listaBusquedas;
    }
    catch (error) {
        console.error("----Error en acceso a BD:getBusquedasDB------");
        console.log(error);
        return "error";
    }   
}


export const marcarDuenoEncontradoInDB = async (id:number) => {
    const query = `
        UPDATE public.busquedas
        SET "duenoEncontrado"=true
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