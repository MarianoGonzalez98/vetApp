import { Router } from "express"
import { SolicitarTurnoController, aceptarTurnoController, archivarTurnoController, cancelarTurnoController, listarTurnosClienteController, listarTurnosVeterinarioController, modificarTurnoController, rechazarTurnoController, registrarUrgenciaController } from "../controllers/turnos";
import { checkJWT } from "../middleware/session"
import { checkRol, checkRolCliente } from "../middleware/checkRol"
import { finalizarAtencionAntiparasitacionController, finalizarAtencionCastracionController, finalizarAtencionConsultaGeneralController, finalizarAtencionVacunacionController } from "../controllers/finalizarAtencion";

const TurnosRouter = Router();

TurnosRouter.post("/turnos/turnos-form", checkJWT, SolicitarTurnoController)
TurnosRouter.post("/turnos/urgencia-form",checkJWT,registrarUrgenciaController)
TurnosRouter.get("/turnos/listar-turnos/cliente",checkJWT,checkRolCliente,listarTurnosClienteController)
TurnosRouter.get("/turnos/listar-turnos/veterinario",checkJWT,checkRol,listarTurnosVeterinarioController)

TurnosRouter.post("/turnos/aceptar-turno",checkJWT,aceptarTurnoController)
TurnosRouter.post("/turnos/rechazar-turno",checkJWT,rechazarTurnoController)

TurnosRouter.post("/turnos/cancelar-turno",checkJWT,cancelarTurnoController)
TurnosRouter.post("/turnos/modificar-turno",checkJWT,modificarTurnoController)
TurnosRouter.post("/turnos/archivar-turno",checkJWT,archivarTurnoController)

TurnosRouter.post("/turnos/finalizar-turno-vacunacion",checkJWT,finalizarAtencionVacunacionController)
TurnosRouter.post("/turnos/finalizar-turno-castracion",checkJWT,finalizarAtencionCastracionController)
TurnosRouter.post("/turnos/finalizar-turno-antiparasitacion",checkJWT,finalizarAtencionAntiparasitacionController)
TurnosRouter.post("/turnos/finalizar-turno-consultaGeneral",checkJWT,finalizarAtencionConsultaGeneralController)


export { TurnosRouter}