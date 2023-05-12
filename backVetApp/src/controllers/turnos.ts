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


const verificarDisponibilidad = async (req:Request, res:Response) => {
    const turno:Turno = req.body;
    const result = await getCantDeTurnosRangoHorarioFecha(turno);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
    if (result.length >= 20) { 
        res.status(409).send({ data: "No hay disponibilidad de turnos para el rango horario seleccionado en la fecha seleccionada", statusCode: 409 })
        return
    }
}

const insertarTurno = async (req:Request, res:Response) => { 
    let turno:Turno = req.body;
    
    const dbResult = await insertTurno(turno.motivo,turno.perro,turno.fecha,turno.rangoHorario,turno.emailOwner);
    
    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
}

export const SolicitarTurnoController = async (req:Request, res:Response) => { //FALTA MANDAR MAIL A LOS VETERINARIOS

    verificarDisponibilidad(req,res);
    
    insertarTurno (req,res);

    let turno:Turno = req.body;

    if (turno.motivo === "Vacunación b") { //Debe sacarse otro turno para el año siguiente
       
        const nuevaFechaString = turno.fecha.toString();
        const nuevaFecha = Date.parse(nuevaFechaString);
        let nuevaFechaDate = new Date(nuevaFecha);
        nuevaFechaDate.setFullYear(nuevaFechaDate.getFullYear() + 1);

        turno.fecha = nuevaFechaDate;
        req.body = turno;

        verificarDisponibilidad(req,res);

        insertarTurno(req,res);
    }

    res.status(201).send('Se cargó correctamente la solicitud del turno'); //¿Cómo notifico que se guardó para el año sig también?
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


