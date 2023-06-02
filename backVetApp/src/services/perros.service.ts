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
    WHERE (p.owner = $1) AND (p.fallecido = false)
    `

    const values = [owner]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Perro[] = await response.rows
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
        nombre, raza, sexo, "fechaNacimiento", observaciones, owner, peso, vacunas, antiparasitarios, castrado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `
    const values = [perro.nombre, perro.raza, perro.sexo, perro.fechaNacimiento, perro.observaciones, perro.owner, perro.peso, perro.vacunas, perro.antiparasitarios, perro.castrado];

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

export const marcarComoFallecido = async (perro: Perro) => {
    const query = `
    UPDATE public.perros
    SET fallecido = true
    WHERE (nombre = $1) AND (owner = $2);
    `
    const values = [perro.nombre, perro.owner];

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:marcarComoFallecido------");
        console.log(err);
        return "error";
    }
}

export const actualizarPerro = async (perro: Perro, nombreAnterior: string) => {
    const query = `
    UPDATE public.perros
    SET nombre = $1, raza = $3, sexo = $4, "fechaNacimiento" = $5, observaciones = $6, foto = $7
    WHERE (nombre = $8) AND (owner = $2);
    `
    const values = [perro.nombre, perro.owner, perro.raza, perro.sexo, perro.fechaNacimiento, perro.observaciones, perro.foto, nombreAnterior];

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarPerro------");
        console.log(err);
        return "error";
    }
}

export const actualizarLibreta = async (id:number, vacunas:string, antiparasitarios:string, castrado:boolean, peso:number) => {
    const query = `
    UPDATE public.perros
    SET vacunas=$2, peso=$3, antiparasitarios=$4, castrado=$5
    WHERE (id = $1);
    `

    const values = [id,vacunas,peso,antiparasitarios,castrado]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarLibreta------");
        console.log(err);
        return "error";
    }
}

export const actualizarVacunacion = async (id:number, vacunas:string, peso:number) => {
    const query = `
    UPDATE public.perros
    SET vacunas=$2, peso=$3
    WHERE (id = $1);
    `

    const values = [id,vacunas,peso]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarLibreta------");
        console.log(err);
        return "error";
    }
}

export const actualizarCastracion = async (id:number,castrado:boolean, peso:number) => {
    const query = `
    UPDATE public.perros
    SET castrado=$2, peso=$3
    WHERE (id = $1);
    `

    const values = [id,castrado,peso]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarLibreta------");
        console.log(err);
        return "error";
    }
}

export const actualizarAntiparasitario = async (id:number, antiparasitarios:string, peso:number) => {
    const query = `
    UPDATE public.perros
    SET antiparasitarios=$2, peso=$3
    WHERE (id = $1);
    `

    const values = [id,antiparasitarios,peso]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarLibreta------");
        console.log(err);
        return "error";
    }
}

export const actualizarConsultaGeneral = async (id:number, peso:number) => {
    const query = `
    UPDATE public.perros
    SET peso=$2
    WHERE (id = $1);
    `

    const values = [id,peso]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarLibreta------");
        console.log(err);
        return "error";
    }
}


export const getPerroJuli = async (id:number) => {
    const query = `
    SELECT *
    FROM public.perros
    WHERE (id = $1) 
    `

    const values = [id]
    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Perro = await response.rows[0];
        return result
    }
    catch (err) {
        console.error("----Error en acceso a BD:getPerroJuli------");
        console.log(err);
        return "error";
    }
}