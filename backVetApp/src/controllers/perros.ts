import { Request, Response } from "express";
import { actualizarPerro, getPerro, getPerroJuli, getPerros, insertPerro, marcarComoFallecido } from "../services/perros.service"
import { Perro } from "../interfaces/Perro.interface"
import { cancelarTurno, getTurnosPerro } from "../services/turno.service";
import { sendMailController } from "./test";
import { sendMailTest } from "../utils/mailer.handle";

export const cargarPerroController = async (req: Request, res: Response) => {
    const perro: Perro = req.body;

    const result = await getPerro(perro.owner, perro.nombre);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (result) { //si devuelve un elemento es que existe el perro
        //409 conflict
        res.status(409).send({ data: "El nombre del perro ya se encuentra registrado para ese cliente", statusCode: 409 })
        return
    }

    const dbResult = await insertPerro(perro);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se cargó correctamente al perro');
}

export const listarPerrosController = async (req: Request, res: Response) => {
    const owner: string = req.query.cliente as string;

    const result = await getPerros(owner);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({ data: result, statusCode: 200 })
}

export const getPerroController = async (req: Request, res: Response) => {
    const owner: string = req.query.owner as string;
    const nombre: string = req.query.nombre as string;

    const result = await getPerro(owner, nombre);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({ data: result, statusCode: 200 })
}

export const marcarComoFallecidoController = async (req: Request, res: Response) => {
    const perro: Perro = req.body;

    const dbResult = await marcarComoFallecido(perro);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    let turnos = getTurnosPerro(perro.id);

    let mensajeCliente = `Se cancelaron los siguientes turnos pendientes correspondientes al perro ${perro.nombre}`;
    let mensajeVeterinario = mensajeCliente + ` del cliente ${perro.owner}:<br><br>`;
    mensajeCliente += ":<br><br>";

    for (const turno of await turnos) {
        cancelarTurno(turno.id);
        mensajeCliente += `Fecha: ${turno.fecha.toJSON().slice(0, 10)} - Rango horario: ${turno.rangoHorario} - Motivo: ${turno.motivo}`;
        mensajeVeterinario += `Fecha: ${turno.fecha.toJSON().slice(0, 10)} - Rango horario: ${turno.rangoHorario} - Motivo: ${turno.motivo}`;
        if (turno.descripcion !== null) {
            mensajeCliente += ` - Descripción de urgencia: ${turno.descripcion}`;
            mensajeVeterinario += ` - Descripción de urgencia: ${turno.descripcion}`;
        }
        mensajeCliente += ".<br>";
        mensajeVeterinario += ".<br>";
    }

    let emailCliente = perro.owner;
    let asuntoCliente = `Cancelación de los turnos de ${perro.nombre}`

    let emailVeterinario = "pedrovetapp@gmail.com"; //solo para la demo
    let asuntoVeterinario = asuntoCliente + ` del cliente ${perro.owner}`;

    try {
        await sendMailTest(emailCliente, asuntoCliente, mensajeCliente);
        await sendMailTest(emailVeterinario, asuntoVeterinario, mensajeVeterinario);
    } catch (error) {
        console.log(error);
    }

    res.status(201).send('Se marcó correctamente el perro como fallecido.');
}

export const actualizarPerroController = async (req: Request, res: Response) => {
    const perro: Perro = req.body;
    const nombreAnterior = req.body.nombreAnterior;

    const result = await getPerro(perro.owner, perro.nombre);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if ((result) && (result.nombre !== nombreAnterior)) { //si devuelve un elemento es que existe el perro
        //409 conflict
        res.status(409).send({ data: "El nombre del perro ya se encuentra registrado para ese cliente", statusCode: 409 })
        return
    }

    const dbResult = await actualizarPerro(perro, nombreAnterior);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se actualizó correctamente la información del perro.');
}


export const getPerroJuliController = async (req: Request, res: Response) => {
    const id: string= req.query.id as string;
    const idNumber:number = +id;

    const result = await getPerroJuli(idNumber);

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    res.status(200).send({ data: result, statusCode: 200 })
}