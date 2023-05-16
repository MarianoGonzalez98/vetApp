import { Router } from "express"
import { checkJWT } from "../middleware/session"
import { checkRolCliente, checkRol } from "../middleware/checkRol"
import { cargarPaseadorCuidadorController } from "../controllers/paseadoresycuidadores";

export const PaseadoresCuidadoresRouter = Router();

PaseadoresCuidadoresRouter.post("/cargar-paseadorcuidador", checkJWT, checkRol, cargarPaseadorCuidadorController);