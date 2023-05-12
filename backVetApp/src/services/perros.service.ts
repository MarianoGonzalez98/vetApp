import { QueryResult } from "pg";
import { Perro } from "../interfaces/Perro.interface";
import { pool } from "../utils/db.handle";

export const getPerro = async (owner: string, nombre: string) => {
    const query = `
    SELECT p.nombre, p.raza, p.sexo, p."fechaNacimiento", p.observaciones, p.foto, p.owner
    FROM public.perros p INNER JOIN public.usuarios u ON (p.owner = u.email)
    WHERE (p.owner = $1) AND (p.nombre = $2)
    `

    const values = [owner, nombre]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Perro = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getPerro------");
        console.log(err);
        return "error";
    }
}

export const getPerros = async (owner: string) => {
    const query = `
    SELECT *
    FROM public.perros p
    WHERE p.owner = $1
    `

    const values = [owner]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Perro[] = await response.rows[0]
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getPerros------");
        console.log(err);
        return "error";
    }
}

export const insertPerro = async (perro: Perro) => {
    const query = `
    INSERT INTO public.perros(
        nombre, raza, sexo, "fechaNacimiento", observaciones, foto, owner)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `
    const values = [perro.nombre, perro.raza, perro.sexo, perro.fechaNacimiento, perro.observaciones, perro.foto, perro.owner]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertPerro------");
        console.log(err);
        return "error";
    }
}