import { Antiparasitario, Perro, Vacuna } from "../interfaces/Perro.interface";
import { actualizarAntiparasitario, actualizarCastracion, actualizarConsultaGeneral, actualizarVacunacion, getPerroJuli } from "../services/perros.service"
import { Request, Response } from "express"
import { actualizarDescripcion } from "../services/turno.service";
import { resetearMontoAcumulado } from "../services/clientes.service";

export const finalizarAtencionVacunacionController = async (req:Request, res:Response) => {
    let id:number = req.body.id;
    let vacuna:Vacuna = req.body.vacunaAplicada;
    let peso:number = req.body.peso;

    let turnoId:number = req.body.turnoId;
    let observacion:string = req.body.observacion;
    let precio:number = req.body.precio;
    let descuentoCliente:number = req.body.descuentoCliente
    let descuento50: number = precio * 50 / 100;
    let precioFinal:number = 0;
    let emailOwner:string = req.body.emailOwner;

    if (descuentoCliente <= descuento50) {
        precioFinal = precio - descuentoCliente;
    }
    if (descuentoCliente > descuento50) {
        precioFinal = precio - descuento50;
    }


    const perro = await getPerroJuli(id);
    if (perro === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    let vacunas: Vacuna[] =  JSON.parse(perro.vacunas);
    vacunas.push(vacuna);
    

    const result = await actualizarVacunacion(id, JSON.stringify(vacunas),peso); 
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const result2 = await actualizarDescripcion(turnoId,observacion,precioFinal);
    if (result2 === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const dbResultResetDesc = await resetearMontoAcumulado(emailOwner);
    if (dbResultResetDesc === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }

    res.status(200).send({ data: result, statusCode: 200 })
}


export const finalizarAtencionCastracionController = async (req:Request, res:Response) => {
    let id:number = req.body.id;
    let castrado:boolean = req.body.castrado;
    let peso:number = req.body.peso;

    let turnoId:number = req.body.turnoId;
    let observacion:string = req.body.observacion;
    let precio:number = req.body.precio;
    let descuentoCliente:number = req.body.descuentoCliente
    let descuento50: number = precio * 50 / 100;
    let precioFinal:number = 0;
    let emailOwner:string = req.body.emailOwner;

    if (descuentoCliente <= descuento50) {
        precioFinal = precio - descuentoCliente;
    }
    if (descuentoCliente > descuento50) {
        precioFinal = precio - descuento50;
    }

    const perro = await getPerroJuli(id);
    if (perro === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }


    const result = await actualizarCastracion(id,castrado,peso); 
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const result2 = await actualizarDescripcion(turnoId,observacion,precioFinal);
    if (result2 === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const dbResultResetDesc = await resetearMontoAcumulado(emailOwner);
    if (dbResultResetDesc === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }


    res.status(200).send({ data: result, statusCode: 200 })
}

export const finalizarAtencionAntiparasitacionController = async (req:Request, res:Response) => {
    let id:number = req.body.id;
    let antiparasitario:Antiparasitario = req.body.antiparasitarioAplicado;
    let peso:number = req.body.peso;

    let turnoId:number = req.body.turnoId;
    let observacion:string = req.body.observacion;
    let precio:number = req.body.precio;
    let descuentoCliente:number = req.body.descuentoCliente
    let descuento50: number = precio * 50 / 100;
    let precioFinal:number = 0;
    let emailOwner:string = req.body.emailOwner;

    if (descuentoCliente <= descuento50) {
        precioFinal = precio - descuentoCliente;
    }
    if (descuentoCliente > descuento50) {
        precioFinal = precio - descuento50;
    }

    const perro = await getPerroJuli(id);
    if (perro === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    let antiparasitarios: Antiparasitario[] =  JSON.parse(perro.antiparasitarios);
    antiparasitarios.push(antiparasitario);

    const result = await actualizarAntiparasitario(id,JSON.stringify(antiparasitarios),peso); 
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const result2 = await actualizarDescripcion(turnoId,observacion,precioFinal);
    if (result2 === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const dbResultResetDesc = await resetearMontoAcumulado(emailOwner);
    if (dbResultResetDesc === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }


    res.status(200).send({ data: result, statusCode: 200 })
}

export const finalizarAtencionConsultaGeneralController = async (req:Request, res:Response) => {
    let id:number = req.body.id;
    let peso:number = req.body.peso;

    let turnoId:number = req.body.turnoId;
    let observacion:string = req.body.observacion;
    let precio:number = req.body.precio;
    let descuentoCliente:number = req.body.descuentoCliente
    let descuento50: number = precio * 50 / 100;
    let precioFinal:number = 0;
    let emailOwner:string = req.body.emailOwner;

    if (descuentoCliente <= descuento50) {
        precioFinal = precio - descuentoCliente;
    }
    if (descuentoCliente > descuento50) {
        precioFinal = precio - descuento50;
    }

    const perro = await getPerroJuli(id);
    if (perro === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }


    const result = await actualizarConsultaGeneral(id,peso); 
    if (result === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const result2 = await actualizarDescripcion(turnoId,observacion,precioFinal);
    if (result2 === "error") {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "posible error en base de datos", statusCode: 500 })
        return
    }

    const dbResultResetDesc = await resetearMontoAcumulado(emailOwner);
    if (dbResultResetDesc === 'error') {
        //HTTP 500 Internal server error
        res.status(500).send({ data: "Posible error en base de datos", statusCode: 500 })
        return
    }


    res.status(200).send({ data: result, statusCode: 200 })
}