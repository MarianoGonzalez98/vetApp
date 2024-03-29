import { Router } from "express"
import { actualizarPerroController, cambiarDisponibleParaCruzaController, cargarPerroController, enviarMailCruzaController, getPerroController, getPerroJuliController, listarPerrosController, listarPerrosParaCruzaController, marcarComoFallecidoController } from "../controllers/perros"
import { checkJWT } from "../middleware/session"
import { checkRolCliente, checkRol } from "../middleware/checkRol"

export const PerrosRouter = Router();

PerrosRouter.post("/cargar-perro", checkJWT, cargarPerroController);
PerrosRouter.get("/listar-perros", checkJWT, listarPerrosController);
PerrosRouter.put("/marcar-como-fallecido", checkJWT, checkRol, marcarComoFallecidoController)
PerrosRouter.get("/get-perro", checkJWT, getPerroController)
PerrosRouter.put("/actualizar-perro", checkJWT, actualizarPerroController)
PerrosRouter.get("/get-perroJuli", checkJWT, checkRol, getPerroJuliController)
PerrosRouter.put("/cambiar-disponible-para-cruza", checkJWT, checkRolCliente, cambiarDisponibleParaCruzaController)
PerrosRouter.get("/listar-perros-para-cruza", checkJWT, checkRolCliente, listarPerrosParaCruzaController);
PerrosRouter.post("/enviar-mail-perro-cruza", checkJWT, checkRolCliente, enviarMailCruzaController);