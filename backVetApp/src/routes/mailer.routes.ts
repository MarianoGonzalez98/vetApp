import { Router } from "express";
import { mandarMailController } from "../controllers/mailer";

export const MailerRouter = Router();
MailerRouter.post("/send-mail", mandarMailController);