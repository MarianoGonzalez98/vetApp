import { QueryResult } from "pg";
import { PaseadorCuidador } from "../interfaces/PaseadoresYCuidadores.interface";
import { pool } from "../utils/db.handle";

export const getPaseadorCuidador = async (email: String) => {
    const query = `
    SELECT *
    FROM public.paseadoresycuidadores
    WHERE email = $1
    `

    const values = [email]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: PaseadorCuidador = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getPaseadorCuidador------");
        console.log(err);
        return "error";
    }
}

export const insertPaseadorCuidador = async (paseadorcuidador: PaseadorCuidador) => {
    const query = `
    INSERT INTO public.paseadoresycuidadores(
        nombre, apellido, zona, telefono, email, oficio, disponibilidad)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `
    const values = [paseadorcuidador.nombre, paseadorcuidador.apellido, paseadorcuidador.zona, paseadorcuidador.telefono, paseadorcuidador.email, paseadorcuidador.oficio, paseadorcuidador.disponibilidad]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertPaseadorCuidador------");
        console.log(err);
        return "error";
    }
}

export const getPaseadoresCuidadores = async () => {
    const query = `
    SELECT *
    FROM public.paseadoresycuidadores
    `

    try {
        const response: QueryResult = await pool.query(query, [])
        const result: PaseadorCuidador[] = await response.rows
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getPaseadoresCuidadores------");
        console.log(err);
        return "error";
    }
}

export const toggleDisponible = async (paseadorcuidador: PaseadorCuidador) => {
    const query = `
    UPDATE public.paseadoresycuidadores
    SET disponible = $2
    WHERE email = $1;
    `
    const values = [paseadorcuidador.email, paseadorcuidador.disponible]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertPaseadorCuidador------");
        console.log(err);
        return "error";
    }
}