import { Router } from "express"
import { cargarPerroController, listarPerrosController } from "../controllers/perros"
import { checkJWT } from "../middleware/session"
import { checkRolCliente, checkRol } from "../middleware/checkRol"

export const PerrosRouter = Router();

PerrosRouter.post("/cargar-perro", checkJWT, cargarPerroController);
PerrosRouter.get("/listar-perros", checkJWT, checkRolCliente, listarPerrosController);