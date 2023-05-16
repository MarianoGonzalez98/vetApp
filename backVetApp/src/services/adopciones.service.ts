import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Adopcion, AdopcionInput, PublicacionAdopcion } from "../interfaces/Adopciones.interface";

export const insertAdopcionInDB = async (adopcion:AdopcionInput) => {
    const query = `
        INSERT INTO public.adopciones(
        "emailContacto", "nombreContacto", "apellidoContacto", "telefonoContacto", "autorEmail", "nombrePerro", "razaPerro", "fechaNacPerro")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `
        const values = [adopcion.emailContacto,adopcion.nombreContacto,adopcion.apellidoContacto,
            adopcion.telefonoContacto,adopcion.autorEmail, adopcion.nombrePerro, adopcion.razaPerro,
            adopcion.fechaNacPerro
        ];

        try {
            const response: QueryResult = await pool.query(query, values) 
            return 'ok';
        }
        catch (error) {
            console.error("----Error en acceso a BD:insertPassword------");
            console.log(error);
            return "error";
        }
}

export const getAdopcionesDB = async () => {
    const query = `
        SELECT "emailContacto" as email, "nombrePerro" as nombre, "razaPerro" as raza, "fechaNacPerro" as "fechaNacimiento", adoptado
        FROM public.adopciones;
    `;
    try {
        const response: QueryResult = await pool.query(query) 
        const listaAdopciones:PublicacionAdopcion[] = response.rows;
        return listaAdopciones;
    }
    catch (error) {
        console.error("----Error en acceso a BD:getAdopcionesDB------");
        console.log(error);
        return "error";
    }
}

