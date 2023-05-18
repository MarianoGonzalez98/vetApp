import { Request, Response } from "express"
import { PaseadorCuidador } from "../interfaces/PaseadoresYCuidadores.interface";
import { getPaseadorCuidador, getPaseadoresCuidadores, insertPaseadorCuidador, toggleDisponible } from "../services/paseadorescuidadores.service";
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

    let email = "felipetamburri@gmail.com" //solo para testear
    //let emailDestinatario = req.body.emailRemitente;
    let asunto = "¡Un cliente de ¡Oh my dog! te contactó!"
    let texto = `¡Un cliente de ¡Oh my dog! está interesado en tus servicios!
    
    A continuación te dejamos los datos del cliente para que puedas comunicarte directamente con él.
    
    Nombre: ${emailInfo.nombre}
    Apellido: ${emailInfo.apellido}
    Teléfono: ${emailInfo.telefono}
    Email: ${emailInfo.emailRemitente}`;

    if (emailInfo.mensaje != "") {
        texto += `
        
        Mensaje del cliente: ${emailInfo.mensaje}`;
    }

    sendMailTest(email, asunto, texto);

    res.status(201).send('Se envió correctamente el mail al paseador/cuidador y a la veterinaria');
}