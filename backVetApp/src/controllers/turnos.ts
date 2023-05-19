import { Request, Response } from "express"
import { aceptarTurno, cancelarTurno, getCantDeTurnosRangoHorarioFecha, getCantDeTurnosRangoHorarioFechab, getTurno, getTurnos, getTurnosComoVeterinario, insertTurno, modificarTurno, rechazarTurno } from "../services/turno.service"
import { Turno } from "../interfaces/Turno.interface"
import { getClientes } from "../services/clientes.service"
import { sendMailTest } from "../utils/mailer.handle"

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

const verificarDisponibilidad = async (fecha:Date, rangoHorario:string, res:Response) => {

    const result = await getCantDeTurnosRangoHorarioFechab(fecha,rangoHorario);

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
    
    const dbResult = await insertTurno(turno);
    
    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
}

const enviarMailSolicituTurno = async (req:Request, res:Response) => {
    let turno:Turno = req.body;

    let email = "felipetamburri@gmail.com" //solo para testear
    //let emailDestinatario = veterinarios;
    let asunto = "Nueva solicitud de turno"
    let texto = `¡Un cliente solicitó un nuevo turno!
    
    A continuación te dejamos los datos del turno.
    
    Cliente: ${turno.emailOwner}
    Fecha: ${turno.fecha}
    Rango horario: ${turno.rangoHorario}
    Perro: ${turno.perroNombre}`;
    
    sendMailTest(email, asunto, texto);
}

export const SolicitarTurnoController = async (req:Request, res:Response) => { //FALTA MANDAR MAIL A LOS VETERINARIOS

    let turno:Turno = req.body;
    turno.urgencia = false;
    turno.aceptado = false;
    req.body = turno;

    verificarDisponibilidad(turno.fecha,turno.rangoHorario,res);

    insertarTurno (req,res);


    if (turno.motivo === "Vacunación b") { //Debe sacarse otro turno para el año siguiente
       
        const nuevaFechaString = turno.fecha.toString();
        const nuevaFecha = Date.parse(nuevaFechaString);
        let nuevaFechaDate = new Date(nuevaFecha);
        nuevaFechaDate.setFullYear(nuevaFechaDate.getFullYear() + 1);

        turno.fecha = nuevaFechaDate;

        verificarDisponibilidad(turno.fecha,turno.rangoHorario,res);

        insertarTurno(req,res);
    }

    enviarMailSolicituTurno (req,res);

    res.status(201).send('Se cargó correctamente la solicitud del turno'); //¿Cómo notifico que se guardó para el año sig también?
}

const enviarMailModificarTurno = async (perroNombre:string,fecha:Date,rango:string,emailOwner:string) => {
    let email = "felipetamburri@gmail.com" //solo para testear
    //let emailDestinatario = veterinarios;
    let asunto = "Solicitud de turnoModificado"
    let texto = `¡Un cliente solicitó un nuevo turno!
    
    A continuación te dejamos los datos del turno.
    
    Cliente: ${emailOwner}
    Fecha: ${fecha}
    Rango horario: ${rango}
    Perro: ${perroNombre}`;
    
    sendMailTest(email, asunto, texto);
}

export const modificarTurnoController = async (req:Request, res:Response) => {

   const id:number = req.body.turnoId;
   const emailOwner:string = req.body.emailOwner;
   const perroId:number = req.body.perroId;
   const perroNombre:string = req.body.perroNombre;
   const motivo:string = req.body.motivo;
   const fecha:Date = req.body.fecha;
   const rango:string = req.body.rango;
   
    
   verificarDisponibilidad(fecha,rango,res);

    const result = await modificarTurno(id,perroId,perroNombre,motivo,fecha,rango);
    if (result === 'error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }

    enviarMailModificarTurno(perroNombre,fecha,rango,emailOwner);

    return res.status(200).send('Se actualizó el turno correctamente.');
}

export const cancelarTurnoController = async (req:Request, res:Response) => {
    let turno:number = req.body.idTurnoSelec;
    
    const dbResult = await cancelarTurno(turno);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se canceló correctamente el turno');
    
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

export const aceptarTurnoController = async (req:Request, res:Response) => {
    let aceptado:boolean = req.body.aceptado;
    let turno:number = req.body.idTurnoSelec;

    const dbResult = await aceptarTurno(aceptado,turno);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se aceptó correctamente el turno');
}

export const rechazarTurnoController = async(req:Request, res:Response) => {
    let rechazado:boolean = req.body.rechazado;
    let turno:number = req.body.idTurnoSelec;
    let justificacion:string = req.body.justificacion;

    const dbResult = await rechazarTurno(rechazado,turno);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se rechazó correctamente el turno');
}

export const registrarUrgenciaController = async (req:Request, res:Response) => {
    const result = await getClientes();
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.send(result);


    let turno:Turno = req.body;
    turno.urgencia = true;
    turno.aceptado = true;
    req.body = turno;

    insertarTurno (req,res);
}

const finalizarAtención = async (req:Request, res:Response) => {}


