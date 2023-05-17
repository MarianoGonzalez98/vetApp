import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Turno } from "../interfaces/Turno.interface";

export const getCantDeTurnosRangoHorarioFecha = async (turno: Turno) => {
    const query = `
    SELECT *
    FROM public.turnos t
    WHERE (t.fecha = $1) AND (t."rangoHorario" = $2)
    `
    const valuesCantTurnos = [turno.fecha,turno.rangoHorario]

    try{
        const response:QueryResult = await pool.query(query,valuesCantTurnos) 
        const result: Turno[]  = await response.rows;
        return result;
    }
    catch(err){
        console.error("----Error en acceso a BD:getCantDeTurnosRangoHorarioFecha------");
        console.log(err);
        return "error";
    }
}

export const insertTurno = async (turno:Turno) => {
    const queryTurno = `
    INSERT INTO public.turnos(
        motivo, "perroId", fecha, "rangoHorario", "emailOwner", aceptado, descripcion,  "perroNombre", urgencia) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `; 
    const valuesTurno = [turno.motivo, turno.perroId, turno.fecha, turno.rangoHorario, turno.emailOwner, turno.aceptado, turno.descripcion, turno.perroNombre, turno.urgencia]

    try{
        const response:QueryResult = await pool.query(queryTurno,valuesTurno) 
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:insertTurno------");
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
    
    try{
        const response:QueryResult = await pool.query(query,values) 
        const result:Turno[] = await response.rows;
        return result;
    }
    catch(err){
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
    
    
    try{
        const response:QueryResult = await pool.query(query) 
        const result:Turno[] = await response.rows;
        return result;
    }
    catch(err){
        console.error("----Error en acceso a BD:getTurnosVeterinario------");
        console.log(err);
        return "error";
    }
}

export const cancelarTurno = async (id:number) => {
    const query = `
    DELETE 
    FROM public.turnos
    WHERE id = $1
    `;

    const values = [id]

    try{
        const response:QueryResult = await pool.query(query,values) 
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:aceptarTurno------");
        console.log(err);
        return "error";
    }
}

export const aceptarTurno = async (aceptado:boolean, id:number) => {
    const query = `
    UPDATE public.turnos 
    SET aceptado = $1
    WHERE id = $2
    `;

    const values = [aceptado,id]

    try{
        const response:QueryResult = await pool.query(query,values) 
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:aceptarTurno------");
        console.log(err);
        return "error";
    }
}


export const rechazarTurno = async (rechazado:boolean, id:number) => {
    const query = `
    UPDATE public.turnos 
    SET rechazado = $1
    WHERE id = $2
    `;

    const values = [rechazado,id]

    try{
        const response:QueryResult = await pool.query(query,values) 
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:rechazarTurno------");
        console.log(err);
        return "error";
    }
}