import { Request, Response } from "express";
import { sendMailTest } from "../utils/mailer.handle";



export const mandarMailController = async (req: Request, res: Response) => {
    const emailData = req.body.emailData;
    let asunto=emailData.asunto;
    let texto=emailData.cuerpo;
    sendMailTest(emailData.emailDestino,asunto,texto);
};