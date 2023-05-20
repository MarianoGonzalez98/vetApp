import { Router } from "express"
import { checkJWT } from "../middleware/session"
import { checkRol } from "../middleware/checkRol"
import { cambiarDisponibleController, cargarPaseadorCuidadorController, enviarMailController, listarPaseadoresCuidadoresController } from "../controllers/paseadoresycuidadores";

export const PaseadoresCuidadoresRouter = Router();

PaseadoresCuidadoresRouter.post("/cargar-paseadorcuidador", checkJWT, checkRol, cargarPaseadorCuidadorController);
PaseadoresCuidadoresRouter.get("/listar-paseadorescuidadores", listarPaseadoresCuidadoresController)
PaseadoresCuidadoresRouter.put("/cambiar-disponible", checkJWT, checkRol, cambiarDisponibleController)
PaseadoresCuidadoresRouter.post("/enviar-mail-pc", enviarMailController);