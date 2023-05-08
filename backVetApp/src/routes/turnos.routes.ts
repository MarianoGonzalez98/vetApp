import { Router } from "express"

import { getTurno,getTurnos } from "../controllers/turnos";

const TurnosRouter = Router();
const URL="/api/turnos"
/* 
    http://localhost:3000/api/turnos
*/
TurnosRouter.get(URL, getTurnos)

TurnosRouter.get(URL+"/:id", getTurno)
export { TurnosRouter}