import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Turno } from "../interfaces/Turno.interface";

export const getCantDeTurnosRangoHorarioFecha = async (turno: Turno) => {
    const query = `
    SELECT *
    FROM public.turnos t
    WHERE (t.fecha = $1) AND (t."rangoHorario" = $2) AND (t.finalizado = false)
    `
    const valuesCantTurnos = [turno.fecha, turno.rangoHorario]

    try {
        const response: QueryResult = await pool.query(query, valuesCantTurnos)
        const result: Turno[] = await response.rows;
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getCantDeTurnosRangoHorarioFecha------");
        console.log(err);
        return "error";
    }
}

export const getCantDeTurnosRangoHorarioFechab = async (fecha: Date, rangoHorario: string) => {
    const query = `
    SELECT *
    FROM public.turnos t
    WHERE (t.fecha = $1) AND (t."rangoHorario" = $2)
    `
    const valuesCantTurnos = [fecha, rangoHorario]

    try {
        const response: QueryResult = await pool.query(query, valuesCantTurnos)
        const result: Turno[] = await response.rows;
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getCantDeTurnosRangoHorarioFecha------");
        console.log(err);
        return "error";
    }
}

export const insertTurno = async (turno: Turno) => {
    const queryTurno = `
    INSERT INTO public.turnos(
        motivo, "perroId", fecha, "rangoHorario", "emailOwner", aceptado, descripcion,  "perroNombre", urgencia, finalizado) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
    const valuesTurno = [turno.motivo, turno.perroId, turno.fecha, turno.rangoHorario, turno.emailOwner, turno.aceptado, turno.descripcion, turno.perroNombre, turno.urgencia, turno.finalizado]

    try {
        const response: QueryResult = await pool.query(queryTurno, valuesTurno)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertTurno------");
        console.log(err);
        return "error";
    }
}

export const getTurno = async (id: number) => {
    const query = `
    SELECT *
    FROM public.turnos 
    WHERE id = $1
    `
    const values = [id]

    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        const result: Turno = await response.rows[0];
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getTurno------");
        console.log(err);
        return "error";
    }
}


export const getTurnos = async (owner: string) => {
    const query = `
    SELECT * 
    FROM public.turnos P
    WHERE P."emailOwner" = $1
    `;
    const values = [owner]

    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Turno[] = await response.rows;
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getTurnosCliente------");
        console.log(err);
        return "error";
    }
}

export const getTurnosComoVeterinario = async () => {
    const query = `
    SELECT * 
    FROM public.turnos P
    `;


    try {
        const response: QueryResult = await pool.query(query)
        const result: Turno[] = await response.rows;
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getTurnosVeterinario------");
        console.log(err);
        return "error";
    }
}

export const cancelarTurno = async (id: number) => {
    const query = `
    DELETE 
    FROM public.turnos
    WHERE id = $1
    `;

    const values = [id]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:cancelarTurno------");
        console.log(err);
        return "error";
    }
}

export const aceptarTurno = async (aceptado: boolean, id: number) => {
    const query = `
    UPDATE public.turnos 
    SET aceptado = $1
    WHERE id = $2
    `;

    const values = [aceptado, id]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:aceptarTurno------");
        console.log(err);
        return "error";
    }
}


export const rechazarTurno = async (rechazado: boolean, id: number) => {
    const query = `
    UPDATE public.turnos 
    SET rechazado = $1
    WHERE id = $2
    `;

    const values = [rechazado, id]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:rechazarTurno------");
        console.log(err);
        return "error";
    }
}

export const modificarTurno = async (id: number, perroId: number, perroNombre: string, motivo: string, fecha: Date, rango: string) => {
    const query = `
    UPDATE public.turnos 
    SET motivo = $1, "perroId" = $2, fecha = $3, "rangoHorario" = $4, "perroNombre" = $6, aceptado = $7
    WHERE id = $5
    `;

    const values = [motivo, perroId, fecha, rango, id, perroNombre, false]

    try {
        const response: QueryResult = await pool.query(query, values) //hace la query
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:modificarTurno------");
        console.log(err);
        return "error";
    }
}

export const getTurnosPerro = async (perroId: number) => {
    const query = `
    SELECT * 
    FROM public.turnos
    WHERE "perroId" = $1
    `;
    const values = [perroId]
    console.log(perroId);

    try {
        const response: QueryResult = await pool.query(query, values)
        const result: Turno[] = await response.rows;
        console.log(result);
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:getTurnosPerro------");
        console.log(err);
        return [];
    }
}


export const getTurnosPendientesPasados = async () => {
    const query = `
    SELECT * 
    FROM public.turnos
    WHERE (fecha < CURRENT_DATE)AND(aceptado = false)AND(rechazado = false)
    `;

    try {
        const response: QueryResult = await pool.query(query)
        const result: Turno[] = await response.rows;
        return result;
    }
    catch (err) {
        console.error("----Error en acceso a BD:cancelarTurno------");
        console.log(err);
        return "error";
    }
}


export const archivarTurno = async (id: number) => {
    const query = `
    UPDATE public.turnos 
    SET archivado = $1
    WHERE id = $2
    `;

    const values = [true, id]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:archivarTurno------");
        console.log(err);
        return "error";
    }
}

export const actualizarDescripcion = async (id:number, descripcion:string, precio:number) => { //POR FINALIZADO
    const query = `
    UPDATE public.turnos 
    SET descripcion = $1, finalizado = $3, precio = $4
    WHERE id = $2
    `;

    const values = [descripcion,id,true,precio]

    try {
        const response: QueryResult = await pool.query(query, values)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:actualizarDescripcionTurno------");
        console.log(err);
        return "error";
    }

}

export const insertUrgencia = async (turno: Turno) => {
    const queryTurno = `
    INSERT INTO public.turnos(
        motivo, "perroId", fecha, "rangoHorario", "emailOwner", aceptado, descripcion,  "perroNombre", urgencia, finalizado, precio) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `;
    const valuesTurno = [turno.motivo, turno.perroId, turno.fecha, turno.rangoHorario, turno.emailOwner, turno.aceptado, turno.descripcion, turno.perroNombre, turno.urgencia, turno.finalizado, turno.precio]

    try {
        const response: QueryResult = await pool.query(queryTurno, valuesTurno)
        return 'ok';
    }
    catch (err) {
        console.error("----Error en acceso a BD:insertUrgencia------");
        console.log(err);
        return "error";
    }
}