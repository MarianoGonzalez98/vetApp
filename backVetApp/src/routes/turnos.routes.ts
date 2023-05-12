import { Router } from "express"
import { SolicitarTurnoController } from "../controllers/turnos";
import { checkJWT } from "../middleware/session"
import { checkRolCliente } from "../middleware/checkRol"

const TurnosRouter = Router();

TurnosRouter.post("/turnos/turnos-form", checkJWT, SolicitarTurnoController)


export { TurnosRouter}