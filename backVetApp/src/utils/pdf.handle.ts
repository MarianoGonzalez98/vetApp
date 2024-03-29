//const PDFDocument = require('pdfkit')
import PDFDocument from "pdfkit";
import getStream from 'get-stream';
import { Donacion, PaymentID } from "../interfaces/Donaciones.interface";
import { ItemCarrito } from "../interfaces/Carrito.interface";
import { getProductosPorCarritoDB } from "../services/productos.service";

export const generatePDF = async (content:string) => {
    const doc = new PDFDocument()
    doc.image('static/Logo1.png',400,30,{fit: [100, 100]})
    doc.image('static/mercadoPago_logo.png',400,140,{fit: [100, 100]})
    doc.y = 300
    doc.text(content, 50, 50)
    doc.end()
    let pdfResult = await getStream.buffer(doc);
    return pdfResult;
}

export const generateComprobanteDonacion = async (donacion:(Donacion&PaymentID)) => {
    let contenidoPDF= `
    COMPROBANTE DE DONACIÓN

    Email del donante: ${donacion.emailDonante}
    Campaña: ${donacion.nombreCampaign}
    Fecha y hora: ${new Date(donacion.fechaHora).toLocaleDateString("es-AR")} ${new Date(donacion.fechaHora).toLocaleTimeString("es-AR",{timeStyle: 'short'})} 
    Monto neto donado: $${donacion.monto}

    Numero identificador de pago: ${donacion.paymentId}
`
    let pdf = await generatePDF(contenidoPDF);
    return pdf;
}


export const generateComprobantePagoCompra = async (carrito:ItemCarrito[],email:string) => {

    const productos = await getProductosPorCarritoDB(carrito);
    if (productos==='error'){
        console.log("Carrito que fallo: ");
        console.log(carrito);
        return await generatePDF('Falla al generar pdf del carrito');
    }

    const detalles = carrito.map( item => ({
        cant:item.cant,
        ...productos.find( prod => prod.id=item.idProducto)
    }) )
    let stringProductos="";
    detalles.forEach( detalle => {
        stringProductos+=`
        Nombre del producto: ${detalle.nombre}
        Marca del produtco: ${detalle.marca}
        Cantidad comprada: ${detalle.cant}
        `
    });

    let contenidoPDF= `
        COMPROBANTE DE COMPRA

        Email del comprador: ${email}
        Fecha y hora: ${new Date().toLocaleDateString("es-AR")} ${new Date().toLocaleTimeString("es-AR",{timeStyle: 'short'})} 

        Productos comprados:
        ${stringProductos}
    `
    let pdf = await generatePDF(contenidoPDF);
    return pdf;
}