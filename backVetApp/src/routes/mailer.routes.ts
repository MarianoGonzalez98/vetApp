import { Router } from "express";
import { mandarMailController } from "../controllers/mailer";

const MailerRouter = Router();
MailerRouter.post("/send-mail", mandarMailController);