import { Request, Response } from "express"
import { getCantDeTurnosRangoHorarioFecha, getTurnos, getTurnosComoVeterinario, insertTurno } from "../services/turno.service"
import { Turno } from "../interfaces/Turno.interface"
import { getClientes } from "../services/clientes.service"

/* importar servicios */
/* importar interfaces */
/* importar utilidades */

/* -------------------- CLIENTE ------------------- */


export const listarTurnosClienteController = async (req:Request, res:Response) => {
    const owner: string = req.query.cliente as string;

    const result = await getTurnos(owner);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(200).send({ data: result, statusCode: 200 })
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
    
    const dbResult = await insertTurno(turno.motivo,turno.perroNombre,turno.perroId,turno.fecha,turno.rangoHorario,turno.emailOwner,turno.descripcion);
    
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

export const listarTurnosVeterinarioController = async (req:Request, res:Response) => {
    const result = await getTurnosComoVeterinario();

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(200).send({ data: result, statusCode: 200 })
}

const aceptarTurno = async (req:Request, res:Response) => {
    /*
    1. Recibe un turno
    2. MOdifica el booleano de aceptado 
    3. Notifica al cliente
    */
}

const rechazarTurno = async(req:Request, res:Response) => {}

export const registrarUrgenciaController = async (req:Request, res:Response) => {
    const result = await getClientes();
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.send(result);

    insertarTurno (req,res);
}

const finalizarAtención = async (req:Request, res:Response) => {}


