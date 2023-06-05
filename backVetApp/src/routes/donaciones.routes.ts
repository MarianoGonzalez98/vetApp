import { Router } from "express";
import { checkJWT } from "../middleware/session";
import { checkRol } from "../middleware/checkRol";
import { crearCampaignController, descargarComprobanteDonacionController, listarCampaignsController, listarMisDonacionesController } from "../controllers/donaciones";

export const DonacionesRouter = Router();

DonacionesRouter.post("/donaciones/crear-campaign", checkJWT, checkRol, crearCampaignController);
DonacionesRouter.get("/donaciones/listar-campaigns", listarCampaignsController);
DonacionesRouter.get("/donaciones/ver-mis-donaciones",checkJWT,listarMisDonacionesController);
DonacionesRouter.post("/donaciones/descargar-comprobante",checkJWT,descargarComprobanteDonacionController)