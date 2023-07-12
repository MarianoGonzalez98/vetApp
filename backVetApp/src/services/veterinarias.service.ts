import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Veterinaria } from "../interfaces/Veterinarias.interface";

export const getVeterinarias = async () => {
    const query = `
    SELECT *
    FROM public.veterinarias
    `

    try {
        const response: QueryResult = await pool.query(query, [])
        const result: Veterinaria[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getVeterinarias------");
        console.log(err);
        return "error";
    }
}