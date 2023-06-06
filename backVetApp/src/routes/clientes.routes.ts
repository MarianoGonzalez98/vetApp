import { Router } from "express"
import { checkJWT } from "../middleware/session";
import { getClienteJuliController, getClientesCompletosController, getClientesController } from "../controllers/clientes";
import { checkRol } from "../middleware/checkRol";



export const ClientesRouter = Router();

ClientesRouter.get('/clientes', checkJWT, getClientesController);
ClientesRouter.get('/listar-clientes', checkJWT, checkRol, getClientesCompletosController);
ClientesRouter.get('/clienteJuli', checkJWT, getClienteJuliController);