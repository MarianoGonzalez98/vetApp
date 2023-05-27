import { Request, Response } from "express";
import * as mercadopago from "mercadopago";
import { Campaign } from "../interfaces/Donaciones.interface";
//const mercadopago = require("mercadopago");

export const createPrefrerenceDonacionController = async (req: Request, res: Response) => {
    console.log("Configurando")
    mercadopago.configure({
        access_token: "TEST-4664934486174510-010415-11e61427f31f86cf06bc92cdba2ab972-131223255",
    });
    const monto:number = req.body.monto;
    const campaign:Campaign = req.body.campaign;

    console.log(req.body);
    console.log(req.body);
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
        notification_url:`https://1e51-186-127-125-154.ngrok-free.app/notificacion_mp_donacion`, //cambiar url de ngrok
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
    console.log("Configurando")
    mercadopago.configure({
        access_token: "TEST-4664934486174510-010415-11e61427f31f86cf06bc92cdba2ab972-131223255",
    });
    
    console.log("NOTIFICACION MP:");
    const {body, query} = req;
    console.log({body,query});

    const topic = query.topic || query.type;
    console.log("TOPIC:");
    console.log({topic});

    switch (topic){
        case "payment":
            const paymentId = query.id || query['data.id'];
            console.log(topic,"obteniendo payment : ",paymentId);
            const payment = await mercadopago.payment.findById(Number(paymentId)); //ver si funciona!!!!
            console.log("PAYMENT-----------")
            console.log(payment);
            console.log("FIN PAYMENT-----------")
            console.log(topic,"obteniendo merchand order");
            const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
            break
    }

    res.send(); //devuelvo ok status a MP
}