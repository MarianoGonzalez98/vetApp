import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { NombreApellidoMailPersona } from "../interfaces/User.interface";

export const getClientes = async () => {
    const query = `
    SELECT u.email, u.nombre, u.apellido
    FROM public.usuarios u
    WHERE u.rol = 'cliente'
    `
    try {
        const response: QueryResult = await pool.query(query)
        const result: NombreApellidoMailPersona[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getClientes------");
        console.log(err);
        return "error";
    }

}