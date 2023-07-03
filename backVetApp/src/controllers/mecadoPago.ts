import { Request, Response } from "express";
import * as mercadopago from "mercadopago";
import { Campaign, Donacion, PaymentID } from "../interfaces/Donaciones.interface";
import { sendMailWithAttachment } from "../utils/mailer.handle";
import { generateComprobanteDonacion, generatePDF } from "../utils/pdf.handle";
import { insertDonacion, sumarAMontoRecaudadoDeCampaign } from "../services/donaciones.service";
import { getCliente, sumarAMontoAcumuladoDescuentoCliente } from "../services/clientes.service";
import { ItemCarrito } from "../interfaces/Carrito.interface";
import { insertCompraDB } from "../services/compras.service";
import { getPrecioTotalCompraDB } from "../services/productos.service";

const ngrokURL= 'https://c48a-186-127-125-154.ngrok-free.app'; // acá hay que colocar la url que da ngrok en el momento.
// comando: ngrok http 3000


export const createPrefrerenceCompraProductosController = async (req: Request, res: Response) => {
    console.log("Configurando MercadoPagoCompraProductos")
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN || "",
    });
    const productos:ItemCarrito[] = req.body.productosAComprar;
    const emailComprador:string = req.body.emailComprador;

    const precioTotal = await getPrecioTotalCompraDB(productos);
    if (precioTotal === 'error'){
        res.status(500).send("error bd en calculo de precio total");
        return;
    }
    if (precioTotal === "menor_stock"){
        res.status(200).send({status:'out_of_stock'})
        return;
    }
    const idReserva = await insertCompraDB(productos,emailComprador);
    if (idReserva==='error'){
        res.status(500).send("error bd en reserva de compra");
        return;
    }
    //preparo la url de la notificacion junto con los datos que necesitaré para identificarla
    var donacionNotificationUrl = new URL(ngrokURL+"/notificacion_mp_compraProductos");
    donacionNotificationUrl.searchParams.append("idReserva",idReserva.toString());

    let preference = {
        items: [
            {
                title: `Compra de productos`,
                unit_price: precioTotal,
                quantity: 1,
            }
        ],
        back_urls: {
            "success": "http://localhost:5173/productos",
            "failure": "http://localhost:5173/productos",
            "pending": "http://localhost:5173/productos"
        },
        notification_url: donacionNotificationUrl.toString(), //cambiar url de ngrok
        //date_of_expiration: "2024-05-30T23:59:59.000-04:00"
        expires: true,
        expiration_date_from: new Date().toISOString().slice(0, -1)+"-00:00",
        expiration_date_to: new Date(Date.now()+(1 * 60 * 1000)).toISOString().slice(0, -1)+"-00:00",
    };
//new Date(Date.now()+(1 * 60 * 1000)).toISOString()

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                status:'ok',
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });
    //res.send();
}

export const createPrefrerenceDonacionController = async (req: Request, res: Response) => {
    console.log("Configurando MercadoPAgo")
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN || "",
    });
    const monto:number = req.body.monto;
    const campaign:Campaign = req.body.campaign;
    const emailDonante:string = req.body.emailDonante;

    //preparo la url de la notificacion junto con los datos que necesitaré para identificarla
    var donacionNotificationUrl = new URL(ngrokURL+"/notificacion_mp_donacion");
    donacionNotificationUrl.searchParams.append("campaignNombre",campaign.nombre);
    donacionNotificationUrl.searchParams.append('emailDonante',emailDonante)

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
    res.send();

/*     console.log("QUERY de notificacion::")
    console.log(req.query); */
    const emailDonante= req.query.emailDonante as string;
    const campaignNombre = req.query.campaignNombre;
    //console.log("Configurando")
    mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN || "",
    });
    
    //console.log("NOTIFICACION MP:::::::::::::::::::::");
    const {body, query} = req;
    //console.log({body,query});
    const topic = query.topic || query.type;
    //console.log("TOPIC:");
    //console.log({topic});

    switch (topic){
        case "payment":
            const paymentId = query.id || query['data.id'];
            //console.log(topic,"obteniendo payment : ",paymentId);
            const payment = await mercadopago.payment.findById(Number(paymentId));
            const montoNetoDonado:number = Number(payment.body.transaction_details.net_received_amount);
/*             console.log("PAYMENT-----------")
            console.log("STATUS:::");
            console.log(payment.body.status)
            console.log("TRANSACTIONS DETAIL:::")
            console.log(payment.body.transaction_details);
            console.log(montoNetoDonado);
            console.log("FIN PAYMENT-----------") */
            
            if (payment.body.status==="approved"){ 
                ///----SE EJECUTA SI SE REALIZO EL PAGO DE LA DONACION-----------
                //registro en base de datos la donacion

                const donacion:(Donacion&PaymentID) = {
                    emailDonante:emailDonante,
                    monto:montoNetoDonado,
                    fechaHora: new Date().toISOString(),
                    nombreCampaign:String(campaignNombre),
                    paymentId:Number(paymentId),
                }

                const resultInsertDonacion = await insertDonacion(donacion)
                if (resultInsertDonacion==="error"){
                    console.log("Error al guardar la donacion");
                    return
                }

                if (resultInsertDonacion === "repetido"){ //porque mercado pago me manda varias veces la notificacion y no quiero registrarla mas de una vez
                    return
                }
                const clienteConEmail = await getCliente(emailDonante);
                if (clienteConEmail ==='error'){
                    console.log("Error al ver si hay cliente en donacion");
                    return
                }

                if (clienteConEmail){ //significa que el que hizo la donacion es cliente
                    //le sumo al montoAcumuladoDescuendo del cliente un 20% de la donacion
                    const montoDescuento = montoNetoDonado * 0.20; 
                    const sumaResult = await sumarAMontoAcumuladoDescuentoCliente(clienteConEmail.email,montoDescuento)
                    if (sumaResult === 'error'){
                        console.log("Error en suma de la donacion al cliente");
                    }
                }
                
                const resultSumaRecaudadoCampaign = await sumarAMontoRecaudadoDeCampaign(String(campaignNombre),montoNetoDonado);
                if (resultSumaRecaudadoCampaign === 'error'){
                    console.log("Error en suma de la donacion a lo recaudado por la campaña");
                }

                //envio email con pdf
                let pdf = await generateComprobanteDonacion(donacion);
                try {
                    await sendMailWithAttachment(emailDonante,
                        `Comprobante de donacion a la campaña ${campaignNombre}`,
                        `Su comprobante de la donacion a la campaña ${campaignNombre} se encuentra en el pdf adjunto. Monto neto donado: ${montoNetoDonado}`,
                        pdf,
                        `comprobanteDonacion${campaignNombre}.pdf`
                    );
                } catch (error) {
                    console.log("Falla de envio de mail en notificacionDonacionController")
                    console.log(error);
                }

                console.log("DONACION REGISTRADA");
            }
/*             console.log(topic,"obteniendo merchand order");
            const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id); */
            break
    }
}