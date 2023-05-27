import { Router } from "express";
import { createPrefrerenceDonacionController, notificacionDonacionController } from "../controllers/mecadoPago";


export const MercadoPagoRouter = Router();
MercadoPagoRouter.post("/create_preference_donacion", createPrefrerenceDonacionController);
MercadoPagoRouter.post("/notificacion_mp_donacion", notificacionDonacionController);