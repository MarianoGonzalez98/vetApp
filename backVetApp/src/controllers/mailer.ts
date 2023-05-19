import { Request, Response } from "express";
import { sendMailTest } from "../utils/mailer.handle";



export const mandarMailController = async (req: Request, res: Response) => {
    const emailData = req.body.emailData;
    let asunto=emailData.asunto;
    let texto=emailData.cuerpo;
    
    console.log("EMAIL SE MANDA CON DATOS:");
    console.log(emailData);

    try {
        /* await sendMailTest(emailData.emailDestino,asunto,texto); */
        console.log(emailData);
    } catch (error) {
        res.status(424).send("Falla en envio de mail.") //424 (Failed Dependency)
        return
    }
    res.status(200).send("Email enviado correctamente");
};