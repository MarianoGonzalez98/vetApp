import { Request, Response } from "express"
import { getCantDeTurnosRangoHorarioFecha, insertTurno } from "../services/turno.service"
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

export const SolicitarTurnoController = async (req:Request, res:Response) => {
    const turno:Turno = req.body;

    const result = await getCantDeTurnosRangoHorarioFecha(turno);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
    if (result.length >= 2) { // cambiar a 20
        res.status(409).send({ data: "No hay disponibilidad de turnos para el rango horario seleccionado en la fecha seleccionada", statusCode: 409 })
        return
    }

    const dbResult = await insertTurno(turno.motivo,turno.perro,turno.fecha,turno.rangoHorario,turno.emailOwner);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se cargó correctamente la solicitud del turno');

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


