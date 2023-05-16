import { QueryResult } from "pg";
import { PaseadorCuidador } from "../interfaces/PaseadoresYCuidadores.interface";
import { pool } from "../utils/db.handle";

export const getPaseadorCuidador = async (email: String) => {
    const query = `
    SELECT nombre, apellido, zona, "disponibilidadDeFechasDesde", "disponibilidadDeFechasHasta", "disponibilidadHorariaDesde", "disponibilidadHorariaHasta", telefono, email, oficio, disponible
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
        nombre, apellido, zona, "disponibilidadDeFechasDesde", "disponibilidadDeFechasHasta", "disponibilidadHorariaDesde", "disponibilidadHorariaHasta", telefono, email, oficio)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `
    const values = [paseadorcuidador.nombre, paseadorcuidador.apellido, paseadorcuidador.zona, paseadorcuidador.disponibilidadDeFechasDesde, paseadorcuidador.disponibilidadDeFechasHasta, paseadorcuidador.disponibilidadHorariaDesde, paseadorcuidador.disponibilidadHorariaHasta, paseadorcuidador.telefono, paseadorcuidador.email, paseadorcuidador.oficio]

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
    SELECT nombre, apellido, zona, "disponibilidadDeFechasDesde", "disponibilidadDeFechasHasta", "disponibilidadHorariaDesde", "disponibilidadHorariaHasta", telefono, email, oficio, disponible
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