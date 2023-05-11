import { Router } from "express"
import { cargarPerroController } from "../controllers/perros"
import { checkJWT } from "../middleware/session"
import { checkRol } from "../middleware/checkRol"

const PerrosRouter = Router();

PerrosRouter.post("/cargar-perro", checkJWT, cargarPerroController);
PerrosRouter.get("/listar-perros", checkJWT, listarPerrosController);

export { PerrosRouter }