import { Router } from "express"
import { SolicitarTurnoController, aceptarTurnoController, cancelarTurnoController, listarTurnosClienteController, listarTurnosVeterinarioController, modificarTurnoController, rechazarTurnoController, registrarUrgenciaController } from "../controllers/turnos";
import { checkJWT } from "../middleware/session"
import { checkRol, checkRolCliente } from "../middleware/checkRol"

const TurnosRouter = Router();

TurnosRouter.post("/turnos/turnos-form", checkJWT, SolicitarTurnoController)
TurnosRouter.post("/turnos/urgencia-form",checkJWT,registrarUrgenciaController)
TurnosRouter.get("/turnos/listar-turnos/cliente",checkJWT,checkRolCliente,listarTurnosClienteController)
TurnosRouter.get("/turnos/listar-turnos/veterinario",checkJWT,checkRol,listarTurnosVeterinarioController)

TurnosRouter.post("/turnos/aceptar-turno",checkJWT,aceptarTurnoController)
TurnosRouter.post("/turnos/rechazar-turno",checkJWT,rechazarTurnoController)

TurnosRouter.post("/turnos/cancelar-turno",checkJWT,cancelarTurnoController)
TurnosRouter.post("/turnos/modificar-turno",checkJWT,modificarTurnoController)


export { TurnosRouter}