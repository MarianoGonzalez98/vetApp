import { Request, Response } from "express"
import { sendMailTest } from "../utils/mailer.handle";


const sendMailController = (req:Request, res:Response) => {
    //sendMailTest(unMail,asunto,texto);
    res.send("se mando mail");
}


export {sendMailController};