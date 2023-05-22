import { Router } from "express"
import { actualizarPerroController, cargarPerroController, getPerroController, listarPerrosController, marcarComoFallecidoController } from "../controllers/perros"
import { checkJWT } from "../middleware/session"
import { checkRolCliente, checkRol } from "../middleware/checkRol"

export const PerrosRouter = Router();

PerrosRouter.post("/cargar-perro", checkJWT, cargarPerroController);
PerrosRouter.get("/listar-perros", checkJWT, listarPerrosController);
PerrosRouter.put("/marcar-como-fallecido", checkJWT, checkRol, marcarComoFallecidoController)
PerrosRouter.get("/get-perro", checkJWT, checkRol, getPerroController)
PerrosRouter.put("/actualizar-perro", checkJWT, checkRol, actualizarPerroController)