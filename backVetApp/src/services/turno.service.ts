import { QueryResult } from "pg";
import { pool } from "../utils/db.handle";
import { Motivo, Turno } from "../interfaces/Turno.interface";

const insertTurno = async (motivo:Motivo, perro:string, fecha:string, rangoHorario:string) => {
    const queryTurno = `
    INSERT INTO public.turnos(
        motivo, perro, fecha, rangoHorario) 
        VALUES ($1, $2, $3, $4);
    `; //Falta usuario asociado
    const valuesTurno = [motivo, perro, fecha, rangoHorario]

    try{
        const response:QueryResult = await pool.query(queryTurno,valuesTurno) 
        return 'ok';
    }
    catch(err){
        console.error("----Error en acceso a BD:insertPassword------");
        console.log(err);
        return "error";
    }
}

const getTurnos = async (turnos:Turno[]) => {
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


export {insertTurno, getTurnos}