import { Request, Response } from "express";
import * as mercadopago from "mercadopago";
import { Campaign } from "../interfaces/Donaciones.interface";
import { sendMailWithAttachment } from "../utils/mailer.handle";
import { generatePDF } from "../utils/pdf.handle";

const ngrokURL= 'https://b3de-186-127-125-154.ngrok-free.app'; // acá hay que colocar la url que da ngrok en el momento.
// comando: ngrok http 3000

export const createPrefrerenceDonacionController = async (req: Request, res: Response) => {
    console.log("Configurando MercadoPAgo")
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN || "",
    });
    const monto:number = req.body.monto;
    const campaign:Campaign = req.body.campaign;
    const emailDonante:string = req.body.emailDonante;

    console.log("Cuerpo recibido por la createPreferenceDonacionController: ");
    console.log(req.body);

    //preparo la url de la notificacion junto con los datos que necesitaré para identificarla
    var donacionNotificationUrl = new URL(ngrokURL+"/notificacion_mp_donacion");
    donacionNotificationUrl.searchParams.append("campaignNombre",campaign.nombre);
    donacionNotificationUrl.searchParams.append('emailDonante',emailDonante)

    console.log(donacionNotificationUrl);
    let preference = {
        items: [
            {
                title: `Donación para la campaña ${campaign.nombre}`,
                unit_price: monto,
                quantity: 1,
            }
        ],
        back_urls: {
            "success": "http://localhost:5173/donaciones",
            "failure": "http://localhost:5173/donaciones",
            "pending": "http://localhost:5173/donaciones"
        },
        notification_url: donacionNotificationUrl.toString(), //cambiar url de ngrok
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });
    //res.send();
}


export const notificacionDonacionController = async (req: Request, res: Response) => {

    console.log("QUERY de notificacion::")
    console.log(req.query);
    const emailDonante= req.query.emailDonante as string;
    const campaignNombre = req.query.campaignNombre;
    console.log("Configurando")
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN || "",
    });
    
    console.log("NOTIFICACION MP:::::::::::::::::::::");
    const {body, query} = req;
    console.log({body,query});
    const topic = query.topic || query.type;
    console.log("TOPIC:");
    console.log({topic});

    switch (topic){
        case "payment":
            const paymentId = query.id || query['data.id'];
            //console.log(topic,"obteniendo payment : ",paymentId);
            const payment = await mercadopago.payment.findById(Number(paymentId));
            console.log("PAYMENT-----------")
            console.log("STATUS:::");
            console.log(payment.body.status)
            console.log("TRANSACTIONS DETAIL:::")
            console.log(payment.body.transaction_details);
            console.log(payment.body.transaction_details.net_received_amount);
            console.log("FIN PAYMENT-----------")
            
            if (payment.body.status==="approved"){
                //registro en base de datos la donacion

                //envio email con pdf
                let contenidoPDF= `
                    COMPROBANTE DE DONACION

                    EMAIL DEL DONANTE: ${emailDonante}
                    CAMPAÑA: ${campaignNombre}
                    MONTO DONADO: ${payment.body.transaction_details.net_received_amount}
                `
                let pdf = await generatePDF(contenidoPDF);
                try {
                    await sendMailWithAttachment(emailDonante,
                        "Comprobante de donacion",
                        "Su comprobante se encuentra en el pdf adjunto",
                        pdf,
                        "comprobante.pdf");
                } catch (error) {
                    console.log("Falla de envio de mail en notificacionDonacionController")
                    console.log(error);
                }
            }

/*             console.log(topic,"obteniendo merchand order");
            const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id); */
            break
    }

    res.send(); //devuelvo ok status a MP
}