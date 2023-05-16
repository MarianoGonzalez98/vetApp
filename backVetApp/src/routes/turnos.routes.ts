import { Router } from "express"
import { SolicitarTurnoController, listarTurnosClienteController, listarTurnosVeterinarioController, registrarUrgenciaController } from "../controllers/turnos";
import { checkJWT } from "../middleware/session"
import { checkRol, checkRolCliente } from "../middleware/checkRol"

const TurnosRouter = Router();

TurnosRouter.post("/turnos/turnos-form", checkJWT, SolicitarTurnoController)
TurnosRouter.post("/turnos/urgencia-form",checkJWT,registrarUrgenciaController)
TurnosRouter.get("/turnos/listar-turnos/cliente",checkJWT,checkRolCliente,listarTurnosClienteController)
TurnosRouter.get("/turnos/listar-turnos/veterinario",checkJWT,checkRol,listarTurnosVeterinarioController)


export { TurnosRouter}