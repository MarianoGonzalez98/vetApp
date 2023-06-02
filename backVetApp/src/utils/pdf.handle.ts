//const PDFDocument = require('pdfkit')
import PDFDocument from "pdfkit";
import getStream from 'get-stream';

export const generatePDF = async (content:string) => {
    const doc = new PDFDocument()
    doc.y = 300
    doc.text(content, 50, 50)
    doc.end()
    let pdfResult = await getStream.buffer(doc);
    return pdfResult;
}
