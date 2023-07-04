import { Router } from "express";
import { createPrefrerenceCompraProductosController, createPrefrerenceDonacionController, notificacionCompraProductoController, notificacionDonacionController } from "../controllers/mecadoPago";


export const MercadoPagoRouter = Router();
MercadoPagoRouter.post("/create_preference_donacion", createPrefrerenceDonacionController);
MercadoPagoRouter.post("/notificacion_mp_donacion", notificacionDonacionController);

MercadoPagoRouter.post("/create_prefrerence_compraProductos", createPrefrerenceCompraProductosController);
MercadoPagoRouter.post("/notificacion_mp_compraProductos", notificacionCompraProductoController);