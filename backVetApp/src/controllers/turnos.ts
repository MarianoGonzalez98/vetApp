import { Request, Response } from "express"
import { Turno } from "../interfaces/Turno.interface"
/* importar servicios */
/* importar interfaces */
/* importar utilidades */

/* -------------------- CLIENTE ------------------- */

const visualizarTurnos = async (req:Request, res:Response) => {
    /*
    1. Seleccionar y enviar todos los turnos del cliente 
    ¿Como sé que cliente lo pide? ¿Eso se envía en el Request?
    */
    res.send({data:"aca van las turnos del cliente"})
}

const SolicitarTurno = async (req:Request, res:Response) => {
    const turno:Turno = req.body;

    /*
    1. Consultar si hay disponibilidad en ese rango y fecha
    1.1 Si hay, Guardar turno en la base de datos e incrementar los turnos en ese rango y fecha
    1.2 Si no hay, notificar error
    ¿hace falta una respuesta? 
    2. Notificar al veterinario
    */
}

const modificarTurno = async (re:Request, res:Response) => {
    /* 
    1. Recibe un turno con la información modificada
    2. Guarda la nueva infomacion
    */
}

const cancelarTurno = async (re:Request, res:Response) => {
    /* 
    1. Recibe un turno
    2. Notifica al veterinario que el turno fue cancelado
    3. Elimina al turno 
    */ 
}


/* -------------------- VETERINARIO ------------------- */

const visualizarTurnosVeterinario = async (req:Request, res:Response) => {
    /*
    1. Seleccionar y enviar todos los turnos del veteriinario
    ¿Como sé que cliente lo pide? ¿Eso se envía en el Request?
    */
    res.send({data:"aca van las turnos del veterinario"})
}

const aceptarTurno = async (req:Request, res:Response) => {
    /*
    1. Recibe un turno
    2. MOdifica el booleano de aceptado 
    3. Notifica al cliente
    */
}

const rechazarTurno = async(req:Request, res:Response) => {}

const registrarUrgencia = async (req:Request, res:Response) => {}

const finalizarAtención = async (req:Request, res:Response) => {}


export {visualizarTurnos, SolicitarTurno, modificarTurno, cancelarTurno, visualizarTurnosVeterinario, aceptarTurno, rechazarTurno, registrarUrgencia, finalizarAtención}