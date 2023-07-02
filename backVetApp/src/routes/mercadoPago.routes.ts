import { Router } from "express";
import { createPrefrerenceCompraProductosController, createPrefrerenceDonacionController, notificacionDonacionController } from "../controllers/mecadoPago";


export const MercadoPagoRouter = Router();
MercadoPagoRouter.post("/create_preference_donacion", createPrefrerenceDonacionController);
MercadoPagoRouter.post("/notificacion_mp_donacion", notificacionDonacionController);

MercadoPagoRouter.post("/create_prefrerence_compraProductos", createPrefrerenceCompraProductosController);