//const PDFDocument = require('pdfkit')
import PDFDocument from "pdfkit";
import getStream from 'get-stream';
import { Donacion, PaymentID } from "../interfaces/Donaciones.interface";

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