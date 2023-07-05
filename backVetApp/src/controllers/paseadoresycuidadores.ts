import { Request, Response } from "express"
import { PaseadorCuidador } from "../interfaces/PaseadoresYCuidadores.interface";
import { getPaseadorCuidador, getPaseadoresCuidadores, insertPaseadorCuidador, puntuarPC, toggleDisponible } from "../services/paseadorescuidadores.service";
import { sendMailTest } from "../utils/mailer.handle";

export const cargarPaseadorCuidadorController = async (req: Request, res: Response) => {
    const paseadorcuidador: PaseadorCuidador = req.body;

    const result = await getPaseadorCuidador(paseadorcuidador.email);
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    if (result) { //si devuelve un elemento es que existe el paseador
        //409 conflict
        res.status(409).send({ data: "El email del pasesador ya se encuentra cargado", statusCode: 409 })
        return
    }

    const dbResult = await insertPaseadorCuidador(paseadorcuidador);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se cargó correctamente el paseador/cuidador');
}

export const listarPaseadoresCuidadoresController = async (req: Request, res: Response) => {
    const result = await getPaseadoresCuidadores();

    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }
    console.log(result);
    res.status(200).send({ data: result, statusCode: 200 })
}

export const cambiarDisponibleController = async (req: Request, res: Response) => {
    const paseadorcuidador: PaseadorCuidador = req.body;

    const dbResult = await toggleDisponible(paseadorcuidador);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se actualizó correctamente la disponibilidad del paseador/cuidador');
}

export const enviarMailController = async (req: Request, res: Response) => {
    const emailInfo = req.body;

    let email = emailInfo.emailDestinatario;
    let asunto = "¡Un cliente de ¡Oh my dog! te contactó!"
    let texto = `¡Un cliente de ¡Oh my dog! está interesado en tus servicios!<br>
    <br>
    A continuación te dejamos los datos del cliente para que puedas comunicarte directamente con él.<br>
    <br>
    Nombre: ${emailInfo.nombre}<br>
    Apellido: ${emailInfo.apellido}<br>
    Teléfono: ${emailInfo.telefono}<br>
    Email: ${emailInfo.emailRemitente}`;

    if (emailInfo.mensaje != "") {
        texto += `<br>
        <br>
        Mensaje del cliente: ${emailInfo.mensaje}`;
    }

    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
    }


    email = "pedrovetapp@gmail.com"; //solo para la demo
    asunto = "Un cliente contactó a un paseador/cuidador a través del sistema"
    texto = `A continuación se muestran los datos del contacto.<br>
    <br>
    Email del cliente: ${emailInfo.emailRemitente}<br>
    Email del paseador/cuidador: ${emailInfo.emailDestinatario}<br>
    Mensaje: ${emailInfo.mensaje}`;

    try {
        await sendMailTest(email, asunto, texto);
    } catch (error) {
        console.log(error);
    }

    res.status(201).send('Se envió correctamente el mail al paseador/cuidador y a la veterinaria');
}

export const puntuarPCController = async (req: Request, res: Response) => {
    const puntuacion = req.body;

    const paseadorcuidador = await getPaseadorCuidador(puntuacion.email);
    if (paseadorcuidador === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    paseadorcuidador.totalEstrellas += puntuacion.estrellas;
    paseadorcuidador.cantPuntuaciones ++;

    const dbResult = await puntuarPC(paseadorcuidador);

    if (dbResult === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(201).send('Se puntuó correctamente al paseador/cuidador');
}