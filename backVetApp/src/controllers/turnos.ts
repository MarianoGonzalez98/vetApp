import { Request, Response } from "express"
import { aceptarTurno, archivarTurno, cancelarTurno, getCantDeTurnosRangoHorarioFecha, getCantDeTurnosRangoHorarioFechab, getTurno, getTurnos, getTurnosComoVeterinario, insertTurno, insertUrgencia, modificarTurno, rechazarTurno } from "../services/turno.service"
import { Turno } from "../interfaces/Turno.interface"
import { getClientes } from "../services/clientes.service"
import { sendMailTest } from "../utils/mailer.handle"
import { actualizarLibreta } from "../services/perros.service"

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



export const SolicitarTurnoController = async (req:Request, res:Response) => { 

    let turno:Turno = req.body;
    turno.urgencia = false;
    turno.aceptado = false;
    turno.finalizado = false;
    req.body = turno;

    const result = await getCantDeTurnosRangoHorarioFechab(turno.fecha,turno.rangoHorario);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
    if (result.length >= 20) { 
        res.status(409).send({ data: "No hay disponibilidad de turnos para el rango horario seleccionado en la fecha seleccionada", statusCode: 409 })
        return
    }
    
    const dbResult = await insertTurno(turno);
    
    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }


    if (turno.motivo === "Vacunación b") { //Debe sacarse otro turno para el año siguiente
       
        const nuevaFechaString = turno.fecha.toString();
        const nuevaFecha = Date.parse(nuevaFechaString);
        let nuevaFechaDate = new Date(nuevaFecha);
        nuevaFechaDate.setFullYear(nuevaFechaDate.getFullYear() + 1);

        turno.fecha = nuevaFechaDate;

        const result = await getCantDeTurnosRangoHorarioFechab(turno.fecha,turno.rangoHorario);

        if (result === "error") {
            //HTTP 500 Internal server error
            res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
            return
        }
        if (result.length >= 20) { 
            res.status(409).send({ data: "No hay disponibilidad de turnos para el rango horario seleccionado en la fecha seleccionada", statusCode: 409 })
            return
        }
        
        const dbResult = await insertTurno(turno);
        
        if (dbResult === 'error') {
            //HTTP 500 Internal server error
            res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
            return
        }
    }

    if (turno.rangoHorario === "Manana"){
        turno.rangoHorario = "Mañana";
    }

    const nuevaFechaTurnoString = turno.fecha.toString();
    const nuevaFecha = Date.parse(nuevaFechaTurnoString);
    let nuevaFechaDate = new Date(nuevaFecha);
    

    let email = "pedrovetapp@gmail.com" //solo para testear
    //let emailDestinatario = veterinarios;
    let asunto = "Nueva solicitud de turno"
    let texto = `¡Un cliente solicitó un nuevo turno!
    <br><br>
    A continuación te dejamos los datos del turno.<br>
    
    Cliente: ${turno.emailOwner}<br>
    Fecha: ${nuevaFechaDate.toLocaleDateString('es-AR')}<br>
    Rango horario: ${turno.rangoHorario}<br>
    Perro: ${turno.perroNombre}`;
    
    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
    }

    res.status(201).send('Se cargó correctamente la solicitud del turno'); //¿Cómo notifico que se guardó para el año sig también?
}


export const modificarTurnoController = async (req:Request, res:Response) => {

   const id:number = req.body.turnoId;
   const emailOwner:string = req.body.emailOwner;
   const perroId:number = req.body.perroId;
   const perroNombre:string = req.body.perroNombre;
   const motivo:string = req.body.motivo;
   const fecha:Date = req.body.fecha;
   const rango:string = req.body.rango;
   
    
   const result1 = await getCantDeTurnosRangoHorarioFechab(fecha,rango);

    if (result1 === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
    if (result1.length >= 20) { 
        res.status(409).send({ data: "No hay disponibilidad de turnos para el rango horario seleccionado en la fecha seleccionada", statusCode: 409 })
        return
    }

    const result = await modificarTurno(id,perroId,perroNombre,motivo,fecha,rango);

    if (result === 'error'){
        //HTTP 500 Internal server error
        res.status(500).send("posible error en base de datos")
        return
    }

    let email = "pedrovetapp@gmail.com" //solo para testear
    //let emailDestinatario = veterinarios;
    let asunto = "Solicitud de turnoModificado"
    let texto = `¡Un cliente solicitó un nuevo turno!
    <br><br>
    A continuación te dejamos los datos del turno.<br>
    
    Cliente: ${emailOwner}<br>
    Fecha: ${fecha}<br>
    Rango horario: ${rango}<br>
    Perro: ${perroNombre}`;
    
    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
    }


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

    const turnoInfo = await getTurno(turno);
    if (turnoInfo === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }
    
    
    if (turnoInfo.rangoHorario === "Manana"){
        turnoInfo.rangoHorario = "Mañana";
    }

    const nuevaFechaTurnoString = turnoInfo.fecha.toString();
    const nuevaFecha = Date.parse(nuevaFechaTurnoString);
    let nuevaFechaDate = new Date(nuevaFecha);
    

    let email = turnoInfo.emailOwner//solo para testear
    //let emailDestinatario = ${emailOwner};
    let asunto = "Turno Aceptado"
    let texto = `¡Su turno fue aceptado!
    <br><br>
    A continuación te dejamos los datos del turno.
    <br>
    Fecha: ${nuevaFechaDate.toLocaleDateString('es-AR')}<br>
    Rango horario: ${turnoInfo.rangoHorario}<br>
    Perro: ${turnoInfo.perroNombre}`;
    
    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
    }


    res.status(201).send('Se aceptó correctamente el turno');
}





