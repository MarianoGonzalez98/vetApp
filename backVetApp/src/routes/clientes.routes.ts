import { Router } from "express"
import { checkJWT } from "../middleware/session";
import { getClientesController } from "../controllers/clientes";
import { checkRol } from "../middleware/checkRol";



export const ClientesRouter = Router();

ClientesRouter.get('/clientes', checkJWT, getClientesController);
ClientesRouter.get('/listar-clientes', checkJWT, checkRol, getClientesController);