import { Router } from "express"
import { checkJWT } from "../middleware/session";
import { getClientesController } from "../controllers/clientes";



export const ClientesRouter = Router();

ClientesRouter.get('/clientes', checkJWT,  getClientesController);