export const rechazarTurnoController = async(req:Request, res:Response) => {
    let turno:number = req.body.idTurnoSelec;
    let justificacion:string = req.body.justificacion;

    let fechaParaRecomendar:Date= new Date();
    let recomendacion:Date = new Date();
    let encontreFecha:boolean = false;

    const dbResult = await rechazarTurno(true,turno);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    const turnoInfo = await getTurno(turno);
    if (turnoInfo === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    fechaParaRecomendar.setTime(turnoInfo.fecha.getTime());

    while (encontreFecha === false) {
        fechaParaRecomendar.setDate(fechaParaRecomendar.getDate()+1);

        const cantTurnos = await getCantDeTurnosRangoHorarioFechab(fechaParaRecomendar,turnoInfo.rangoHorario);
        if (cantTurnos === 'error') {
            //HTTP 500 Internal server error
            res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
            return
        }
        if (cantTurnos.length < 20) {
            recomendacion = fechaParaRecomendar;
            encontreFecha = true;
        }
    }

    if (turnoInfo.rangoHorario === "Manana"){
        turnoInfo.rangoHorario = "Mañana";
    }

    const nuevaFechaTurnoString = turnoInfo.fecha.toString();
    const nuevaFecha = Date.parse(nuevaFechaTurnoString);
    let nuevaFechaDate = new Date(nuevaFecha);

    const nuevaFechaTurnoStringR = recomendacion.toString();
    const nuevaFechaR = Date.parse(nuevaFechaTurnoStringR);
    let nuevaFechaDateR = new Date(nuevaFechaR);
    
    let email = turnoInfo.emailOwner //solo para testear
    //let emailDestinatario = ${emailOwner};
    let asunto = "Turno Rechazado"
    let texto = `Disculpe las molestias, su turno ha sido rechazado.
    <br><br>
    
    A continuación te dejamos los datos del turno rechazado.<br>
    Fecha: ${nuevaFechaDate.toLocaleDateString('es-AR')}<br>
    Rango horario: ${turnoInfo.rangoHorario}<br>
    Perro: ${turnoInfo.perroNombre}<br><br>

    Justificación del veterinario: ${justificacion}<br>
    Sugerencia para el nuevo turno, la fecha con disponibilidad más próxima: ${nuevaFechaDateR.toLocaleDateString('es-AR')}`;
    
    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
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
    turno.finalizado = true;
    req.body = turno;

    let vacunas = req.body.vacunas;
    let antiparasitarios = req.body.antiparasitarios;
    let castrado = req.body.castrado;
    let peso = req.body.peso;
    let precio = req.body.precioIngresado;
    let descuentoCliente = req.body.descuentoCliente
    let descuento50 = precio * 50 / 100;

    if (descuentoCliente <= descuento50) {
        turno.precio = precio - descuentoCliente;
    }
    if (descuentoCliente > descuento50) {
        turno.precio = precio - descuento50;
    }

    
    const dbResult = await insertUrgencia(turno);
    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    const dbResultLibreta = await actualizarLibreta(turno.perroId,vacunas,antiparasitarios,castrado,peso);
    if (dbResultLibreta === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

}

export const archivarTurnoController = async (req:Request, res:Response) => {
    let turno:number = req.body.idTurnoSelec;
    
    const dbResult = await archivarTurno(turno);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se archivó correctamente el turno');
}



