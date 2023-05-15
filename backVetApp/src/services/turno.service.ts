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

export const insertTurno = async (motivo:string, perro:number, fecha:Date, rangoHorario:string, emailOwner:string,descripcion:string) => {
    const queryTurno = `
    INSERT INTO public.turnos(
        motivo, "perroId", fecha, "rangoHorario", "emailOwner",aceptado,descripcion) 
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `; 
    const valuesTurno = [motivo, perro, fecha, rangoHorario,emailOwner,false,descripcion]

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

export const getTurnos = async (turnos:Turno[]) => {
    const query = `
    SELECT * 
    FROM public.turnos 
    `;
    const values = [turnos]
    
    try{
        const response:QueryResult = await pool.query(query,values) 
        const turnosJSON = await response.rows;
        return turnosJSON;
    }
    catch(err){
        console.error("----Error en acceso a BD:getCurrentPass------");
        console.log(err);
        return "error";
    }
}


