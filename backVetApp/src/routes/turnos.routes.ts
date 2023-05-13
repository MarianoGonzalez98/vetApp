import { Router } from "express"
import { SolicitarTurnoController, registrarUrgenciaController } from "../controllers/turnos";
import { checkJWT } from "../middleware/session"
import { checkRolCliente } from "../middleware/checkRol"

const TurnosRouter = Router();

TurnosRouter.post("/turnos/turnos-form", checkJWT, SolicitarTurnoController)
TurnosRouter.post("/turnos/urgencia-form",checkJWT,registrarUrgenciaController)



export { TurnosRouter}